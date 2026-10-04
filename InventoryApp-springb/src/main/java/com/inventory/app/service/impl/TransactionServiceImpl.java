package com.inventory.app.service.impl;

import com.inventory.app.dto.Response;
import com.inventory.app.dto.TransactionDto;
import com.inventory.app.dto.TransactionRequest;
import com.inventory.app.entity.Product;
import com.inventory.app.entity.Supplier;
import com.inventory.app.entity.Transaction;
import com.inventory.app.entity.User;
import com.inventory.app.enums.TransactionStatus;
import com.inventory.app.enums.TransactionType;
import com.inventory.app.exceptions.NameValueRequiredException;
import com.inventory.app.exceptions.NotFoundException;
import com.inventory.app.repository.ProductRepository;
import com.inventory.app.repository.SupplierRepository;
import com.inventory.app.repository.TransactionRepository;
import com.inventory.app.service.TransactionService;
import com.inventory.app.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class TransactionServiceImpl implements TransactionService {

    private final TransactionRepository transactionRepository;

    private final SupplierRepository supplierRepository;

    private final ProductRepository productRepository;

    private final ModelMapper modelMapper;

    private final UserService userService;

    @Override
    public Response restockInventory(TransactionRequest transactionRequest) {
        Long productId = transactionRequest.getProductId();
        Long supplierId = transactionRequest.getSupplierId();
        Integer quantity = transactionRequest.getQuantity();

        if(supplierId == null) throw new NameValueRequiredException("Supplier id is required");
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new NotFoundException("Product not found"));
        Supplier supplier = supplierRepository.findById(supplierId)
                .orElseThrow(() -> new NotFoundException("Supplier not found"));
        User user = userService.getCurrentLoggedInUser();
        product.setStockQuantity(product.getStockQuantity() + quantity);
        productRepository.save(product);
        Transaction transaction = Transaction.builder()
                .transactionType(TransactionType.PURCHASE)
                .status(TransactionStatus.COMPLETED)
                .product(product)
                .user(user)
                .supplier(supplier)
                .totalProducts(quantity)
                .totalPrice(product.getPrice().multiply(BigDecimal.valueOf(quantity)))
                .description(transactionRequest.getDescription())
                .build();
        transactionRepository.save(transaction);

        return Response.builder()
                .status(200)
                .message("Transaction made successfully")
                .build();
    }

    @Override
    public Response sell(TransactionRequest transactionRequest) {
        Long productId = transactionRequest.getProductId();
        Integer quantity = transactionRequest.getQuantity();

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new NotFoundException("Product not found"));
        User user = userService.getCurrentLoggedInUser();
        product.setStockQuantity(product.getStockQuantity() - quantity);
        productRepository.save(product);
        Transaction transaction = Transaction.builder()
                .transactionType(TransactionType.SALE)
                .status(TransactionStatus.COMPLETED)
                .product(product)
                .user(user)
                .totalProducts(quantity)
                .totalPrice(product.getPrice().multiply(BigDecimal.valueOf(quantity)))
                .description(transactionRequest.getDescription())
                .build();
        transactionRepository.save(transaction);

        return Response.builder()
                .status(200)
                .message("Transaction sold successfully")
                .build();
    }

    @Override
    public Response returnToSupplier(TransactionRequest transactionRequest) {
        Long productId = transactionRequest.getProductId();
        Long supplierId = transactionRequest.getSupplierId();
        Integer quantity = transactionRequest.getQuantity();

        if(supplierId == null) throw new NameValueRequiredException("Supplier id is required");
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new NotFoundException("Product not found"));
        Supplier supplier = supplierRepository.findById(supplierId)
                .orElseThrow(() -> new NotFoundException("Supplier not found"));
        User user = userService.getCurrentLoggedInUser();
        product.setStockQuantity(product.getStockQuantity() - quantity);
        productRepository.save(product);
        Transaction transaction = Transaction.builder()
                .transactionType(TransactionType.RETURN_TO_SUPPLIER)
                .status(TransactionStatus.PROCESSING)
                .product(product)
                .user(user)
                .supplier(supplier)
                .totalProducts(quantity)
                .totalPrice(BigDecimal.ZERO)
                .description(transactionRequest.getDescription())
                .build();
        transactionRepository.save(transaction);

        return Response.builder()
                .status(200)
                .message("Transaction returned to supplier successfully")
                .build();
    }

    @Override
    public Response getAllTransactions(int page, int size, String searchText) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
        Page<Transaction> transactionPage = transactionRepository.searchTransactions(searchText, pageable);
        List<TransactionDto> transactionDtoList = modelMapper
                .map(transactionPage.getContent(), new TypeToken<List<TransactionDto>>() {}.getType());
        transactionDtoList.forEach(transactionDtoItem -> {
            transactionDtoItem.setUser(null);
            transactionDtoItem.setProduct(null);
            transactionDtoItem.setSupplier(null);
        });

        return Response.builder()
                .status(200)
                .message("Success")
                .transactions(transactionDtoList)
                .build();
    }

    @Override
    public Response getTransactionById(Long id) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Transaction not found"));
        TransactionDto transactionDto = modelMapper.map(transaction, TransactionDto.class);
        transactionDto.getUser().setTransactions(null);

        return Response.builder()
                .status(200)
                .message("Success")
                .transaction(transactionDto)
                .build();
    }

    @Override
    public Response getAllTransactionsByMonthAndYear(int month, int year) {
        List<Transaction> transactions = transactionRepository.findAllByMonthAndYear(month, year);
        List<TransactionDto> transactionDtoList = modelMapper
                .map(transactions, new TypeToken<List<TransactionDto>>() {}.getType());
        transactionDtoList.forEach(transactionDtoItem -> {
            transactionDtoItem.setUser(null);
            transactionDtoItem.setProduct(null);
            transactionDtoItem.setSupplier(null);
        });

        return Response.builder()
                .status(200)
                .message("Success")
                .transactions(transactionDtoList)
                .build();
    }

    @Override
    public Response updateTransactionStatus(Long transactionId, TransactionStatus transactionStatus) {
        Transaction existingTransaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new NotFoundException("Transaction not found"));
        existingTransaction.setStatus(transactionStatus);
        existingTransaction.setUpdatedAt(LocalDateTime.now());
        transactionRepository.save(existingTransaction);

        return Response.builder()
                .status(200)
                .message("Transaction updated successfully")
                .build();
    }
}

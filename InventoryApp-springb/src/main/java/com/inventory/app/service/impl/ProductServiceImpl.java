package com.inventory.app.service.impl;

import com.inventory.app.dto.ProductDto;
import com.inventory.app.dto.Response;
import com.inventory.app.entity.Category;
import com.inventory.app.entity.Product;
import com.inventory.app.exceptions.NotFoundException;
import com.inventory.app.repository.CategoryRepository;
import com.inventory.app.repository.ProductRepository;
import com.inventory.app.service.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    private final CategoryRepository categoryRepository;

    private final ModelMapper modelMapper;

    private static final String IMAGE_DIRECTORY = System.getProperty("user.dir") + "/product-image/";

    private static final String IMAGE_DIRECTORY_FRONTEND =
            "C:/Users/Korisnik/Desktop/JavaProjects/InventoryApp/InventoryApp-ang/public/products/";


    @Override
    public Response saveProduct(ProductDto productDto, MultipartFile imageFile) {
        Category category = categoryRepository.findById(productDto.getCategoryId())
                .orElseThrow(() -> new NotFoundException("Category not found"));
        Product productToSave = Product.builder()
                .name(productDto.getName())
                .sku(productDto.getSku())
                .price(productDto.getPrice())
                .stockQuantity(productDto.getStockQuantity())
                .description(productDto.getDescription())
                .category(category)
                .build();
        if(imageFile != null) {
            String imagePath = saveImageFrontend(imageFile);
            productToSave.setImageUrl(imagePath);
        }
        productRepository.save(productToSave);

        return Response.builder()
                .status(200)
                .message("Product added successfully")
                .build();
    }

    @Override
    public Response updateProduct(ProductDto productDto, MultipartFile imageFile) {
        Product existingProduct = productRepository.findById(productDto.getProductId())
                .orElseThrow(() -> new NotFoundException("Product not found"));
        if(imageFile != null) {
            String imagePath = saveImageFrontend(imageFile);
            existingProduct.setImageUrl(imagePath);
        }
        if(productDto.getCategoryId() != null && productDto.getCategoryId() > 0) {
            Category category = categoryRepository.findById(productDto.getCategoryId())
                    .orElseThrow(() -> new NotFoundException("Category not found"));
            existingProduct.setCategory(category);
        }
        if(productDto.getName() != null && !productDto.getName().isBlank()) {
            existingProduct.setName(productDto.getName());
        }
        if(productDto.getSku() != null && !productDto.getSku().isBlank()) {
            existingProduct.setSku(productDto.getSku());
        }
        if(productDto.getDescription() != null && !productDto.getDescription().isBlank()) {
            existingProduct.setDescription(productDto.getDescription());
        }
        if(productDto.getPrice() != null && productDto.getPrice().compareTo(BigDecimal.ZERO) >= 0) {
            existingProduct.setPrice(productDto.getPrice());
        }
        if(productDto.getStockQuantity() != null && productDto.getStockQuantity() >= 0) {
            existingProduct.setStockQuantity(productDto.getStockQuantity());
        }
        productRepository.save(existingProduct);

        return Response.builder()
                .status(200)
                .message("Product updated successfully")
                .build();
    }

    @Override
    public Response getAllProducts() {
        List<Product> products = productRepository.findAll(Sort.by(Sort.Direction.DESC, "id"));
        List<ProductDto> productDtoList = modelMapper.map(products, new TypeToken<List<ProductDto>>() {}.getType());

        return Response.builder()
                .status(200)
                .message("Success")
                .products(productDtoList)
                .build();
    }

    @Override
    public Response getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Product not found"));

        return Response.builder()
                .status(200)
                .message("Success")
                .product(modelMapper.map(product, ProductDto.class))
                .build();
    }

    @Override
    public Response deleteProduct(Long id) {
        productRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Product not found"));
        productRepository.deleteById(id);

        return Response.builder()
                .status(200)
                .message("Product deleted successfully")
                .build();
    }

    private String saveImage(MultipartFile imageFile) {
        if(!imageFile.getContentType().startsWith("image/")) {
            throw new IllegalArgumentException("Only image files are allowed");
        }
        File directory = new File(IMAGE_DIRECTORY);

        if(!directory.exists()) {
            directory.mkdir();
            log.info("Directory was created");
        }
        String uniqueFileName = UUID.randomUUID() + "_" + imageFile.getOriginalFilename();
        String imagePath = IMAGE_DIRECTORY + uniqueFileName;
        try {
            File destinationFile = new File(imagePath);
            imageFile.transferTo(destinationFile);
        } catch (Exception e) {
            throw new IllegalArgumentException("Error occurred while saving image" + e.getMessage());
        }
        return imagePath;
    }

    private String saveImageFrontend(MultipartFile imageFile) {
        if(!imageFile.getContentType().startsWith("image/")) {
            throw new IllegalArgumentException("Only image files are allowed");
        }
        File directory = new File(IMAGE_DIRECTORY_FRONTEND);

        if(!directory.exists()) {
            directory.mkdir();
            log.info("Directory was created");
        }
        String uniqueFileName = UUID.randomUUID() + "_" + imageFile.getOriginalFilename();
        String imagePath = IMAGE_DIRECTORY_FRONTEND + uniqueFileName;
        try {
            File destinationFile = new File(imagePath);
            imageFile.transferTo(destinationFile);
        } catch (Exception e) {
            throw new IllegalArgumentException("Error occurred while saving image" + e.getMessage());
        }
        return "products/" + uniqueFileName;
    }
}

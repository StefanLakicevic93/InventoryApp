package com.inventory.app.service;

import com.inventory.app.dto.Response;
import com.inventory.app.dto.TransactionRequest;
import com.inventory.app.enums.TransactionStatus;

public interface TransactionService {

    Response restockInventory(TransactionRequest transactionRequest);

    Response sell(TransactionRequest transactionRequest);

    Response returnToSupplier(TransactionRequest transactionRequest);

    Response getAllTransactions(int page, int size, String searchText);

    Response getTransactionById(Long id);

    Response getAllTransactionsByMonthAndYear(int month, int year);

    Response updateTransactionStatus(Long transactionId, TransactionStatus transactionStatus);

}

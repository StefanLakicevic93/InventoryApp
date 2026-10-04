package com.inventory.app.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.inventory.app.enums.UserRole;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Response {

    private int status;

    private String message;

    private String token;

    private UserRole role;

    private String expirationTime;

    private Integer totalPages;

    private Long totalElements;

    private UserDto user;

    private List<UserDto> users;

    private SupplierDto supplier;

    private List<SupplierDto> suppliers;

    private CategoryDto category;

    private List<CategoryDto> categories;

    private ProductDto product;

    private List<ProductDto> products;

    private TransactionDto transaction;

    private List<TransactionDto> transactions;

    private final LocalDateTime timeStamps = LocalDateTime.now();

}

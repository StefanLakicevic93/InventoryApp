package com.inventory.app.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.inventory.app.enums.TransactionStatus;
import com.inventory.app.enums.TransactionType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class TransactionDto {

    private Long id;

    private Integer totalProducts;

    private BigDecimal totalPrice;

    private String description;

    private TransactionType transactionType;

    private TransactionStatus status;

    private LocalDateTime updatedAt;

    private LocalDateTime createdAt;

    private UserDto user;

    private ProductDto product;

    private SupplierDto supplier;

}

package com.finance.app.pfm_full_stack_backend.dto.transaction;

import com.finance.app.pfm_full_stack_backend.entity.Transaction;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record CreateTransactionDTO(
        @NotBlank
        String description,

        @NotNull
        @Positive
        BigDecimal amount,

        @NotNull
        LocalDate date,

        @NotNull
        Transaction.TransactionType type,

        UUID categoryId
) { }

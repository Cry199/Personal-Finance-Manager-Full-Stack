package com.finance.app.pfm_full_stack_backend.dto.transaction;

import com.finance.app.pfm_full_stack_backend.entity.Transaction;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record CreateTransactionDTO(
        String description,
        BigDecimal amount,
        LocalDate date,
        Transaction.TransactionType type,
        UUID categoryId
) { }

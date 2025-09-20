package com.finance.app.pfm_full_stack_backend.dto.transaction;

import com.finance.app.pfm_full_stack_backend.dto.category.CategoryInfoDTO;
import com.finance.app.pfm_full_stack_backend.entity.Transaction;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record TransactionResponseDTO(
        UUID id,
        String description,
        BigDecimal amount,
        LocalDate date,
        Transaction.TransactionType type,
        CategoryInfoDTO category
)
{
    public TransactionResponseDTO(Transaction transaction)
    {
        this(
                transaction.getId(),
                transaction.getDescription(),
                transaction.getAmount(),
                transaction.getDate(),
                transaction.getType(),
                transaction.getCategory() != null ? new CategoryInfoDTO(transaction.getCategory()) : null
        );
    }
}
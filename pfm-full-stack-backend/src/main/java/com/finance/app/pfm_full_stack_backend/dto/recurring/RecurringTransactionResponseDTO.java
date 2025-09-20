package com.finance.app.pfm_full_stack_backend.dto.recurring;

import com.finance.app.pfm_full_stack_backend.dto.category.CategoryInfoDTO;
import com.finance.app.pfm_full_stack_backend.entity.RecurringTransaction;
import com.finance.app.pfm_full_stack_backend.entity.Transaction;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record RecurringTransactionResponseDTO(
        UUID id,
        String description,
        BigDecimal amount,
        Transaction.TransactionType type,
        LocalDate startDate,
        LocalDate endDate,
        RecurringTransaction.RecurrencePeriod period,
        CategoryInfoDTO category
)
{
    public RecurringTransactionResponseDTO(RecurringTransaction recurring)
    {
        this(
                recurring.getId(),
                recurring.getDescription(),
                recurring.getAmount(),
                recurring.getType(),
                recurring.getStartDate(),
                recurring.getEndDate(),
                recurring.getPeriod(),
                recurring.getCategory() != null ? new CategoryInfoDTO(recurring.getCategory()) : null
        );
    }
}

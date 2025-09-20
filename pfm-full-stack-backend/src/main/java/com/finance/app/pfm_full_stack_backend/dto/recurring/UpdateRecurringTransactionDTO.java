package com.finance.app.pfm_full_stack_backend.dto.recurring;

import com.finance.app.pfm_full_stack_backend.entity.RecurringTransaction;
import com.finance.app.pfm_full_stack_backend.entity.Transaction;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record UpdateRecurringTransactionDTO(
        String description,
        @Positive BigDecimal amount,
        Transaction.TransactionType type,
        LocalDate startDate,
        LocalDate endDate,
        RecurringTransaction.RecurrencePeriod period,
        UUID categoryId
) { }

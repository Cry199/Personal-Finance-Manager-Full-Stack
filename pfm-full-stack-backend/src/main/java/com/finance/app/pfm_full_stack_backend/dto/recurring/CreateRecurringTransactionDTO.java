package com.finance.app.pfm_full_stack_backend.dto.recurring;

import com.finance.app.pfm_full_stack_backend.entity.RecurringTransaction;
import com.finance.app.pfm_full_stack_backend.entity.Transaction;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record CreateRecurringTransactionDTO(
        @NotBlank String description,
        @NotNull @Positive BigDecimal amount,
        @NotNull Transaction.TransactionType type,
        @NotNull LocalDate startDate,
        LocalDate endDate,
        @NotNull RecurringTransaction.RecurrencePeriod period,
        UUID categoryId
) { }

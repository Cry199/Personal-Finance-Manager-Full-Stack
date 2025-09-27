package com.finance.app.pfm_full_stack_backend.dto.dashboard;

import java.math.BigDecimal;

public record MonthlySummaryDTO(
        int year,
        int month,
        String monthName,
        BigDecimal totalIncome,
        BigDecimal totalExpense
) { }

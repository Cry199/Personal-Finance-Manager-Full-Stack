package com.finance.app.pfm_full_stack_backend.dto.dashboard;

import java.math.BigDecimal;

public record ExpenseByCategoryDTO(
        String categoryName,
        BigDecimal totalAmount
) { }

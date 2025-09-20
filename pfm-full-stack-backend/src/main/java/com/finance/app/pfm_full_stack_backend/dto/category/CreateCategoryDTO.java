package com.finance.app.pfm_full_stack_backend.dto.category;

import jakarta.validation.constraints.NotBlank;

public record CreateCategoryDTO(@NotBlank String name) { }
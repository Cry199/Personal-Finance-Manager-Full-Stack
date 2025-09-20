package com.finance.app.pfm_full_stack_backend.dto.category;

import com.finance.app.pfm_full_stack_backend.entity.Category;

import java.util.UUID;

public record CategoryInfoDTO(UUID id, String name)
{
    public CategoryInfoDTO(Category category)
    {
        this(category.getId(), category.getName());
    }
}

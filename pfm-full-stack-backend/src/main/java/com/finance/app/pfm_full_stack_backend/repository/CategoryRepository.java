package com.finance.app.pfm_full_stack_backend.repository;

import com.finance.app.pfm_full_stack_backend.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface CategoryRepository extends JpaRepository<Category, UUID>
{
    List<Category> findAllByUserId(UUID userId);
}

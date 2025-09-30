package com.finance.app.pfm_full_stack_backend.service.category;

import com.finance.app.pfm_full_stack_backend.dto.category.CategoryResponseDTO;
import com.finance.app.pfm_full_stack_backend.dto.category.CreateCategoryDTO;
import com.finance.app.pfm_full_stack_backend.dto.category.UpdateCategoryDTO;
import com.finance.app.pfm_full_stack_backend.entity.Category;
import com.finance.app.pfm_full_stack_backend.entity.User;
import com.finance.app.pfm_full_stack_backend.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CategoryService
{
    @Autowired
    private CategoryRepository categoryRepository;

    public Category createCategory(CreateCategoryDTO data)
    {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Category newCategory = new Category(null, data.name(), user);

        return categoryRepository.save(newCategory);
    }

    public List<CategoryResponseDTO> getCategoriesForUser()
    {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        return categoryRepository.findAllByUserId(user.getId())
                .stream()
                .map(CategoryResponseDTO::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public Category updateCategory(UUID id, UpdateCategoryDTO data)
    {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoria não encontrada"));

        if (!category.getUser().getId().equals(user.getId()))
        {
            throw new SecurityException("Acesso negado: esta categoria não lhe pertence.");
        }

        category.setName(data.name());

        return categoryRepository.save(category);
    }

    public void deleteCategory(UUID id)
    {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoria não encontrada"));

        if (!category.getUser().getId().equals(user.getId()))
        {
            throw new SecurityException("Acesso negado: não pode apagar esta categoria.");
        }

        categoryRepository.delete(category);
    }
}

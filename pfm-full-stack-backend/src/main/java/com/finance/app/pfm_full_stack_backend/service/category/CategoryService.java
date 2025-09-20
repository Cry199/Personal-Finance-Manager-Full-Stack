package com.finance.app.pfm_full_stack_backend.service.category;

import com.finance.app.pfm_full_stack_backend.dto.category.CreateCategoryDTO;
import com.finance.app.pfm_full_stack_backend.entity.Category;
import com.finance.app.pfm_full_stack_backend.entity.User;
import com.finance.app.pfm_full_stack_backend.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

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

    public List<Category> getCategoriesForUser()
    {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        return categoryRepository.findAllByUserId(user.getId());
    }
}

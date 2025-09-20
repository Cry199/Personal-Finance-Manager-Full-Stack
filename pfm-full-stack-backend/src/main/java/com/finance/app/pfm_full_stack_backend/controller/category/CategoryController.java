package com.finance.app.pfm_full_stack_backend.controller.category;


import com.finance.app.pfm_full_stack_backend.dto.category.CreateCategoryDTO;
import com.finance.app.pfm_full_stack_backend.entity.Category;
import com.finance.app.pfm_full_stack_backend.service.category.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/categories")
public class CategoryController
{
    @Autowired
    private CategoryService categoryService;

    @PostMapping
    public ResponseEntity<Category> createCategory(@RequestBody CreateCategoryDTO data)
    {
        Category newCategory = categoryService.createCategory(data);

        URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}")
                .buildAndExpand(newCategory.getId()).toUri();

        return ResponseEntity.created(uri).body(newCategory);
    }

    @GetMapping
    public ResponseEntity<List<Category>> getAllCategories()
    {
        List<Category> categories = categoryService.getCategoriesForUser();
        return ResponseEntity.ok(categories);
    }
}

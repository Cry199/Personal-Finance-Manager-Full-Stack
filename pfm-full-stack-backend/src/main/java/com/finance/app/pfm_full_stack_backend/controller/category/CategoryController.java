package com.finance.app.pfm_full_stack_backend.controller.category;


import com.finance.app.pfm_full_stack_backend.dto.category.CategoryResponseDTO;
import com.finance.app.pfm_full_stack_backend.dto.category.CreateCategoryDTO;
import com.finance.app.pfm_full_stack_backend.dto.category.UpdateCategoryDTO;
import com.finance.app.pfm_full_stack_backend.entity.Category;
import com.finance.app.pfm_full_stack_backend.service.category.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/categories")
public class CategoryController
{
    @Autowired
    private CategoryService categoryService;

    @PostMapping
    public ResponseEntity<CategoryResponseDTO> createCategory(@Valid @RequestBody CreateCategoryDTO data)
    {
        Category newCategory = categoryService.createCategory(data);
        CategoryResponseDTO responseDTO = new CategoryResponseDTO(newCategory);

        URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}")
                .buildAndExpand(newCategory.getId()).toUri();

        return ResponseEntity.created(uri).body(responseDTO);
    }

    @GetMapping
    public ResponseEntity<List<CategoryResponseDTO>> getAllCategories()
    {
        List<CategoryResponseDTO> categories = categoryService.getCategoriesForUser();
        return ResponseEntity.ok(categories);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoryResponseDTO> updateCategory(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateCategoryDTO data)
    {
        Category updatedCategory = categoryService.updateCategory(id, data);
        CategoryResponseDTO responseDTO = new CategoryResponseDTO(updatedCategory);

        return ResponseEntity.ok(responseDTO);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable UUID id)
    {
        categoryService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }
}

package com.inventory.app.service;

import com.inventory.app.dto.CategoryDto;
import com.inventory.app.dto.Response;

public interface CategoryService {

    Response createCategory(CategoryDto categoryDto);

    Response getAllCategories();

    Response getCategoryById(Long id);

    Response updateCategory(Long id, CategoryDto categoryDto);

    Response deleteCategory(Long id);

}

package com.inventory.app.service.impl;

import com.inventory.app.dto.CategoryDto;
import com.inventory.app.dto.Response;
import com.inventory.app.entity.Category;
import com.inventory.app.entity.Product;
import com.inventory.app.exceptions.NotFoundException;
import com.inventory.app.repository.CategoryRepository;
import com.inventory.app.repository.ProductRepository;
import com.inventory.app.service.CategoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    private  final ProductRepository productRepository;

    private final ModelMapper modelMapper;

    @Override
    public Response createCategory(CategoryDto categoryDto) {
        Category categoryToSave = modelMapper.map(categoryDto, Category.class);
        categoryRepository.save(categoryToSave);

        return Response.builder()
                .status(200)
                .message("Category created successfully")
                .build();
    }

    @Override
    public Response getAllCategories() {
        List<Category> categories = categoryRepository.findAll(Sort.by(Sort.Direction.DESC, "id"));
        List<CategoryDto> categoryDtoList = modelMapper.map(categories, new TypeToken<List<CategoryDto>>() {}.getType());

        return Response.builder()
                .status(200)
                .message("Success")
                .categories(categoryDtoList)
                .build();
    }

    @Override
    public Response getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Category not found"));
        CategoryDto categoryDto = modelMapper.map(category, CategoryDto.class);

        return Response.builder()
                .status(200)
                .message("Success")
                .category(categoryDto)
                .build();
    }

    @Override
    public Response updateCategory(Long id, CategoryDto categoryDto) {
        Category existingCategory = categoryRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Category not found"));
        existingCategory.setName(categoryDto.getName());
        categoryRepository.save(existingCategory);

        return Response.builder()
                .status(200)
                .message("Category updated successfully")
                .build();
    }

    @Override
    public Response deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Category not found"));

        categoryRepository.delete(category);

        return Response.builder()
                .status(200)
                .message("Category deleted successfully")
                .build();
    }

}

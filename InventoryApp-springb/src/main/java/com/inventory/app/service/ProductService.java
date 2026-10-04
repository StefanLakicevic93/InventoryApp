package com.inventory.app.service;

import com.inventory.app.dto.ProductDto;
import com.inventory.app.dto.Response;
import org.springframework.web.multipart.MultipartFile;

public interface ProductService {

    Response saveProduct(ProductDto productDto, MultipartFile imageFile);

    Response updateProduct(ProductDto productDto, MultipartFile imageFile);

    Response getAllProducts();

    Response getProductById(Long id);

    Response deleteProduct(Long id);

}

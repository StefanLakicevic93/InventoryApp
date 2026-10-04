package com.inventory.app.service.impl;

import com.inventory.app.dto.CategoryDto;
import com.inventory.app.dto.Response;
import com.inventory.app.dto.SupplierDto;
import com.inventory.app.entity.Supplier;
import com.inventory.app.exceptions.NotFoundException;
import com.inventory.app.repository.SupplierRepository;
import com.inventory.app.service.SupplierService;
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
public class SupplierServiceImpl implements SupplierService {

    private final SupplierRepository supplierRepository;

    private final ModelMapper modelMapper;

    @Override
    public Response addSupplier(SupplierDto supplierDto) {
        Supplier supplierToSave = modelMapper.map(supplierDto, Supplier.class);
        supplierRepository.save(supplierToSave);

        return Response.builder()
                .status(200)
                .message("Supplier added successfully")
                .build();
    }

    @Override
    public Response getAllSuppliers() {
        List<Supplier> suppliers = supplierRepository.findAll(Sort.by(Sort.Direction.DESC, "id"));
        List<SupplierDto> supplierDtoList = modelMapper.map(suppliers, new TypeToken<List<CategoryDto>>() {}.getType());

        return Response.builder()
                .status(200)
                .message("Success")
                .suppliers(supplierDtoList)
                .build();
    }

    @Override
    public Response getSupplierById(Long id) {
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Supplier not found"));
        SupplierDto supplierDto = modelMapper.map(supplier, SupplierDto.class);

        return Response.builder()
                .status(200)
                .message("Success")
                .supplier(supplierDto)
                .build();
    }

    @Override
    public Response updateSupplier(Long id, SupplierDto supplierDto) {
        Supplier existingSupplier = supplierRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Supplier not found"));
        if(supplierDto.getName() != null) existingSupplier.setName(supplierDto.getName());
        if(supplierDto.getAddress() != null) existingSupplier.setAddress(supplierDto.getAddress());
        supplierRepository.save(existingSupplier);

        return Response.builder()
                .status(200)
                .message("Supplier updated successfully")
                .build();
    }

    @Override
    public Response deleteSupplier(Long id) {
        supplierRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Supplier not found"));
        supplierRepository.deleteById(id);

        return Response.builder()
                .status(200)
                .message("Supplier deleted successfully")
                .build();
    }
}

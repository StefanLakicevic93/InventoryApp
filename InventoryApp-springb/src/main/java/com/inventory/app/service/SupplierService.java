package com.inventory.app.service;

import com.inventory.app.dto.Response;
import com.inventory.app.dto.SupplierDto;

public interface SupplierService {

    Response addSupplier(SupplierDto supplierDto);

    Response getAllSuppliers();

    Response getSupplierById(Long id);

    Response updateSupplier(Long id, SupplierDto supplierDto);

    Response deleteSupplier(Long id);

}

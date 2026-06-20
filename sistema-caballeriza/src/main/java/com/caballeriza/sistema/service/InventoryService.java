package com.caballeriza.sistema.service;

import com.caballeriza.sistema.model.Inventory;
import com.caballeriza.sistema.repository.InventoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class InventoryService {

    private final InventoryRepository inventoryRepository;

    public Page<Inventory> findAll(Pageable pageable) {
        return inventoryRepository.findAll(pageable);
    }

    public Inventory findById(Long id) {
        return inventoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Insumo no encontrado con id: " + id));
    }

    public Inventory save(Inventory inventory) {
        return inventoryRepository.save(inventory);
    }

    public Inventory update(Long id, Inventory data) {
        Inventory existing = findById(id);
        existing.setNombre(data.getNombre());
        existing.setTipo(data.getTipo());
        existing.setCantidad(data.getCantidad());
        existing.setUnidad(data.getUnidad());
        existing.setStockMinimo(data.getStockMinimo());
        existing.setDescripcion(data.getDescripcion());
        return inventoryRepository.save(existing);
    }

    public void delete(Long id) {
        inventoryRepository.deleteById(id);
    }

    public List<Inventory> findStockBajo() {
        return inventoryRepository.findStockBajo();
    }
}
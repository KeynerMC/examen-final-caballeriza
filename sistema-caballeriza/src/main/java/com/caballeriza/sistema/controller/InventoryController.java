package com.caballeriza.sistema.controller;

import com.caballeriza.sistema.dto.ApiResponse;
import com.caballeriza.sistema.model.Inventory;
import com.caballeriza.sistema.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
public class InventoryController {

    private final InventoryService inventoryService;
    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<Inventory>>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String tipo) {

        Pageable pageable = PageRequest.of(page, size);
        if (tipo != null) {
            return ResponseEntity.ok(ApiResponse.ok(
                    inventoryService.findAll(pageable)));
        }
        return ResponseEntity.ok(ApiResponse.ok(inventoryService.findAll(pageable)));
    }

    @GetMapping("/stock-bajo")
    public ResponseEntity<ApiResponse<List<Inventory>>> getStockBajo() {
        return ResponseEntity.ok(ApiResponse.ok(inventoryService.findStockBajo()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Inventory>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(inventoryService.findById(id)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'CUIDADOR')")
    public ResponseEntity<ApiResponse<Inventory>> create(@RequestBody Inventory inventory) {
        Inventory saved = inventoryService.save(inventory);
        if (saved.isStockBajo()) notificationService.crearAlertaStockBajo(saved);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Insumo creado", saved));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CUIDADOR')")
    public ResponseEntity<ApiResponse<Inventory>> update(
            @PathVariable Long id, @RequestBody Inventory inventory) {
        Inventory updated = inventoryService.update(id, inventory);
        if (updated.isStockBajo()) notificationService.crearAlertaStockBajo(updated);
        return ResponseEntity.ok(ApiResponse.ok("Insumo actualizado", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        inventoryService.delete(id);
        return ResponseEntity.ok(ApiResponse.ok("Insumo eliminado", null));
    }
}

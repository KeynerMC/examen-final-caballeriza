package com.caballeriza.sistema.repository;

import com.caballeriza.sistema.model.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface InventoryRepository extends JpaRepository<Inventory, Long> {
    Page<Inventory> findByTipo(Inventory.TipoInsumo tipo, Pageable pageable);

    @Query("SELECT i FROM Inventory i WHERE i.cantidad <= i.stockMinimo")
    List<Inventory> findStockBajo();
}
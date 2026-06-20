package com.caballeriza.sistema.service;

import com.caballeriza.sistema.model.Inventory;
import com.caballeriza.sistema.repository.InventoryRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class InventoryServiceTest {

    @Mock
    private InventoryRepository inventoryRepository;

    @InjectMocks
    private InventoryService inventoryService;

    @Test
    void isStockBajo_detectaCuandoCantidadEsMenorOIgualAlMinimo() {
        Inventory item = Inventory.builder()
                .nombre("Avena")
                .tipo(Inventory.TipoInsumo.ALIMENTO)
                .cantidad(new BigDecimal("5"))
                .stockMinimo(new BigDecimal("10"))
                .build();
        assertTrue(item.isStockBajo());
    }

    @Test
    void isStockBajo_falseCuandoHaySuficienteStock() {
        Inventory item = Inventory.builder()
                .nombre("Avena")
                .tipo(Inventory.TipoInsumo.ALIMENTO)
                .cantidad(new BigDecimal("50"))
                .stockMinimo(new BigDecimal("10"))
                .build();
        assertFalse(item.isStockBajo());
    }

    @Test
    void findStockBajo_delegaAlRepositorio() {
        Inventory item = Inventory.builder().nombre("Avena").cantidad(new BigDecimal("1")).stockMinimo(new BigDecimal("5")).build();
        when(inventoryRepository.findStockBajo()).thenReturn(List.of(item));
        List<Inventory> result = inventoryService.findStockBajo();
        assertEquals(1, result.size());
    }
}

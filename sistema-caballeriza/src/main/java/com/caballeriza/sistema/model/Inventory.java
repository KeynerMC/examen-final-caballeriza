package com.caballeriza.sistema.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "inventory")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Inventory {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoInsumo tipo;

    @Column(nullable = false)
    private BigDecimal cantidad;

    private String unidad;

    @Column(name = "stock_minimo", nullable = false)
    private BigDecimal stockMinimo;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() { this.createdAt = LocalDateTime.now(); this.updatedAt = LocalDateTime.now(); }

    @PreUpdate
    protected void onUpdate() { this.updatedAt = LocalDateTime.now(); }

    public boolean isStockBajo() { return this.cantidad.compareTo(this.stockMinimo) <= 0; }

    public enum TipoInsumo { ALIMENTO, MEDICINA, EQUIPAMIENTO, OTRO }
}
package com.caballeriza.sistema.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "feeding_records")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class FeedingRecord {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "feeding_plan_id", nullable = false)
    private FeedingPlan feedingPlan;

    @Column(nullable = false)
    private String tipo;

    @Column(nullable = false)
    private BigDecimal cantidad;

    private String unidad;

    @Column(name = "fecha_suministro", nullable = false)
    private LocalDateTime fechaSuministro;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "responsable_id")
    private Employee responsable;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() { this.createdAt = LocalDateTime.now(); }
}
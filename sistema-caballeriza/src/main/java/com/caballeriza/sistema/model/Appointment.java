package com.caballeriza.sistema.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "appointments")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Appointment {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "horse_id")
    private Horse horse;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id")
    private User cliente;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id")
    private Employee employee;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoCita tipo;

    @Column(name = "fecha_inicio", nullable = false)
    private LocalDateTime fechaInicio;

    @Column(name = "fecha_fin", nullable = false)
    private LocalDateTime fechaFin;

    @Enumerated(EnumType.STRING)
    private Estado estado;

    @Column(columnDefinition = "TEXT")
    private String notas;

    @Column(name = "cupo_maximo")
    private Integer cupoMaximo;

    @Column(name = "cupo_actual")
    private Integer cupoActual = 0;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.estado == null) this.estado = Estado.PENDIENTE;
    }

    public enum TipoCita { VETERINARIO, MONTA, PASEO, ENTRENAMIENTO }
    public enum Estado { PENDIENTE, CONFIRMADA, CANCELADA, COMPLETADA }
}

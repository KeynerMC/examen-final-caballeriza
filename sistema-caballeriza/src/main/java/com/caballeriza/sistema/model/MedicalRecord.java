package com.caballeriza.sistema.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "medical_records")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class MedicalRecord {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "horse_id", nullable = false)
    private Horse horse;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoRegistro tipo;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String observaciones;

    @Column(name = "responsable", nullable = false)
    private String responsable;

    @Column(name = "fecha_registro", nullable = false)
    private LocalDate fechaRegistro;

    @Column(name = "fecha_vencimiento")
    private LocalDate fechaVencimiento;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.fechaRegistro == null) this.fechaRegistro = LocalDate.now();
    }

    public enum TipoRegistro { VACUNA, TRATAMIENTO, ALERGIA, OBSERVACION }
}

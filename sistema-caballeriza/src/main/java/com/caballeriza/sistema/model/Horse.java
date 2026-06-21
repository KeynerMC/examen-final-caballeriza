package com.caballeriza.sistema.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "horses")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Horse {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El nombre es obligatorio")
    @Column(nullable = false)
    private String nombre;

    @NotBlank(message = "El identificador es obligatorio")
    @Column(unique = true, nullable = false)
    private String identificador;

    @NotNull(message = "La edad es obligatoria")
    @Min(value = 0, message = "La edad no puede ser negativa")
    @Max(value = 40, message = "La edad ingresada no es realista (máximo 40 años)")
    private Integer edad;

    private String raza;

    @Enumerated(EnumType.STRING)
    private Sexo sexo;

    @NotNull(message = "El peso es obligatorio")
    @DecimalMin(value = "20", message = "El peso es demasiado bajo para un caballo")
    @DecimalMax(value = "900", message = "El peso ingresado no es realista (máximo 900 kg)")
    private BigDecimal peso;

    @Column(name = "foto_url")
    private String fotoUrl;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "active")
    private boolean active = true;

    @OneToMany(mappedBy = "horse", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<MedicalRecord> medicalRecords;

    @OneToMany(mappedBy = "horse", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<FeedingPlan> feedingPlans;

    @PrePersist
    protected void onCreate() { this.createdAt = LocalDateTime.now(); }

    public enum Sexo { MACHO, HEMBRA }
}
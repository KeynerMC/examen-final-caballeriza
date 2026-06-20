package com.caballeriza.sistema.model;

import jakarta.persistence.*;
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

    @Column(nullable = false)
    private String nombre;

    @Column(unique = true, nullable = false)
    private String identificador;

    private Integer edad;

    private String raza;

    @Enumerated(EnumType.STRING)
    private Sexo sexo;

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
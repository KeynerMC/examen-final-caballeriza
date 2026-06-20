package com.caballeriza.sistema.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "employees")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Employee {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Rol rol;

    private String telefono;
    private String email;

    @Column(name = "active")
    private boolean active = true;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "employee", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Shift> shifts;

    @PrePersist
    protected void onCreate() { this.createdAt = LocalDateTime.now(); }

    public enum Rol { VETERINARIO, POTRADOR, CUIDADOR, ADMINISTRADOR }
}
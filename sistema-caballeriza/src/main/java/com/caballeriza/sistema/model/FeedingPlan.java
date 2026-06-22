package com.caballeriza.sistema.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "feeding_plans")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class FeedingPlan {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "horse_id", nullable = false)
    private Horse horse;

    @Column(nullable = false)
    private String nombre;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(name = "active")
    private boolean active = true;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "feedingPlan", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<FeedingRecord> records;

    @PrePersist
    protected void onCreate() { this.createdAt = LocalDateTime.now(); }
}

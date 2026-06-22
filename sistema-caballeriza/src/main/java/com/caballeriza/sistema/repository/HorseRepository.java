package com.caballeriza.sistema.repository;

import com.caballeriza.sistema.model.Horse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface HorseRepository extends JpaRepository<Horse, Long> {
    Page<Horse> findByActiveTrue(Pageable pageable);
    List<Horse> findByActiveTrue();
    boolean existsByIdentificadorAndActiveTrue(String identificador);
}
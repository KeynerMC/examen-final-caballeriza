package com.caballeriza.sistema.repository;

import com.caballeriza.sistema.model.Shift;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface ShiftRepository extends JpaRepository<Shift, Long> {
    List<Shift> findByEmployeeId(Long employeeId);
    List<Shift> findByFecha(LocalDate fecha);
    List<Shift> findByEmployeeIdAndFechaBetween(Long employeeId, LocalDate inicio, LocalDate fin);
}
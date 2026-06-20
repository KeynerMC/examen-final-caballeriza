package com.caballeriza.sistema.repository;

import com.caballeriza.sistema.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.time.LocalDateTime;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    Page<Appointment> findByTipo(Appointment.TipoCita tipo, Pageable pageable);
    Page<Appointment> findByEstado(Appointment.Estado estado, Pageable pageable);
    List<Appointment> findByFechaInicioBetween(LocalDateTime inicio, LocalDateTime fin);
    List<Appointment> findByClienteId(Long clienteId);
    Page<Appointment> findByTipoAndFechaInicioBetween(
            Appointment.TipoCita tipo, LocalDateTime inicio, LocalDateTime fin, Pageable pageable);
}

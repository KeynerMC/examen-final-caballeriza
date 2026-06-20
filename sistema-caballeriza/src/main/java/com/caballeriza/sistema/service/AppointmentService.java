package com.caballeriza.sistema.service;

import com.caballeriza.sistema.model.Appointment;
import com.caballeriza.sistema.repository.AppointmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;

    public Page<Appointment> findAll(Pageable pageable) {
        return appointmentRepository.findAll(pageable);
    }

    public Page<Appointment> findByTipo(Appointment.TipoCita tipo, Pageable pageable) {
        return appointmentRepository.findByTipo(tipo, pageable);
    }

    public List<Appointment> findByRango(LocalDateTime inicio, LocalDateTime fin) {
        return appointmentRepository.findByFechaInicioBetween(inicio, fin);
    }

    public Appointment findById(Long id) {
        return appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cita no encontrada con id: " + id));
    }

    public Appointment save(Appointment appointment) {
        return appointmentRepository.save(appointment);
    }

    public Appointment update(Long id, Appointment data) {
        Appointment existing = findById(id);
        existing.setTipo(data.getTipo());
        existing.setFechaInicio(data.getFechaInicio());
        existing.setFechaFin(data.getFechaFin());
        existing.setNotas(data.getNotas());
        existing.setCupoMaximo(data.getCupoMaximo());
        return appointmentRepository.save(existing);
    }

    public Appointment cancelar(Long id) {
        Appointment a = findById(id);
        a.setEstado(Appointment.Estado.CANCELADA);
        return appointmentRepository.save(a);
    }

    public Appointment reservarPaseo(Long id) {
        Appointment a = findById(id);
        if (a.getTipo() != Appointment.TipoCita.PASEO)
            throw new RuntimeException("Solo se pueden reservar citas de tipo PASEO");
        if (a.getCupoActual() >= a.getCupoMaximo())
            throw new RuntimeException("No hay cupos disponibles para este paseo");
        a.setCupoActual(a.getCupoActual() + 1);
        return appointmentRepository.save(a);
    }
}
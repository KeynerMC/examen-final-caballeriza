package com.caballeriza.sistema.service;

import com.caballeriza.sistema.model.Appointment;
import com.caballeriza.sistema.repository.AppointmentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AppointmentServiceTest {

    @Mock
    private AppointmentRepository appointmentRepository;

    @InjectMocks
    private AppointmentService appointmentService;

    private Appointment paseo;

    @BeforeEach
    void setUp() {
        paseo = Appointment.builder()
                .id(1L)
                .tipo(Appointment.TipoCita.PASEO)
                .fechaInicio(LocalDateTime.now())
                .fechaFin(LocalDateTime.now().plusHours(1))
                .estado(Appointment.Estado.CONFIRMADA)
                .cupoMaximo(2)
                .cupoActual(0)
                .build();
        when(appointmentRepository.findById(1L)).thenReturn(Optional.of(paseo));
        when(appointmentRepository.save(any(Appointment.class))).thenAnswer(i -> i.getArgument(0));
    }

    @Test
    void reservarPaseo_incrementaCupoActual() {
        Appointment result = appointmentService.reservarPaseo(1L);
        assertEquals(1, result.getCupoActual());
    }

    @Test
    void reservarPaseo_fallaSiNoHayCupo() {
        paseo.setCupoActual(2);
        assertThrows(RuntimeException.class, () -> appointmentService.reservarPaseo(1L));
    }

    @Test
    void reservarPaseo_fallaSiNoEsTipoPaseo() {
        paseo.setTipo(Appointment.TipoCita.VETERINARIO);
        assertThrows(RuntimeException.class, () -> appointmentService.reservarPaseo(1L));
    }

    @Test
    void cancelar_cambiaEstadoACancelada() {
        Appointment result = appointmentService.cancelar(1L);
        assertEquals(Appointment.Estado.CANCELADA, result.getEstado());
    }
}

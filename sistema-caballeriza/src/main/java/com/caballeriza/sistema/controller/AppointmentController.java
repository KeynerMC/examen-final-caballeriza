package com.caballeriza.sistema.controller;

import com.caballeriza.sistema.dto.ApiResponse;
import com.caballeriza.sistema.model.Appointment;
import com.caballeriza.sistema.service.AppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<Appointment>>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String tipo,
            @RequestParam(required = false) String estado) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("fechaInicio"));

        if (tipo != null) {
            return ResponseEntity.ok(ApiResponse.ok(
                    appointmentService.findByTipo(Appointment.TipoCita.valueOf(tipo), pageable)));
        }
        return ResponseEntity.ok(ApiResponse.ok(appointmentService.findAll(pageable)));
    }

    @GetMapping("/rango")
    public ResponseEntity<ApiResponse<List<Appointment>>> getByRango(
            @RequestParam String inicio,
            @RequestParam String fin) {
        return ResponseEntity.ok(ApiResponse.ok(
                appointmentService.findByRango(
                        LocalDateTime.parse(inicio),
                        LocalDateTime.parse(fin))));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Appointment>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(appointmentService.findById(id)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'CUIDADOR')")
    public ResponseEntity<ApiResponse<Appointment>> create(@RequestBody Appointment appointment) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Cita creada", appointmentService.save(appointment)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CUIDADOR')")
    public ResponseEntity<ApiResponse<Appointment>> update(
            @PathVariable Long id, @RequestBody Appointment appointment) {
        return ResponseEntity.ok(ApiResponse.ok("Cita actualizada", appointmentService.update(id, appointment)));
    }

    @PatchMapping("/{id}/cancelar")
    @PreAuthorize("hasAnyRole('ADMIN', 'CUIDADOR', 'CLIENTE')")
    public ResponseEntity<ApiResponse<Appointment>> cancelar(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("Cita cancelada", appointmentService.cancelar(id)));
    }

    @PatchMapping("/{id}/reservar")
    public ResponseEntity<ApiResponse<Appointment>> reservarPaseo(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("Reserva confirmada", appointmentService.reservarPaseo(id)));
    }
}

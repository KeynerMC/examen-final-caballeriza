package com.caballeriza.sistema.controller;

import com.caballeriza.sistema.dto.ApiResponse;
import com.caballeriza.sistema.model.*;
import com.caballeriza.sistema.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/employees")
@RequiredArgsConstructor
public class EmployeeController {

    private final EmployeeService employeeService;
    private final ShiftService shiftService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<Employee>>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(ApiResponse.ok(employeeService.findAll(pageable)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Employee>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(employeeService.findById(id)));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Employee>> create(@RequestBody Employee employee) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Empleado creado", employeeService.save(employee)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Employee>> update(
            @PathVariable Long id, @RequestBody Employee employee) {
        return ResponseEntity.ok(ApiResponse.ok("Empleado actualizado", employeeService.update(id, employee)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        employeeService.delete(id);
        return ResponseEntity.ok(ApiResponse.ok("Empleado eliminado", null));
    }

    @GetMapping("/{id}/shifts")
    public ResponseEntity<ApiResponse<List<Shift>>> getShifts(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(shiftService.findByEmployee(id)));
    }

    @PostMapping("/{id}/shifts")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Shift>> addShift(
            @PathVariable Long id, @RequestBody Shift shift) {
        shift.setEmployee(employeeService.findById(id));
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Turno creado", shiftService.save(shift)));
    }

    @PutMapping("/shifts/{shiftId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Shift>> updateShift(
            @PathVariable Long shiftId, @RequestBody Shift shift) {
        Shift existing = shiftService.findById(shiftId);
        existing.setFecha(shift.getFecha());
        existing.setHoraInicio(shift.getHoraInicio());
        existing.setHoraFin(shift.getHoraFin());
        existing.setTareas(shift.getTareas());
        return ResponseEntity.ok(ApiResponse.ok("Turno actualizado", shiftService.save(existing)));
    }

    @DeleteMapping("/shifts/{shiftId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteShift(@PathVariable Long shiftId) {
        shiftService.delete(shiftId);
        return ResponseEntity.ok(ApiResponse.ok("Turno eliminado", null));
    }

    @GetMapping("/shifts/fecha")
    public ResponseEntity<ApiResponse<List<Shift>>> getShiftsByFecha(
            @RequestParam String fecha) {
        return ResponseEntity.ok(ApiResponse.ok(shiftService.findByFecha(LocalDate.parse(fecha))));
    }
}
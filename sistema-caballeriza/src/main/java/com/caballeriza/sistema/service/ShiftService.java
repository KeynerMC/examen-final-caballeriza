package com.caballeriza.sistema.service;

import com.caballeriza.sistema.model.*;
import com.caballeriza.sistema.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ShiftService {

    private final ShiftRepository shiftRepository;
    private final EmployeeRepository employeeRepository;

    public List<Shift> findByEmployee(Long employeeId) {
        return shiftRepository.findByEmployeeId(employeeId);
    }

    public List<Shift> findByFecha(LocalDate fecha) {
        return shiftRepository.findByFecha(fecha);
    }

    public Shift save(Shift shift) {
        return shiftRepository.save(shift);
    }

    public Shift findById(Long id) {
        return shiftRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Turno no encontrado"));
    }

    public void delete(Long id) {
        shiftRepository.deleteById(id);
    }
}
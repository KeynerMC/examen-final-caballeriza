package com.caballeriza.sistema.service;

import com.caballeriza.sistema.model.Employee;
import com.caballeriza.sistema.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmployeeService {

    private final EmployeeRepository employeeRepository;

    public Page<Employee> findAll(Pageable pageable) {
        return employeeRepository.findByActiveTrue(pageable);
    }

    public Employee findById(Long id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Empleado no encontrado con id: " + id));
    }

    public Employee save(Employee employee) {
        return employeeRepository.save(employee);
    }

    public Employee update(Long id, Employee data) {
        Employee existing = findById(id);
        existing.setNombre(data.getNombre());
        existing.setRol(data.getRol());
        existing.setTelefono(data.getTelefono());
        existing.setEmail(data.getEmail());
        return employeeRepository.save(existing);
    }

    public void delete(Long id) {
        Employee e = findById(id);
        e.setActive(false);
        employeeRepository.save(e);
    }
}
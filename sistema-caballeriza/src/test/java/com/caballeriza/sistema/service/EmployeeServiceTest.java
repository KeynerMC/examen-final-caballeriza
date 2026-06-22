package com.caballeriza.sistema.service;

import com.caballeriza.sistema.model.Employee;
import com.caballeriza.sistema.repository.EmployeeRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EmployeeServiceTest {

    @Mock
    private EmployeeRepository employeeRepository;

    @InjectMocks
    private EmployeeService employeeService;

    @Test
    void findById_lanzaExcepcionSiNoExiste() {
        when(employeeRepository.findById(99L)).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class, () -> employeeService.findById(99L));
    }

    @Test
    void update_modificaNombreRolTelefonoYEmail() {
        Employee existing = Employee.builder()
                .id(1L).nombre("Ana").rol(Employee.Rol.CUIDADOR).telefono("8888-0000").email("ana@old.com")
                .build();
        Employee cambios = Employee.builder()
                .nombre("Ana Pérez").rol(Employee.Rol.VETERINARIO).telefono("8888-1111").email("ana@new.com")
                .build();
        when(employeeRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(employeeRepository.save(any(Employee.class))).thenAnswer(inv -> inv.getArgument(0));

        Employee result = employeeService.update(1L, cambios);

        assertEquals("Ana Pérez", result.getNombre());
        assertEquals(Employee.Rol.VETERINARIO, result.getRol());
        assertEquals("8888-1111", result.getTelefono());
        assertEquals("ana@new.com", result.getEmail());
    }

    @Test
    void delete_marcaElEmpleadoComoInactivoEnVezDeBorrarlo() {
        Employee existing = Employee.builder().id(1L).nombre("Ana").active(true).build();
        when(employeeRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(employeeRepository.save(any(Employee.class))).thenAnswer(inv -> inv.getArgument(0));

        employeeService.delete(1L);

        assertFalse(existing.isActive());
        verify(employeeRepository).save(existing);
    }
}

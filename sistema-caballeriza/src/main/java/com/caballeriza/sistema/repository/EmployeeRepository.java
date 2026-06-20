package com.caballeriza.sistema.repository;

import com.caballeriza.sistema.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    Page<Employee> findByActiveTrue(Pageable pageable);
    List<Employee> findByRolAndActiveTrue(Employee.Rol rol);
}
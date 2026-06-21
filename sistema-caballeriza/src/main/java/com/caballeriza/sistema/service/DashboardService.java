package com.caballeriza.sistema.service;

import com.caballeriza.sistema.dto.DashboardStatsResponse;
import com.caballeriza.sistema.model.*;
import com.caballeriza.sistema.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.TextStyle;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final HorseRepository horseRepository;
    private final EmployeeRepository employeeRepository;
    private final UserRepository userRepository;
    private final AppointmentRepository appointmentRepository;
    private final InventoryRepository inventoryRepository;
    private final MedicalRecordRepository medicalRecordRepository;

    public DashboardStatsResponse getStats() {
        List<Horse> caballos = horseRepository.findByActiveTrue();
        List<Employee> empleados = employeeRepository.findAll().stream()
                .filter(Employee::isActive).toList();
        List<User> usuarios = userRepository.findAll();
        List<Appointment> citas = appointmentRepository.findAll();
        List<Inventory> insumos = inventoryRepository.findAll();
        List<MedicalRecord> registrosMedicos = medicalRecordRepository.findAll();

        LocalDate hoy = LocalDate.now();

        return DashboardStatsResponse.builder()
                .totalCaballos(caballos.size())
                .totalEmpleadosActivos(empleados.size())
                .totalClientes(usuarios.stream().filter(u -> u.getRole() == User.Role.CLIENTE).count())
                .stockBajoCount(insumos.stream().filter(Inventory::isStockBajo).count())
                .citasPendientes(citas.stream().filter(c -> c.getEstado() == Appointment.Estado.PENDIENTE).count())
                .citasHoy(citas.stream()
                        .filter(c -> c.getFechaInicio() != null && c.getFechaInicio().toLocalDate().isEqual(hoy))
                        .count())
                .caballosPorSexo(caballos.stream()
                        .collect(Collectors.groupingBy(h -> h.getSexo() != null ? h.getSexo().name() : "Sin definir", Collectors.counting())))
                .caballosPorRaza(caballos.stream()
                        .collect(Collectors.groupingBy(h -> h.getRaza() != null && !h.getRaza().isBlank() ? h.getRaza() : "Sin definir", Collectors.counting())))
                .citasPorTipo(citas.stream()
                        .collect(Collectors.groupingBy(c -> c.getTipo().name(), Collectors.counting())))
                .citasPorEstado(citas.stream()
                        .collect(Collectors.groupingBy(c -> c.getEstado().name(), Collectors.counting())))
                .empleadosPorRol(empleados.stream()
                        .collect(Collectors.groupingBy(e -> e.getRol().name(), Collectors.counting())))
                .registrosMedicosPorTipo(registrosMedicos.stream()
                        .collect(Collectors.groupingBy(m -> m.getTipo().name(), Collectors.counting())))
                .inventarioPorTipo(insumos.stream()
                        .collect(Collectors.groupingBy(i -> i.getTipo().name(),
                                Collectors.summingDouble(i -> i.getCantidad().doubleValue()))))
                .citasUltimos6Meses(citasUltimos6Meses(citas))
                .build();
    }

    private List<DashboardStatsResponse.MesConteo> citasUltimos6Meses(List<Appointment> citas) {
        LocalDate inicioVentana = LocalDate.now().withDayOfMonth(1).minusMonths(5);

        Map<String, Long> porMes = citas.stream()
                .filter(c -> c.getFechaInicio() != null && !c.getFechaInicio().toLocalDate().isBefore(inicioVentana))
                .collect(Collectors.groupingBy(
                        c -> claveMes(c.getFechaInicio()),
                        Collectors.counting()));

        return java.util.stream.IntStream.rangeClosed(0, 5)
                .mapToObj(inicioVentana::plusMonths)
                .map(mes -> {
                    String clave = claveMes(mes.atStartOfDay());
                    String etiqueta = mes.getMonth().getDisplayName(TextStyle.SHORT, new Locale("es"));
                    return DashboardStatsResponse.MesConteo.builder()
                            .mes(etiqueta + " " + mes.getYear())
                            .total(porMes.getOrDefault(clave, 0L))
                            .build();
                })
                .toList();
    }

    private String claveMes(LocalDateTime fecha) {
        return fecha.getYear() + "-" + fecha.getMonthValue();
    }
}

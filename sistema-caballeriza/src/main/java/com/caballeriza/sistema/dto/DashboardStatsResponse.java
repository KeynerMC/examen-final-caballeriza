package com.caballeriza.sistema.dto;

import lombok.*;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsResponse {
    private long totalCaballos;
    private long totalEmpleadosActivos;
    private long totalClientes;
    private long stockBajoCount;
    private long citasPendientes;
    private long citasHoy;

    private Map<String, Long> caballosPorSexo;
    private Map<String, Long> caballosPorRaza;
    private Map<String, Long> citasPorTipo;
    private Map<String, Long> citasPorEstado;
    private Map<String, Long> empleadosPorRol;
    private Map<String, Long> registrosMedicosPorTipo;
    private Map<String, Double> inventarioPorTipo;
    private List<MesConteo> citasUltimos6Meses;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MesConteo {
        private String mes;
        private long total;
    }
}

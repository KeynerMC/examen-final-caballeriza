package com.caballeriza.sistema.service;

import com.caballeriza.sistema.model.*;
import com.caballeriza.sistema.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MedicalRecordService {

    private final MedicalRecordRepository medicalRecordRepository;
    private final HorseRepository horseRepository;
    private final NotificationService notificationService;

    public List<MedicalRecord> findByHorse(Long horseId) {
        return medicalRecordRepository.findByHorseIdOrderByFechaRegistroDesc(horseId);
    }

    public MedicalRecord save(MedicalRecord record) {
        MedicalRecord saved = medicalRecordRepository.save(record);
        if (saved.getFechaVencimiento() != null) {
            notificationService.crearAlertaVencimiento(saved);
        }
        return saved;
    }

    public MedicalRecord findById(Long id) {
        return medicalRecordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Registro médico no encontrado"));
    }

    public void delete(Long id) {
        medicalRecordRepository.deleteById(id);
    }

    public List<MedicalRecord> findVencimientosProximos(int dias) {
        LocalDate limite = LocalDate.now().plusDays(dias);
        return medicalRecordRepository.findVencimientosProximos(limite);
    }
}
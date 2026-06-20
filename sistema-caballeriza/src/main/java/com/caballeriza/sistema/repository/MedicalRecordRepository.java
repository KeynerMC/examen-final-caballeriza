package com.caballeriza.sistema.repository;

import com.caballeriza.sistema.model.MedicalRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.time.LocalDate;
import java.util.List;

public interface MedicalRecordRepository extends JpaRepository<MedicalRecord, Long> {
    List<MedicalRecord> findByHorseIdOrderByFechaRegistroDesc(Long horseId);
    List<MedicalRecord> findByTipo(MedicalRecord.TipoRegistro tipo);

    @Query("SELECT m FROM MedicalRecord m WHERE m.fechaVencimiento IS NOT NULL AND m.fechaVencimiento <= :fecha")
    List<MedicalRecord> findVencimientosProximos(LocalDate fecha);
}
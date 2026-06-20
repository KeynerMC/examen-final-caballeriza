package com.caballeriza.sistema.repository;

import com.caballeriza.sistema.model.FeedingRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface FeedingRecordRepository extends JpaRepository<FeedingRecord, Long> {
    List<FeedingRecord> findByFeedingPlanId(Long planId);
    List<FeedingRecord> findByFechaSuministroBetween(LocalDateTime inicio, LocalDateTime fin);
}
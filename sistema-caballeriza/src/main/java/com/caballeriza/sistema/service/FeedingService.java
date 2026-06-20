package com.caballeriza.sistema.service;

import com.caballeriza.sistema.model.*;
import com.caballeriza.sistema.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FeedingService {

    private final FeedingPlanRepository feedingPlanRepository;
    private final FeedingRecordRepository feedingRecordRepository;

    public List<FeedingPlan> findPlansByHorse(Long horseId) {
        return feedingPlanRepository.findByHorseIdAndActiveTrue(horseId);
    }

    public FeedingPlan savePlan(FeedingPlan plan) {
        return feedingPlanRepository.save(plan);
    }

    public FeedingPlan findPlanById(Long id) {
        return feedingPlanRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Plan no encontrado"));
    }

    public void deletePlan(Long id) {
        FeedingPlan plan = findPlanById(id);
        plan.setActive(false);
        feedingPlanRepository.save(plan);
    }

    public FeedingRecord saveRecord(FeedingRecord record) {
        return feedingRecordRepository.save(record);
    }

    public List<FeedingRecord> findRecordsByPlan(Long planId) {
        return feedingRecordRepository.findByFeedingPlanId(planId);
    }
}

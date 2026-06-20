package com.caballeriza.sistema.repository;

import com.caballeriza.sistema.model.FeedingPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FeedingPlanRepository extends JpaRepository<FeedingPlan, Long> {
    List<FeedingPlan> findByHorseIdAndActiveTrue(Long horseId);
}

package com.caballeriza.sistema.controller;

import com.caballeriza.sistema.dto.ApiResponse;
import com.caballeriza.sistema.model.*;
import com.caballeriza.sistema.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/feeding")
@RequiredArgsConstructor
public class FeedingController {

    private final FeedingService feedingService;
    private final HorseService horseService;

    @GetMapping("/horses/{horseId}/plans")
    public ResponseEntity<ApiResponse<List<FeedingPlan>>> getPlansByHorse(@PathVariable Long horseId) {
        return ResponseEntity.ok(ApiResponse.ok(feedingService.findPlansByHorse(horseId)));
    }

    @PostMapping("/horses/{horseId}/plans")
    @PreAuthorize("hasAnyRole('ADMIN', 'CUIDADOR', 'VETERINARIO')")
    public ResponseEntity<ApiResponse<FeedingPlan>> createPlan(
            @PathVariable Long horseId, @RequestBody FeedingPlan plan) {
        plan.setHorse(horseService.findById(horseId));
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Plan creado", feedingService.savePlan(plan)));
    }

    @DeleteMapping("/plans/{planId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CUIDADOR')")
    public ResponseEntity<ApiResponse<Void>> deletePlan(@PathVariable Long planId) {
        feedingService.deletePlan(planId);
        return ResponseEntity.ok(ApiResponse.ok("Plan eliminado", null));
    }

    @GetMapping("/plans/{planId}/records")
    public ResponseEntity<ApiResponse<List<FeedingRecord>>> getRecords(@PathVariable Long planId) {
        return ResponseEntity.ok(ApiResponse.ok(feedingService.findRecordsByPlan(planId)));
    }

    @PostMapping("/plans/{planId}/records")
    @PreAuthorize("hasAnyRole('ADMIN', 'CUIDADOR')")
    public ResponseEntity<ApiResponse<FeedingRecord>> addRecord(
            @PathVariable Long planId, @RequestBody FeedingRecord record) {
        record.setFeedingPlan(feedingService.findPlanById(planId));
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Suministro registrado", feedingService.saveRecord(record)));
    }
}
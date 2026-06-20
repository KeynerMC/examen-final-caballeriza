package com.caballeriza.sistema.controller;

import com.caballeriza.sistema.dto.ApiResponse;
import com.caballeriza.sistema.model.*;
import com.caballeriza.sistema.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/horses")
@RequiredArgsConstructor
public class HorseController {

    private final HorseService horseService;
    private final MedicalRecordService medicalRecordService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<Horse>>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "nombre") String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        return ResponseEntity.ok(ApiResponse.ok(horseService.findAll(pageable)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Horse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(horseService.findById(id)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'VETERINARIO')")
    public ResponseEntity<ApiResponse<Horse>> create(@RequestBody Horse horse) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Caballo creado", horseService.save(horse)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'VETERINARIO')")
    public ResponseEntity<ApiResponse<Horse>> update(@PathVariable Long id, @RequestBody Horse horse) {
        return ResponseEntity.ok(ApiResponse.ok("Caballo actualizado", horseService.update(id, horse)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        horseService.delete(id);
        return ResponseEntity.ok(ApiResponse.ok("Caballo eliminado", null));
    }

    @PostMapping("/{id}/photo")
    @PreAuthorize("hasAnyRole('ADMIN', 'VETERINARIO')")
    public ResponseEntity<ApiResponse<String>> uploadPhoto(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) throws IOException {
        String url = horseService.savePhoto(file);
        Horse horse = horseService.findById(id);
        horse.setFotoUrl(url);
        horseService.save(horse);
        return ResponseEntity.ok(ApiResponse.ok("Foto subida", url));
    }

    @GetMapping("/{id}/medical")
    public ResponseEntity<ApiResponse<List<MedicalRecord>>> getMedical(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(medicalRecordService.findByHorse(id)));
    }

    @PostMapping("/{id}/medical")
    @PreAuthorize("hasAnyRole('ADMIN', 'VETERINARIO')")
    public ResponseEntity<ApiResponse<MedicalRecord>> addMedical(
            @PathVariable Long id,
            @RequestBody MedicalRecord record) {
        Horse horse = horseService.findById(id);
        record.setHorse(horse);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Registro médico creado", medicalRecordService.save(record)));
    }

    @DeleteMapping("/medical/{recordId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'VETERINARIO')")
    public ResponseEntity<ApiResponse<Void>> deleteMedical(@PathVariable Long recordId) {
        medicalRecordService.delete(recordId);
        return ResponseEntity.ok(ApiResponse.ok("Registro eliminado", null));
    }
}
package com.caballeriza.sistema.service;

import com.caballeriza.sistema.model.Horse;
import com.caballeriza.sistema.repository.HorseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class HorseService {

    private final HorseRepository horseRepository;

    public Page<Horse> findAll(Pageable pageable) {
        return horseRepository.findByActiveTrue(pageable);
    }

    public Horse findById(Long id) {
        return horseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Caballo no encontrado con id: " + id));
    }

    public Horse save(Horse horse) {
        if (horse.getId() == null && horseRepository.existsByIdentificador(horse.getIdentificador())) {
            throw new RuntimeException("Ya existe un caballo con ese identificador");
        }
        return horseRepository.save(horse);
    }

    public Horse update(Long id, Horse horseData) {
        Horse existing = findById(id);
        existing.setNombre(horseData.getNombre());
        existing.setEdad(horseData.getEdad());
        existing.setRaza(horseData.getRaza());
        existing.setSexo(horseData.getSexo());
        existing.setPeso(horseData.getPeso());
        return horseRepository.save(existing);
    }

    public void delete(Long id) {
        Horse horse = findById(id);
        horse.setActive(false);
        horseRepository.save(horse);
    }

    public String savePhoto(MultipartFile file) throws IOException {
        String uploadDir = "uploads/horses/";
        Files.createDirectories(Paths.get(uploadDir));
        String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path filePath = Paths.get(uploadDir + filename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        return "/uploads/horses/" + filename;
    }
}
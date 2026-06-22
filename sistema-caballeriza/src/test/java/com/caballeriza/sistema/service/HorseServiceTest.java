package com.caballeriza.sistema.service;

import com.caballeriza.sistema.model.Horse;
import com.caballeriza.sistema.repository.HorseRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class HorseServiceTest {

    @Mock
    private HorseRepository horseRepository;

    @InjectMocks
    private HorseService horseService;

    @Test
    void findById_lanzaExcepcionSiNoExiste() {
        when(horseRepository.findById(99L)).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class, () -> horseService.findById(99L));
    }

    @Test
    void save_lanzaExcepcionSiElIdentificadorYaExiste() {
        Horse horse = Horse.builder().nombre("Relámpago").identificador("CAB-001").build();
        when(horseRepository.existsByIdentificadorAndActiveTrue("CAB-001")).thenReturn(true);

        assertThrows(RuntimeException.class, () -> horseService.save(horse));
        verify(horseRepository, never()).save(any());
    }

    @Test
    void save_guardaCuandoElIdentificadorEsNuevo() {
        Horse horse = Horse.builder().nombre("Relámpago").identificador("CAB-002").build();
        when(horseRepository.existsByIdentificadorAndActiveTrue("CAB-002")).thenReturn(false);
        when(horseRepository.save(horse)).thenReturn(horse);

        Horse result = horseService.save(horse);

        assertEquals("Relámpago", result.getNombre());
        verify(horseRepository).save(horse);
    }

    @Test
    void update_modificaSoloLosCamposPermitidosYConservaElIdentificador() {
        Horse existing = Horse.builder()
                .id(1L).nombre("Viejo nombre").identificador("CAB-003")
                .edad(5).raza("Criollo").sexo(Horse.Sexo.MACHO).peso(new BigDecimal("400"))
                .build();
        Horse cambios = Horse.builder()
                .nombre("Nuevo nombre").edad(6).raza("Árabe").sexo(Horse.Sexo.HEMBRA).peso(new BigDecimal("420"))
                .build();
        when(horseRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(horseRepository.save(any(Horse.class))).thenAnswer(inv -> inv.getArgument(0));

        Horse result = horseService.update(1L, cambios);

        assertEquals("Nuevo nombre", result.getNombre());
        assertEquals(6, result.getEdad());
        assertEquals(Horse.Sexo.HEMBRA, result.getSexo());
        assertEquals("CAB-003", result.getIdentificador());
    }

    @Test
    void delete_marcaElCaballoComoInactivoEnVezDeBorrarlo() {
        Horse existing = Horse.builder().id(1L).nombre("Relámpago").active(true).build();
        when(horseRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(horseRepository.save(any(Horse.class))).thenAnswer(inv -> inv.getArgument(0));

        horseService.delete(1L);

        assertFalse(existing.isActive());
        verify(horseRepository).save(existing);
    }
}

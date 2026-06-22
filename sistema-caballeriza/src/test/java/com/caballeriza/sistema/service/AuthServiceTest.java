package com.caballeriza.sistema.service;

import com.caballeriza.sistema.dto.AuthRequest;
import com.caballeriza.sistema.dto.AuthResponse;
import com.caballeriza.sistema.dto.RegisterRequest;
import com.caballeriza.sistema.model.User;
import com.caballeriza.sistema.repository.PasswordResetTokenRepository;
import com.caballeriza.sistema.repository.UserRepository;
import com.caballeriza.sistema.security.JwtService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private JwtService jwtService;
    @Mock private AuthenticationManager authenticationManager;
    @Mock private PasswordResetTokenRepository passwordResetTokenRepository;
    @Mock private EmailService emailService;

    @InjectMocks
    private AuthService authService;

    @Test
    void register_lanzaExcepcionSiElEmailYaEstaRegistrado() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("vet@caballeriza.com");
        request.setPassword("secreta123");
        request.setNombre("Dra. Vega");
        when(userRepository.existsByEmail("vet@caballeriza.com")).thenReturn(true);

        assertThrows(RuntimeException.class, () -> authService.register(request));
        verify(userRepository, never()).save(any());
    }

    @Test
    void register_asignaRolClientePorDefectoCuandoNoSeEspecifica() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("cliente@caballeriza.com");
        request.setPassword("secreta123");
        request.setNombre("Juan");
        request.setRole(null);

        when(userRepository.existsByEmail("cliente@caballeriza.com")).thenReturn(false);
        when(passwordEncoder.encode("secreta123")).thenReturn("hash-123");
        when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));
        when(jwtService.generateToken(any(User.class))).thenReturn("jwt-token");

        AuthResponse response = authService.register(request);

        assertEquals("CLIENTE", response.getRole());
        assertEquals("jwt-token", response.getToken());
        verify(userRepository).save(argThat(u -> u.getPassword().equals("hash-123")));
    }

    @Test
    void register_respetaElRolSolicitado() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("vet@caballeriza.com");
        request.setPassword("secreta123");
        request.setNombre("Dra. Vega");
        request.setRole(User.Role.VETERINARIO);

        when(userRepository.existsByEmail("vet@caballeriza.com")).thenReturn(false);
        when(passwordEncoder.encode(any())).thenReturn("hash-456");
        when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));
        when(jwtService.generateToken(any(User.class))).thenReturn("jwt-token");

        AuthResponse response = authService.register(request);

        assertEquals("VETERINARIO", response.getRole());
    }

    @Test
    void login_lanzaExcepcionConCredencialesInvalidas() {
        AuthRequest request = new AuthRequest();
        request.setEmail("vet@caballeriza.com");
        request.setPassword("incorrecta");
        when(authenticationManager.authenticate(any())).thenThrow(new BadCredentialsException("Credenciales inválidas"));

        assertThrows(BadCredentialsException.class, () -> authService.login(request));
        verify(userRepository, never()).findByEmail(any());
    }

    @Test
    void login_devuelveTokenConCredencialesValidas() {
        AuthRequest request = new AuthRequest();
        request.setEmail("vet@caballeriza.com");
        request.setPassword("secreta123");
        User user = User.builder().id(1L).email("vet@caballeriza.com").nombre("Dra. Vega").role(User.Role.VETERINARIO).build();

        when(userRepository.findByEmail("vet@caballeriza.com")).thenReturn(Optional.of(user));
        when(jwtService.generateToken(user)).thenReturn("jwt-token");

        AuthResponse response = authService.login(request);

        assertEquals("jwt-token", response.getToken());
        assertEquals("VETERINARIO", response.getRole());
        assertEquals("vet@caballeriza.com", response.getEmail());
    }
}

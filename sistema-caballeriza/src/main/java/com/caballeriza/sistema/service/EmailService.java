package com.caballeriza.sistema.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String from;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    public void sendPasswordResetEmail(String to, String token) {
        String resetLink = frontendUrl + "/reset-password/" + token;

        if (from == null || from.isBlank()) {
            log.info("SMTP no configurado. Enlace de recuperación para {}: {}", to, resetLink);
            return;
        }

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(from);
        message.setTo(to);
        message.setSubject("Recuperación de contraseña - Caballeriza");
        message.setText("""
                Hola,

                Solicitaste restablecer tu contraseña en el Sistema de Gestión de Caballeriza.

                Hacé clic en el siguiente enlace para crear una nueva contraseña (válido por 30 minutos):
                %s

                Si no solicitaste este cambio, podés ignorar este correo.
                """.formatted(resetLink));

        mailSender.send(message);
    }
}

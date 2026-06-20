package com.caballeriza.sistema.service;

import com.caballeriza.sistema.model.*;
import com.caballeriza.sistema.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public List<Notification> findByUser(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public List<Notification> findNoLeidas(Long userId) {
        return notificationRepository.findByUserIdAndLeidaFalse(userId);
    }

    public long countNoLeidas(Long userId) {
        return notificationRepository.countByUserIdAndLeidaFalse(userId);
    }

    public Notification marcarLeida(Long id) {
        Notification n = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notificación no encontrada"));
        n.setLeida(true);
        return notificationRepository.save(n);
    }

    public void marcarTodasLeidas(Long userId) {
        List<Notification> noLeidas = notificationRepository.findByUserIdAndLeidaFalse(userId);
        noLeidas.forEach(n -> n.setLeida(true));
        notificationRepository.saveAll(noLeidas);
    }

    public void crearAlertaVencimiento(MedicalRecord record) {
        List<User> admins = userRepository.findAll().stream()
                .filter(u -> u.getRole() == User.Role.ADMIN || u.getRole() == User.Role.VETERINARIO)
                .toList();

        admins.forEach(admin -> {
            Notification n = Notification.builder()
                    .user(admin)
                    .titulo("Vencimiento próximo: " + record.getTipo().name())
                    .mensaje("El registro de " + record.getTipo().name().toLowerCase() +
                            " del caballo vence el " + record.getFechaVencimiento())
                    .tipo(record.getTipo() == MedicalRecord.TipoRegistro.VACUNA
                            ? Notification.TipoNotificacion.VACUNA
                            : Notification.TipoNotificacion.TRATAMIENTO)
                    .build();
            notificationRepository.save(n);
        });
    }

    public void crearAlertaStockBajo(Inventory item) {
        List<User> admins = userRepository.findAll().stream()
                .filter(u -> u.getRole() == User.Role.ADMIN)
                .toList();

        admins.forEach(admin -> {
            Notification n = Notification.builder()
                    .user(admin)
                    .titulo("Stock bajo: " + item.getNombre())
                    .mensaje("El insumo '" + item.getNombre() + "' tiene stock bajo (" +
                            item.getCantidad() + " " + item.getUnidad() + " disponibles)")
                    .tipo(Notification.TipoNotificacion.STOCK_BAJO)
                    .build();
            notificationRepository.save(n);
        });
    }
}
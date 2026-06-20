package com.caballeriza.sistema.repository;

import com.caballeriza.sistema.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<Notification> findByUserIdAndLeidaFalse(Long userId);
    long countByUserIdAndLeidaFalse(Long userId);
}

package com.caballeriza.sistema.controller;

import com.caballeriza.sistema.dto.ApiResponse;
import com.caballeriza.sistema.model.*;
import com.caballeriza.sistema.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<Notification>>> getByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(ApiResponse.ok(notificationService.findByUser(userId)));
    }

    @GetMapping("/user/{userId}/no-leidas")
    public ResponseEntity<ApiResponse<List<Notification>>> getNoLeidas(@PathVariable Long userId) {
        return ResponseEntity.ok(ApiResponse.ok(notificationService.findNoLeidas(userId)));
    }

    @GetMapping("/user/{userId}/count")
    public ResponseEntity<ApiResponse<Long>> countNoLeidas(@PathVariable Long userId) {
        return ResponseEntity.ok(ApiResponse.ok(notificationService.countNoLeidas(userId)));
    }

    @PatchMapping("/{id}/leer")
    public ResponseEntity<ApiResponse<Notification>> marcarLeida(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(notificationService.marcarLeida(id)));
    }

    @PatchMapping("/user/{userId}/leer-todas")
    public ResponseEntity<ApiResponse<Void>> marcarTodasLeidas(@PathVariable Long userId) {
        notificationService.marcarTodasLeidas(userId);
        return ResponseEntity.ok(ApiResponse.ok("Todas marcadas como leídas", null));
    }
}
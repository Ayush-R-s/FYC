package com.example.admin.student.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.admin.student.entity.Notification;
import com.example.admin.student.entity.NotificationReadStatus;
import com.example.admin.student.repository.NotificationReadStatusRepository;
import com.example.admin.student.repository.NotificationRepository;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/notifications")
public class NotificationController {

    private final NotificationRepository notificationRepository;
    private final NotificationReadStatusRepository notificationReadStatusRepository;

    public NotificationController(NotificationRepository notificationRepository,
            NotificationReadStatusRepository notificationReadStatusRepository) {
        this.notificationRepository = notificationRepository;
        this.notificationReadStatusRepository = notificationReadStatusRepository;
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getNotifications() {
        String email = null;
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getName() != null) {
            email = auth.getName();
        }

        final String studentEmail = email;

        // Fetch notifications relevant to the student (global or specific to them)
        List<Notification> notifications = (studentEmail != null)
                ? notificationRepository.findByStudentEmailOrGlobal(studentEmail)
                : notificationRepository.findAll();

        notifications = notifications.stream()
                .sorted((a, b) -> b.getTimestamp().compareTo(a.getTimestamp()))
                .limit(10)
                .collect(Collectors.toList());

        // Transform for frontend
        List<Map<String, Object>> result = notifications.stream().map(n -> {
            Map<String, Object> map = new java.util.HashMap<>();
            map.put("id", n.getId());
            map.put("text", n.getText());
            map.put("timestamp", n.getTimestamp().toString());

            // Check per-user read status
            boolean isRead = n.isRead(); // default to global isRead if somehow relevant, but usually we want per-user
            if (studentEmail != null) {
                Optional<NotificationReadStatus> status = notificationReadStatusRepository
                        .findByNotificationIdAndStudentEmail(n.getId(), studentEmail);
                if (status.isPresent()) {
                    isRead = status.get().isRead();
                } else {
                    isRead = false; // Not read by this user yet
                }
            }

            map.put("isRead", isRead);
            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }

    @PostMapping("/mark-all-read")
    public ResponseEntity<Map<String, Object>> markAllAsRead() {
        String email = null;
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getName() != null) {
            email = auth.getName();
        }

        if (email == null) {
            Map<String, Object> error = new java.util.HashMap<>();
            error.put("success", false);
            error.put("message", "User not authenticated");
            return ResponseEntity.badRequest().body(error);
        }

        final String studentEmail = email;
        List<Notification> notifications = notificationRepository.findByStudentEmailOrGlobal(studentEmail);

        for (Notification n : notifications) {
            NotificationReadStatus status = notificationReadStatusRepository
                    .findByNotificationIdAndStudentEmail(n.getId(), studentEmail)
                    .orElse(new NotificationReadStatus(n.getId(), studentEmail, true));
            status.setRead(true);
            notificationReadStatusRepository.save(status);
        }

        Map<String, Object> response = new java.util.HashMap<>();
        response.put("success", true);
        response.put("updated", notifications.size());
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<Notification> createNotification(@RequestBody Map<String, String> payload) {
        String text = payload.get("text");
        String email = payload.get("studentEmail");

        Notification notification = new Notification(text, email);
        Notification saved = notificationRepository.save(notification);
        return ResponseEntity.ok(saved);
    }
}

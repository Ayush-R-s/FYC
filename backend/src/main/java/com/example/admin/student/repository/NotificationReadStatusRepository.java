package com.example.admin.student.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.admin.student.entity.NotificationReadStatus;

@Repository
public interface NotificationReadStatusRepository extends JpaRepository<NotificationReadStatus, Long> {
    Optional<NotificationReadStatus> findByNotificationIdAndStudentEmail(Long notificationId, String studentEmail);
}

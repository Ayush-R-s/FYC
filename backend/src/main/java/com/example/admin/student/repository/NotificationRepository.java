package com.example.admin.student.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.admin.student.entity.Notification;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    
    // Find global notifications (email is null) OR notifications for specific email
    @Query("SELECT n FROM Notification n WHERE n.studentEmail IS NULL OR n.studentEmail = :email ORDER BY n.timestamp DESC")
    List<Notification> findByStudentEmailOrGlobal(String email);
    
    List<Notification> findByStudentEmail(String email);
}

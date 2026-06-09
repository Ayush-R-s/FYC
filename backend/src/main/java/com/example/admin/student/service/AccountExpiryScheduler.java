package com.example.admin.student.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.example.admin.entity.Status;
import com.example.admin.student.entity.Student;
import com.example.admin.student.repository.StudentRepository;

/**
 * Scheduled task that runs every hour to automatically expire student accounts
 * whose accountExpiryDate has passed. The account is not deleted — only the status
 * is changed to EXPIRED, preventing the student from logging in.
 */
@Component
public class AccountExpiryScheduler {

    private final StudentRepository studentRepository;

    public AccountExpiryScheduler(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    /**
     * Runs every hour (3600000 ms) to expire accounts.
     * Finds all ACTIVE students whose accountExpiryDate <= today and sets their status to EXPIRED.
     */
    @Scheduled(fixedRate = 3600000)
    public void expireAccounts() {
        String today = LocalDate.now().toString();

        List<Student> expiredStudents = studentRepository
                .findByStatusAndAccountExpiryDateIsNotNullAndAccountExpiryDateLessThanEqual(Status.ACTIVE, today);

        if (!expiredStudents.isEmpty()) {
            System.out.println("[AccountExpiryScheduler] Found " + expiredStudents.size() + " account(s) to expire.");

            for (Student student : expiredStudents) {
                student.setStatus(Status.EXPIRED);
                System.out.println("[AccountExpiryScheduler] Expiring account: " + student.getStudentId()
                        + " (" + student.getName() + ") — expiry date: " + student.getAccountExpiryDate());
            }

            studentRepository.saveAll(expiredStudents);
            System.out.println("[AccountExpiryScheduler] Successfully expired " + expiredStudents.size() + " account(s).");
        }
    }
}

package com.example.admin.analytics.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.admin.analytics.entity.TestHistory;

public interface TestHistoryRepository extends JpaRepository<TestHistory, Long> {
    List<TestHistory> findByStudentId(Long studentId);

    List<TestHistory> findByStudent_Email(String email);

    List<TestHistory> findByStudent_SchoolNameAndDateBetween(String schoolName, String startDate, String endDate);

    List<TestHistory> findByStudent_SchoolName(String schoolName);
    
    List<TestHistory> findByStudentIdAndTestAndSubject(Long studentId, String test, String subject);
}

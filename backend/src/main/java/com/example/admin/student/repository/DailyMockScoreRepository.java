package com.example.admin.student.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.admin.student.entity.DailyMockScore;

@Repository
public interface DailyMockScoreRepository extends JpaRepository<DailyMockScore, Long> {
    java.util.List<DailyMockScore> findByStudent_Email(String email);
}

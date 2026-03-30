package com.example.admin.student.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.admin.student.entity.WeeklyTestScore;

@Repository
public interface WeeklyTestScoreRepository extends JpaRepository<WeeklyTestScore, Long> {
    java.util.List<WeeklyTestScore> findByStudent_Email(String email);
}

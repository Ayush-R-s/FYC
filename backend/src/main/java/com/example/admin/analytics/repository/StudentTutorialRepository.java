package com.example.admin.analytics.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.admin.analytics.entity.StudentTutorial;


public interface StudentTutorialRepository extends JpaRepository<StudentTutorial, Long> {
    List<StudentTutorial> findByStudent_Id(Long studentId);
}

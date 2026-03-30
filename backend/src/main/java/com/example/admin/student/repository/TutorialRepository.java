package com.example.admin.student.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.admin.student.entity.Tutorial;

@Repository
public interface TutorialRepository extends JpaRepository<Tutorial, Long> {
}

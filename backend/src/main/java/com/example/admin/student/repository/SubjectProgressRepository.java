package com.example.admin.student.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.admin.student.entity.SubjectProgress;

@Repository
public interface SubjectProgressRepository extends JpaRepository<SubjectProgress, Long> {
    java.util.List<SubjectProgress> findByStudent_Email(String email);
    java.util.Optional<SubjectProgress> findByStudentIdAndSubject(Long studentId, String subject);
}

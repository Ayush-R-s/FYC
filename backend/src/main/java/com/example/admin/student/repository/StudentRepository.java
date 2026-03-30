package com.example.admin.student.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.admin.entity.Status;
import com.example.admin.student.entity.Student;

// Force IDE Re-index v4
@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    long countByStatus(Status status);


    List<Student> findAllByEmail(String email);

    Optional<Student> findByStudentId(String studentId);

    List<Student> findByNameContainingIgnoreCaseOrEmailContainingIgnoreCaseOrStudentIdContainingIgnoreCase(
            String name, String email, String studentId);

    List<Student> findBySchoolName(String schoolName);
}

package com.example.admin.analytics.repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.admin.analytics.entity.Performance;
import com.example.admin.student.entity.Student;

// Force IDE Re-index v3
@Repository
public interface PerformanceRepository extends JpaRepository<Performance, Long> {

    /**
     * Finds all performance records for a specific student.
     *
     * @param student The student entity.
     * @return List of performance records.
     */
    List<Performance> findByStudent(Student student);

    /**
     * Finds all performance records for a specific student ID.
     *
     * @param studentId The ID of the student.
     * @return List of performance records.
     */
    List<Performance> findByStudentId(Long studentId);
}

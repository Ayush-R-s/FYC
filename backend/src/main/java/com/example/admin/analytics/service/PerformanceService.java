package com.example.admin.analytics.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.admin.student.entity.Student;
import com.example.admin.analytics.entity.Performance;
import com.example.admin.analytics.repository.PerformanceRepository;

/**
 * Service class for managing student performance data.
 * Handles business logic for adding and retrieving performance records.
 */
@Service
public class PerformanceService {

    @Autowired
    private PerformanceRepository performanceRepository;

    /**
     * Adds a new performance record for a student.
     *
     * @param performance The performance entity to save.
     * @return The saved performance entity.
     */
    @SuppressWarnings("null")
    public Performance addPerformance(Performance performance) {
        return performanceRepository.save(performance);
    }

    /**
     * Retrieves all performance records for a specific student.
     *
     * @param student The student entity.
     * @return List of performance records associated with the student.
     */
    public List<Performance> getPerformanceByStudent(Student student) {
        return performanceRepository.findByStudent(student);
    }

    /**
     * Retrieves all performance records by student ID.
     * 
     * @param studentId The unique identifier of the student.
     * @return List of performance records.
     */
    public List<Performance> getPerformanceByStudentId(Long studentId) {
        return performanceRepository.findByStudentId(studentId);
    }

    /**
     * Retrieves all performance records in the system.
     * 
     * @return List of all performance records.
     */
    public List<Performance> getAllPerformance() {
        return performanceRepository.findAll();
    }
}

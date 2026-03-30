package com.example.admin.analytics.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.admin.analytics.entity.Performance;
import com.example.admin.analytics.repository.PerformanceRepository;


@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/admin/performance")
public class PerformanceController {

    @Autowired
    private PerformanceRepository performanceRepository;

    @GetMapping("/student/{studentId}")
    public List<Performance> getByStudent(@PathVariable Long studentId) {
        return performanceRepository.findByStudentId(studentId);
    }
}

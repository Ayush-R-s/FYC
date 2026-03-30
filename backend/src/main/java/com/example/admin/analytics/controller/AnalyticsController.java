package com.example.admin.analytics.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/admin/analytics")
public class AnalyticsController {

    private final com.example.admin.student.service.StudentAnalyticsService analyticsService;

    public AnalyticsController(com.example.admin.student.service.StudentAnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/completion")
    public List<?> getCompletion(
            @RequestParam(name = "range", defaultValue = "all") String range,
            @RequestParam(name = "subject", defaultValue = "all") String subject) {

        System.out.println("Processing /admin/analytics/completion request: range=" + range + ", subject=" + subject);

        try {
            return analyticsService.getGlobalCompletionStats(range);
        } catch (Exception e) {
            System.err.println("Error fetching completion data: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    @GetMapping("/performance")
    public List<?> getPerformance() {
        System.out.println("Processing /admin/analytics/performance request");
        return analyticsService.getGlobalPerformanceStats();
    }

    @GetMapping("/students")
    public List<?> getStudents() {
        return analyticsService.getGlobalStudentsAnalytics();
    }

    @GetMapping("/videos")
    public List<?> getVideoAnalytics() {
        return analyticsService.getDetailedVideoAnalytics();
    }

    @GetMapping("/videos/{id}/students")
    public List<?> getStudentsForVideo(@PathVariable Long id) {
        return analyticsService.getStudentsForVideo(id);
    }
}

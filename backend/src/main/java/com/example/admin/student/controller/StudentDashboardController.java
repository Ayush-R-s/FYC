package com.example.admin.student.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.admin.student.dto.DashboardData;
import com.example.admin.student.service.DashboardService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping
public class StudentDashboardController {

    private final DashboardService dashboardService;

    public StudentDashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/dashboard")
    public DashboardData getDashboardData(@RequestParam(required = false) String email) {
        // If email is not provided, extract from JWT token
        if (email == null || email.isEmpty()) {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.getName() != null) {
                email = auth.getName();
            }
        }
        return dashboardService.getDashboardData(email);
    }
}

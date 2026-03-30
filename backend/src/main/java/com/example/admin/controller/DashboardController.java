package com.example.admin.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/admin/stats")
public class DashboardController {

    private final com.example.admin.student.service.StudentAnalyticsService analyticsService;

    public DashboardController(com.example.admin.student.service.StudentAnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/overall")
    public Map<String, Object> getOverallStats() {
        try {
            Map<String, Object> stats = analyticsService.getGlobalOverviewStats();
            return stats;
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }

    @GetMapping("/engagement")
    public List<?> getEngagementData() {
        return analyticsService.getGlobalEngagementStats();
    }
}

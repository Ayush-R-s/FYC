package com.example.admin.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
public class HealthController {

    @GetMapping("/")
    public String rootHealth() {
        return "Backend is running";
    }

    @GetMapping("/api/health")
    public Map<String, String> health() {
        return Map.of("status", "UP");
    }
}

package com.example.admin.student.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.admin.student.entity.Activity;
import com.example.admin.student.service.ActivityService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping
public class ActivityController {

    private final ActivityService activityService;

    public ActivityController(ActivityService activityService) {
        this.activityService = activityService;
    }

    @GetMapping("/activities")
    public List<Activity> getAllActivities(@RequestParam(required = false) String email) {
        // If email is not provided, extract from JWT token
        if (email == null || email.isEmpty()) {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.getName() != null) {
                email = auth.getName();
            }
        }
        return activityService.getAllActivities(email);
    }

    @PostMapping("/activities")
    public Activity addActivity(@RequestBody Activity activity) {
        return activityService.addActivity(activity);
    }
}

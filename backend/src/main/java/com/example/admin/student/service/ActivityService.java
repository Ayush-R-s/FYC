package com.example.admin.student.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.admin.student.entity.Activity;
import com.example.admin.student.repository.ActivityRepository;

@Service
public class ActivityService {
    private final ActivityRepository activityRepository;

    public ActivityService(ActivityRepository activityRepository) {
        this.activityRepository = activityRepository;
    }

    public List<Activity> getAllActivities(String email) {
        if (email != null && !email.isEmpty()) {
            return activityRepository.findByStudentEmail(email);
        }
        return activityRepository.findAll(
                org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.DESC, "date"));
    }

    @SuppressWarnings("null")
    public Activity addActivity(Activity activity) {
        return activityRepository.save(activity);
    }
}

package com.example.admin.feedback.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.admin.feedback.entity.Feedback;
import com.example.admin.feedback.service.FeedbackService;

@RestController
@RequestMapping("/admin/feedback")
public class FeedbackController {

    @Autowired
    private FeedbackService feedbackService;

    @GetMapping
    public List<Feedback> getAllFeedback() {
        return feedbackService.getAllFeedback();
    }

    @PatchMapping("/{id}/review")
    public ResponseEntity<?> markReviewed(@PathVariable Long id) {
        Optional<Feedback> feedback = feedbackService.markAsReviewed(id);
        if (feedback.isPresent()) {
            return ResponseEntity.ok(feedback.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}

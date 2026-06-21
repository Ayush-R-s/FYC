package com.example.admin.feedback.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.admin.feedback.entity.Feedback;
import com.example.admin.feedback.repository.FeedbackRepository;

@Service
public class FeedbackService {

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private com.example.admin.student.service.StudentService studentService;

    public List<Feedback> getAllFeedback() {
        return feedbackRepository.findAll().stream()
            .filter(f -> {
                com.example.admin.student.entity.Student student = studentService.getStudentByStudentId(f.getStudentId());
                if (student == null) return true; // Default to keeping feedback if no specific user record
                String role = student.getRole() != null ? student.getRole().name().toUpperCase() : "STUDENT";
                return role.equals("STUDENT") || role.equals("AMBASSADOR");
            })
            .collect(java.util.stream.Collectors.toList());
    }

    public List<Feedback> getFeedbackByStudentId(String studentId) {
        return feedbackRepository.findByStudentId(studentId);
    }

    public Optional<Feedback> markAsReviewed(Long id) {
        @SuppressWarnings("null")
        Optional<Feedback> feedbackOptional = feedbackRepository.findById(id);
        if (feedbackOptional.isPresent()) {
            Feedback feedback = feedbackOptional.get();
            feedback.setReviewed(true);
            return Optional.of(feedbackRepository.save(feedback));
        }
        return Optional.empty();
    }

    public Feedback createFeedback(Feedback feedback) {
        return feedbackRepository.save(feedback);
    }
}

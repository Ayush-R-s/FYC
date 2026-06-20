package com.example.admin.neet;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/student/practice")
public class StudentPracticeController {

    private final neetQuestionService service;

    public StudentPracticeController(neetQuestionService service) {
        this.service = service;
    }

    @GetMapping("/questions")
    public List<neetQuestion> getPracticeQuestions() {
        List<neetQuestion> questions = service.getAllQuestions();
        // Return in random order as requested by the user
        Collections.shuffle(questions);
        return questions;
    }
}

package com.example.admin.jest;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/student/practice")
public class StudentPracticeController {

    private final jestQuestionService service;

    public StudentPracticeController(jestQuestionService service) {
        this.service = service;
    }

    @GetMapping("/questions")
    public List<jestQuestion> getPracticeQuestions() {
        List<jestQuestion> questions = service.getAllQuestions();
        // Return in random order as requested by the user
        Collections.shuffle(questions);
        return questions;
    }
}

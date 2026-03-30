package com.example.admin.content.controller;


import java.util.List;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.admin.content.model.Question;
import com.example.admin.content.service.AIQuestionService;

@RestController
@RequestMapping("/admin/content/ai")
public class AIController {

    private final AIQuestionService aiService;

    public AIController(AIQuestionService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/generate")
    public List<Question> generateQuestions(
            @RequestParam("file") MultipartFile file,
            @RequestParam("numberOfQuestions") int numberOfQuestions,
            @RequestParam("difficulty") String difficulty) {
        return aiService.generate(file, numberOfQuestions, difficulty);
    }
}

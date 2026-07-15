package com.example.admin.jest;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.List;

@RestController
@RequestMapping("/admin/iit-jee-questions")
public class jestQuestionController {

    private final jestQuestionService service;

    public jestQuestionController(jestQuestionService service) {
        this.service = service;
    }

    @GetMapping
    public List<jestQuestion> getAll() {
        return service.getAllQuestions();
    }

    @PostMapping("/parse")
    public List<jestQuestion> parsePdf(@RequestParam("file") MultipartFile file) {
        try {
            return service.parsePdf(file.getBytes());
        } catch (IOException e) {
            throw new RuntimeException("Failed to read and parse uploaded PDF file: " + e.getMessage(), e);
        }
    }

    @PostMapping("/parse-default")
    public List<jestQuestion> parseDefault() {
        File file = new File("C:\\Users\\ayush\\JEST Prep\\IIT_JEE_JEST_Questions_1_to_1000_With_Answers.pdf");
        if (!file.exists()) {
            throw new RuntimeException("Default PDF file not found at " + file.getAbsolutePath());
        }
        try {
            byte[] bytes = Files.readAllBytes(file.toPath());
            return service.parsePdf(bytes);
        } catch (IOException e) {
            throw new RuntimeException("Failed to read and parse default PDF file: " + e.getMessage(), e);
        }
    }

    @PostMapping("/bulk-save")
    public List<jestQuestion> bulkSave(@RequestBody List<jestQuestion> questions) {
        return service.saveAll(questions);
    }
}

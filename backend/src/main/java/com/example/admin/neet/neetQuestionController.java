package com.example.admin.neet;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.List;

@RestController
@RequestMapping("/admin/iit-jee-questions")
public class neetQuestionController {

    private final neetQuestionService service;

    public neetQuestionController(neetQuestionService service) {
        this.service = service;
    }

    @GetMapping
    public List<neetQuestion> getAll() {
        return service.getAllQuestions();
    }

    @PostMapping("/parse")
    public List<neetQuestion> parsePdf(@RequestParam("file") MultipartFile file) {
        try {
            return service.parsePdf(file.getBytes());
        } catch (IOException e) {
            throw new RuntimeException("Failed to read and parse uploaded PDF file: " + e.getMessage(), e);
        }
    }

    @PostMapping("/parse-default")
    public List<neetQuestion> parseDefault() {
        File file = new File("C:\\Users\\ayush\\FYC\\IIT_JEE_NEET_Questions_1_to_1000_With_Answers.pdf");
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
    public List<neetQuestion> bulkSave(@RequestBody List<neetQuestion> questions) {
        return service.saveAll(questions);
    }
}

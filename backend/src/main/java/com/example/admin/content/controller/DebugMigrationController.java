package com.example.admin.content.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.example.admin.content.service.ContentService;

@RestController
@RequestMapping("/debug")
public class DebugMigrationController {
    
    private final ContentService contentService;

    public DebugMigrationController(ContentService contentService) {
        this.contentService = contentService;
    }

    @PostMapping("/migrate")
    public org.springframework.http.ResponseEntity<String> migrateLegacy() {
        try {
            contentService.safeJavaMigration();
            return org.springframework.http.ResponseEntity.ok("Migration successful!");
        } catch (Exception e) {
            return org.springframework.http.ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }
}

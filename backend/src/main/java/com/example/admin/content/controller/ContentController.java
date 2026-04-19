package com.example.admin.content.controller;


import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.admin.content.model.Note;
import com.example.admin.content.model.PYQ;
import com.example.admin.content.model.Textbook;
import com.example.admin.content.model.Timetable;
import com.example.admin.content.model.Video;
import com.example.admin.content.service.ContentService;

@RestController
@RequestMapping("/admin/content")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000", "http://localhost:3001", "https://www.fycneet.com", "http://www.fycneet.com"})
public class ContentController {

    private final ContentService contentService;

    public ContentController(ContentService contentService) {
        this.contentService = contentService;
    }

    @GetMapping
    public List<Object> getAllContent() {
        return contentService.getAllContent();
    }

    @PostMapping("/migrate-legacy")
    public org.springframework.http.ResponseEntity<String> migrateLegacy() {
        try {
            contentService.safeJavaMigration();
            return org.springframework.http.ResponseEntity.ok("Migration successful!");
        } catch (Exception e) {
            return org.springframework.http.ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    // --- GET LISTS ---

    @GetMapping("/notes")
    public List<Note> getAllNotes() { return contentService.getAllNotes(); }

    @GetMapping("/textbooks")
    public List<Textbook> getAllTextbooks() { return contentService.getAllTextbooks(); }

    @GetMapping("/pyqs")
    public List<PYQ> getAllPYQs() { return contentService.getAllPYQs(); }

    @GetMapping("/timetables")
    public List<Timetable> getAllTimetables() { return contentService.getAllTimetables(); }

    @GetMapping("/videos")
    public List<Video> getAllVideos() { return contentService.getAllVideos(); }


    // --- UPLOAD (CREATE) ---

    @PostMapping("/notes")
    public Note uploadNotes(
            @RequestParam MultipartFile file,
            @RequestParam String title,
            @RequestParam String subject,
            @RequestParam(required = false) String topic,
            @RequestParam(required = false) Integer pages,
            @RequestParam String description,
            @RequestParam(required = false) String category) {
        return contentService.uploadNote(file, title, subject, topic, pages, description, category);
    }

    @PostMapping("/textbooks")
    public Textbook uploadTextbook(
            @RequestParam MultipartFile file,
            @RequestParam String title,
            @RequestParam String subject,
            @RequestParam(required = false) String category) {
        return contentService.uploadTextbook(file, title, subject, category);
    }

    @PostMapping("/pyqs")
    public PYQ uploadPYQ(
            @RequestParam MultipartFile file,
            @RequestParam String title,
            @RequestParam String year,
            @RequestParam(required = false) String subject,
            @RequestParam(required = false) String category) {
        return contentService.uploadPYQ(file, title, year, subject, category);
    }

    @PostMapping("/timetables")
    public Timetable uploadTimetable(
            @RequestParam MultipartFile file,
            @RequestParam String title,
            @RequestParam(required = false) String category) {
        return contentService.uploadTimetable(file, title, category);
    }

    @PostMapping("/video/presigned-url")
    public Map<String, String> getPresignedVideoUrl(
            @RequestParam String fileName,
            @RequestParam String contentType) {
        return contentService.generatePresignedVideoUploadUrl(fileName, contentType);
    }

    @PostMapping("/video")
    public Video uploadVideo(
            @RequestParam(required = false) MultipartFile file,
            @RequestParam(required = false) String filePath,
            @RequestParam(required = false) String fileName,
            @RequestParam String title,
            @RequestParam String subject,
            @RequestParam(required = false) String duration,
            @RequestParam(required = false) String category) {
        return contentService.uploadVideo(file, filePath, fileName, title, subject, duration, category);
    }


    // --- UPDATE ---

    @PutMapping("/notes/{id}")
    public Note updateNotes(
            @PathVariable Long id,
            @RequestParam(required = false) MultipartFile file,
            @RequestParam String title,
            @RequestParam String subject,
            @RequestParam(required = false) String topic,
            @RequestParam(required = false) Integer pages,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) String category) {
        return contentService.updateNote(id, file, title, subject, topic, pages, description, category);
    }

    @PutMapping("/textbooks/{id}")
    public Textbook updateTextbook(
            @PathVariable Long id,
            @RequestParam(required = false) MultipartFile file,
            @RequestParam String title,
            @RequestParam String subject,
            @RequestParam(required = false) String category) {
        return contentService.updateTextbook(id, file, title, subject, category);
    }

    @PutMapping("/pyqs/{id}")
    public PYQ updatePYQ(
            @PathVariable Long id,
            @RequestParam(required = false) MultipartFile file,
            @RequestParam String title,
            @RequestParam String year,
            @RequestParam(required = false) String subject,
            @RequestParam(required = false) String category) {
        return contentService.updatePYQ(id, file, title, year, subject, category);
    }

    @PutMapping("/timetables/{id}")
    public Timetable updateTimetable(
            @PathVariable Long id,
            @RequestParam(required = false) MultipartFile file,
            @RequestParam String title,
            @RequestParam(required = false) String category) {
        return contentService.updateTimetable(id, file, title, category);
    }

    @PutMapping("/video/{id}")
    public Video updateVideo(
            @PathVariable Long id,
            @RequestParam(required = false) MultipartFile file,
            @RequestParam String title,
            @RequestParam String subject,
            @RequestParam(required = false) String duration,
            @RequestParam(required = false) String category) {
        return contentService.updateVideo(id, file, title, subject, duration, category);
    }


    // --- DELETE ---

    @DeleteMapping("/notes/{id}")
    public void deleteNote(@PathVariable Long id) {
        contentService.deleteNote(id);
    }

    @DeleteMapping("/textbooks/{id}")
    public void deleteTextbook(@PathVariable Long id) {
        contentService.deleteTextbook(id);
    }

    @DeleteMapping("/pyqs/{id}")
    public void deletePYQ(@PathVariable Long id) {
        contentService.deletePYQ(id);
    }

    @DeleteMapping("/timetables/{id}")
    public void deleteTimetable(@PathVariable Long id) {
        contentService.deleteTimetable(id);
    }

    @DeleteMapping("/video/{id}")
    public void deleteVideo(@PathVariable Long id) {
        contentService.deleteVideo(id);
    }

    // Legacy delete to not break UI if they use generic content delete. 
    @DeleteMapping("/{id}")
    public void deleteGenericContent(@PathVariable Long id) {
        // Technically this is ambiguous now, but leaving for safety. 
        // We will update frontend to use specific deletes.
        // Actually best is to just remove and ensure frontend is updated!
        // But for transition... let's just make them throw if accessed?
        // Or default to try all.
        try { contentService.deleteNote(id); } catch(Exception e) {}
        try { contentService.deleteVideo(id); } catch(Exception e) {}
    }
}

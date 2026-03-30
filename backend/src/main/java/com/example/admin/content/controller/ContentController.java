package com.example.admin.content.controller;


import java.util.List;

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
import com.example.admin.content.model.Video;
import com.example.admin.content.service.ContentService;

@RestController
@RequestMapping("/admin/content")
public class ContentController {

    private final ContentService contentService;

    public ContentController(ContentService contentService) {
        this.contentService = contentService;
    }

    @GetMapping
    public List<Object> getAllContent() {
        return contentService.getAllContent();
    }

    @GetMapping("/videos")
    public List<Video> getAllVideos() {
        return contentService.getAllVideos();
    }

    @PostMapping("/notes")
    public Note uploadNotes(
            @RequestParam MultipartFile file,
            @RequestParam String title,
            @RequestParam String subject,
            @RequestParam(required = false) String topic,
            @RequestParam(required = false) Integer pages,
            @RequestParam String description) {
        return contentService.uploadNotes(file, title, subject, topic, pages, description);
    }

    @PostMapping("/video")
    public Video uploadVideo(
            @RequestParam MultipartFile file,
            @RequestParam String title,
            @RequestParam String subject,
            @RequestParam(required = false) String duration) {
        return contentService.uploadVideo(file, title, subject, duration);
    }

    @PutMapping("/notes/{id}")
    public Note updateNotes(
            @PathVariable Long id,
            @RequestParam(required = false) MultipartFile file,
            @RequestParam String title,
            @RequestParam String subject,
            @RequestParam(required = false) String topic,
            @RequestParam(required = false) Integer pages,
            @RequestParam(required = false) String description) {
        return contentService.updateNotes(id, file, title, subject, topic, pages, description);
    }

    @PutMapping("/video/{id}")
    public Video updateVideo(
            @PathVariable Long id,
            @RequestParam(required = false) MultipartFile file,
            @RequestParam String title,
            @RequestParam String subject,
            @RequestParam(required = false) String duration) {
        return contentService.updateVideo(id, file, title, subject, duration);
    }

    @DeleteMapping("/{id}")
    public void deleteContent(@PathVariable Long id) {
        contentService.deleteContent(id);
    }
}

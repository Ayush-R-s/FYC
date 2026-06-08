package com.example.admin.student.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.admin.content.model.Video;
import com.example.admin.content.repository.VideoRepository;

@RestController
@RequestMapping
public class TutorialController {

    private final VideoRepository videoRepository;

    public TutorialController(VideoRepository videoRepository) {
        this.videoRepository = videoRepository;
    }

    @GetMapping("/tutorials")
    public List<Map<String, Object>> getAllTutorials() {
        // Return videos as tutorials with necessary fields for frontend
        List<Video> videos = videoRepository.findAll();
        
        return videos.stream().map(video -> {
            Map<String, Object> tutorial = new HashMap<>();
            tutorial.put("id", video.getId());
            tutorial.put("name", video.getTitle()); // Frontend expects "name"
            tutorial.put("subject", video.getSubject());
            tutorial.put("completed", false); // Default to false, can be enhanced later with progress tracking
            return tutorial;
        }).collect(Collectors.toList());
    }
}

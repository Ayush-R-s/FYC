package com.example.admin.student.controller;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.admin.content.model.Note;
import com.example.admin.content.model.Test;
import com.example.admin.content.model.Video;
import com.example.admin.content.repository.TestRepository;
import com.example.admin.content.repository.VideoRepository;
import com.example.admin.student.dto.ActivityFeedItem;
import com.example.admin.student.entity.Activity;
import com.example.admin.student.repository.ActivityRepository;
import com.example.admin.content.repository.NoteRepository;

@RestController
@RequestMapping("/activity/feed")
public class ActivityFeedController {

    private final NoteRepository noteRepository;
    private final VideoRepository videoRepository;
    private final TestRepository testRepository;
    private final ActivityRepository activityRepository;

    public ActivityFeedController(NoteRepository noteRepository, VideoRepository videoRepository,
            TestRepository testRepository, ActivityRepository activityRepository) {
        this.noteRepository = noteRepository;
        this.videoRepository = videoRepository;
        this.testRepository = testRepository;
        this.activityRepository = activityRepository;
    }

    @GetMapping
    public org.springframework.http.ResponseEntity<List<ActivityFeedItem>> getActivityFeed() {
        List<ActivityFeedItem> feed = new ArrayList<>();

        String email = null;
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getName() != null) {
            email = auth.getName();
        }

        try {
            // Notes
            List<Note> notes = noteRepository.findTop5ByOrderByUploadedAtDesc();
            if (notes != null) {
                notes.forEach(note -> {
                    String title = note.getTitle() != null && !note.getTitle().trim().isEmpty() ? note.getTitle() : "Untitled Note";
                    feed.add(new ActivityFeedItem(
                            "note_" + note.getId(),
                            "Note",
                            title,
                            "New Note Added",
                            note.getUploadedAt() != null ? note.getUploadedAt() : LocalDateTime.now()
                    ));
                });
            }

            // Videos
            List<Video> videos = videoRepository.findTop5ByOrderByCreatedAtDesc();
            if (videos != null) {
                videos.forEach(video -> {
                    String title = video.getTitle() != null && !video.getTitle().trim().isEmpty() ? video.getTitle() : "Untitled Video";
                    feed.add(new ActivityFeedItem(
                            "video_" + video.getId(),
                            "Video",
                            title,
                            "New Video Uploaded",
                            video.getCreatedAt() != null ? video.getCreatedAt() : LocalDateTime.now()
                    ));
                });
            }

            // Tests
            List<Test> tests = testRepository.findTop5ByOrderByCreatedAtDesc();
            if (tests != null) {
                tests.forEach(test -> {
                    String title = test.getTitle() != null && !test.getTitle().trim().isEmpty() ? test.getTitle() : "Untitled Test";
                    feed.add(new ActivityFeedItem(
                            "test_" + test.getId(),
                            "Test",
                            title,
                            "New Test Available",
                            test.getCreatedAt() != null ? test.getCreatedAt() : LocalDateTime.now()
                    ));
                });
            }

            // Personal Activities
            List<Activity> activities = (email != null) ? activityRepository.findByStudentEmail(email) : activityRepository.findAll();
            if (activities != null) {
                activities.stream()
                        .sorted((a, b) -> {
                            String d1 = a.getDate() != null ? a.getDate() : "1970-01-01";
                            String d2 = b.getDate() != null ? b.getDate() : "1970-01-01";
                            return d2.compareTo(d1);
                        })
                        .limit(10)
                        .forEach(activity -> {
                            String title = activity.getTitle() != null && !activity.getTitle().trim().isEmpty() ? activity.getTitle() : "";
                            String action = activity.getDescription() != null && !activity.getDescription().trim().isEmpty() ? activity.getDescription() : "";

                            // Filter out empty items
                            if (title.isEmpty() && action.isEmpty()) {
                                return;
                            }

                            // Fallbacks
                            if (title.isEmpty()) {
                                title = "Application Update";
                            }
                            if (action.isEmpty()) {
                                action = "General Activity";
                            }

                            LocalDateTime timestamp = LocalDateTime.now();
                            try {
                                if (activity.getDate() != null) {
                                    timestamp = LocalDate.parse(activity.getDate()).atStartOfDay();
                                }
                            } catch (Exception e) {
                                // ignore parse error, use now
                            }
                            feed.add(new ActivityFeedItem(
                                    "activity_" + activity.getId(),
                                    "Activity",
                                    title,
                                    action,
                                    timestamp
                            ));
                        });
            }
        } catch (Exception e) {
            System.err.println("Error building activity feed: " + e.getMessage());
            e.printStackTrace();
        }

        // Global Sort
        List<ActivityFeedItem> sortedFeed = feed.stream()
                .sorted(Comparator.comparing(ActivityFeedItem::getTimestamp).reversed())
                .limit(20)
                .collect(Collectors.toList());

        return ResponseEntity.ok(sortedFeed);
    }
}

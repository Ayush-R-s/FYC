package com.example.admin.student.dto;

import java.time.LocalDateTime;

public class ActivityFeedItem {
    private String id;
    private String type; // "Note", "Video", "Test"
    private String title;
    private String action; // e.g., "New Physics Note", "New Video Available"
    private LocalDateTime timestamp;
    private String date; // formatted date for easier frontend consumption

    public ActivityFeedItem(String id, String type, String title, String action, LocalDateTime timestamp) {
        this.id = id;
        this.type = type;
        this.title = title;
        this.action = action;
        this.timestamp = timestamp;
        this.date = timestamp.toLocalDate().toString(); // simple format YYYY-MM-DD
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }
}

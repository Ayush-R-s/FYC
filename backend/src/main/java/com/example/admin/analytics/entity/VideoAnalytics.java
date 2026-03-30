package com.example.admin.analytics.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "video_analytics")
public class VideoAnalytics {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private String subject;

    @Column(name = "total_students")
    private Integer totalStudents;

    private Integer completed;
    private Integer pending;

    @Column(name = "avg_watch_time")
    private Double avgWatchTime;

    public VideoAnalytics() {}

    public VideoAnalytics(Long id, String title, String subject, Integer totalStudents, Integer completed, Integer pending, Double avgWatchTime) {
        this.id = id;
        this.title = title;
        this.subject = subject;
        this.totalStudents = totalStudents;
        this.completed = completed;
        this.pending = pending;
        this.avgWatchTime = avgWatchTime;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public Integer getTotalStudents() { return totalStudents; }
    public void setTotalStudents(Integer totalStudents) { this.totalStudents = totalStudents; }

    public Integer getCompleted() { return completed; }
    public void setCompleted(Integer completed) { this.completed = completed; }

    public Integer getPending() { return pending; }
    public void setPending(Integer pending) { this.pending = pending; }

    public Double getAvgWatchTime() { return avgWatchTime; }
    public void setAvgWatchTime(Double avgWatchTime) { this.avgWatchTime = avgWatchTime; }
}

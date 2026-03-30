package com.example.admin.student.entity;

import com.example.admin.content.model.Video;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "video_progress")
public class VideoProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private Student student;

    @ManyToOne
    @JoinColumn(name = "video_id")
    private Video video;

    private int progress; // Percentage 0-100
    private boolean completed;
    private double currentTimeSeconds; // Exact playback position in seconds for resume

    public VideoProgress() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }

    public Video getVideo() { return video; }
    public void setVideo(Video video) { this.video = video; }

    public int getProgress() { return progress; }
    public void setProgress(int progress) { this.progress = progress; }

    public boolean isCompleted() { return completed; }
    public void setCompleted(boolean completed) { this.completed = completed; }

    public double getCurrentTimeSeconds() { return currentTimeSeconds; }
    public void setCurrentTimeSeconds(double currentTimeSeconds) { this.currentTimeSeconds = currentTimeSeconds; }
}

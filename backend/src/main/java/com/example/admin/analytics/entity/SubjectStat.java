package com.example.admin.analytics.entity;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Embeddable;

// Force IDE Re-index v2
@Embeddable
public class SubjectStat {

    @JsonProperty("subject")
    private String name;
    
    @JsonProperty("avgScore")
    private Double score;
    private Integer passed;
    private Integer failed;
    private Double passRate;
    private Double highScore;
    private Double lowScore;
    private Integer videosWatched;
    private Double videoCompletion;

    // Constructors
    public SubjectStat() {
    }

    public SubjectStat(String name, Double score, Integer passed, Integer failed, Double passRate, Double highScore,
            Double lowScore, Integer videosWatched, Double videoCompletion) {
        this.name = name;
        this.score = score;
        this.passed = passed;
        this.failed = failed;
        this.passRate = passRate;
        this.highScore = highScore;
        this.lowScore = lowScore;
        this.videosWatched = videosWatched;
        this.videoCompletion = videoCompletion;
    }

    // Getters and Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Double getScore() {
        return score;
    }

    public void setScore(Double score) {
        this.score = score;
    }

    public Integer getPassed() {
        return passed;
    }

    public void setPassed(Integer passed) {
        this.passed = passed;
    }

    public Integer getFailed() {
        return failed;
    }

    public void setFailed(Integer failed) {
        this.failed = failed;
    }

    public Double getPassRate() {
        return passRate;
    }

    public void setPassRate(Double passRate) {
        this.passRate = passRate;
    }

    public Double getHighScore() {
        return highScore;
    }

    public void setHighScore(Double highScore) {
        this.highScore = highScore;
    }

    public Double getLowScore() {
        return lowScore;
    }

    public void setLowScore(Double lowScore) {
        this.lowScore = lowScore;
    }

    public Integer getVideosWatched() {
        return videosWatched;
    }

    public void setVideosWatched(Integer videosWatched) {
        this.videosWatched = videosWatched;
    }

    public Double getVideoCompletion() {
        return videoCompletion;
    }

    public void setVideoCompletion(Double videoCompletion) {
        this.videoCompletion = videoCompletion;
    }
}

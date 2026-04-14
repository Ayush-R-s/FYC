package com.example.admin.content.dto;

import java.util.List;

import com.example.admin.content.model.Question;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;

public class TestRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String subject;
    private String topic;
    private String duration;
    private String category;
    private Integer marksPerQuestion;
    private List<Long> videoIds;

    private Boolean isRandom;
    private Integer questionCount;
    private String randomSubject;

    @Valid
    private List<Question> questions;

    public Boolean getIsRandom() {
        return isRandom != null && isRandom;
    }

    public void setIsRandom(Boolean isRandom) {
        this.isRandom = isRandom;
    }

    public Integer getQuestionCount() {
        return questionCount;
    }

    public void setQuestionCount(Integer questionCount) {
        this.questionCount = questionCount;
    }

    public String getRandomSubject() {
        return randomSubject;
    }

    public void setRandomSubject(String randomSubject) {
        this.randomSubject = randomSubject;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public List<Long> getVideoIds() {
        return videoIds;
    }

    public void setVideoIds(List<Long> videoIds) {
        this.videoIds = videoIds;
    }

    public String getTopic() {
        return topic;
    }

    public void setTopic(String topic) {
        this.topic = topic;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public List<Question> getQuestions() {
        return questions;
    }

    public void setQuestions(List<Question> questions) {
        this.questions = questions;
    }

    public Integer getMarksPerQuestion() {
        return marksPerQuestion;
    }

    public void setMarksPerQuestion(Integer marksPerQuestion) {
        this.marksPerQuestion = marksPerQuestion;
    }
}

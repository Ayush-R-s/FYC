package com.example.admin.content.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String text;

    @ElementCollection
    @Column(columnDefinition = "TEXT")
    private List<String> answers = new java.util.ArrayList<>();

    @ElementCollection
    private List<Integer> correctAnswers = new java.util.ArrayList<>();

    private int points;
    private String subject;
    private String chapter;
    private String topic;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public List<String> getAnswers() {
        return answers;
    }

    public void setAnswers(List<String> answers) {
        this.answers = answers;
    }

    public List<Integer> getCorrectAnswers() {
        return correctAnswers;
    }

    public void setCorrectAnswers(List<Integer> correctAnswers) {
        this.correctAnswers = correctAnswers;
    }

    public int getPoints() {
        return points;
    }

    public void setPoints(int points) {
        this.points = points;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getChapter() {
        return chapter;
    }

    public void setChapter(String chapter) {
        this.chapter = chapter;
    }

    public String getTopic() {
        return topic;
    }

    public void setTopic(String topic) {
        this.topic = topic;
    }
}

package com.example.admin.analytics.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "completion_data")
public class CompletionData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String subject;
    private Double completion;
    private Integer students;
    
    @Enumerated(EnumType.STRING)
    private TimeFrame timeFrame;

    public enum TimeFrame {
        ALL_TIME, LAST_MONTH, LAST_WEEK
    }

    public CompletionData() {}

    public CompletionData(Long id, String subject, Double completion, Integer students, TimeFrame timeFrame) {
        this.id = id;
        this.subject = subject;
        this.completion = completion;
        this.students = students;
        this.timeFrame = timeFrame;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public Double getCompletion() { return completion; }
    public void setCompletion(Double completion) { this.completion = completion; }

    public Integer getStudents() { return students; }
    public void setStudents(Integer students) { this.students = students; }

    public TimeFrame getTimeFrame() { return timeFrame; }
    public void setTimeFrame(TimeFrame timeFrame) { this.timeFrame = timeFrame; }
}

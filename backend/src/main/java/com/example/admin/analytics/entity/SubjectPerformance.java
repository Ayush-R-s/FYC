package com.example.admin.analytics.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "subject_performance")
public class SubjectPerformance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String subject;

    @Column(name = "avg_score")
    private Double avgScore;

    private Double median;

    public SubjectPerformance() {}

    public SubjectPerformance(Long id, String subject, Double avgScore, Double median) {
        this.id = id;
        this.subject = subject;
        this.avgScore = avgScore;
        this.median = median;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public Double getAvgScore() { return avgScore; }
    public void setAvgScore(Double avgScore) { this.avgScore = avgScore; }

    public Double getMedian() { return median; }
    public void setMedian(Double median) { this.median = median; }
}

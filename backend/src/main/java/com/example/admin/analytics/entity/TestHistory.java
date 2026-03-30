package com.example.admin.analytics.entity;

import java.time.LocalDateTime;
import java.util.Map;

import com.example.admin.student.entity.Student;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapKeyColumn;
import jakarta.persistence.Table;

@Entity
@Table(name = "test_history")
public class TestHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_ref_id")
    @JsonIgnore
    private Student student;

    @Column(name = "student_id")
    private Long studentId; // Kept for repository compatibility if needed

    private String test; // Renamed from testName to match DataController
    private String testCategory;
    private String subject;
    private Integer score; // Changed from Double to Integer to match DataController
    private String date;
    private String status; 
    private Integer accuracy;
    private Integer speed;
    private Integer totalPoints;
    private Integer correctCount;
    private Integer wrongCount;
    private Integer timeTaken; // in seconds
    private LocalDateTime timestamp;

    @Column(columnDefinition = "TEXT")
    private String responsesJson;

    @ElementCollection
    @CollectionTable(name = "test_analytics", joinColumns = @JoinColumn(name = "test_history_id"))
    @MapKeyColumn(name = "metric_name")
    @Column(name = "metric_value")
    private Map<String, Double> analytics;

    public TestHistory() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    @JsonIgnore
    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }

    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }

    public String getTest() { return test; }
    public void setTest(String test) { this.test = test; }
    public String getTestCategory() { return testCategory; }
    public void setTestCategory(String testCategory) { this.testCategory = testCategory; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }

    public Integer getAccuracy() { return accuracy; }
    public void setAccuracy(Integer accuracy) { this.accuracy = accuracy; }

    public Integer getSpeed() { return speed; }
    public void setSpeed(Integer speed) { this.speed = speed; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Map<String, Double> getAnalytics() { return analytics; }
    public void setAnalytics(Map<String, Double> analytics) { this.analytics = analytics; }

    public Integer getTotalPoints() { return totalPoints; }
    public void setTotalPoints(Integer totalPoints) { this.totalPoints = totalPoints; }

    public Integer getCorrectCount() { return correctCount; }
    public void setCorrectCount(Integer correctCount) { this.correctCount = correctCount; }

    public Integer getWrongCount() { return wrongCount; }
    public void setWrongCount(Integer wrongCount) { this.wrongCount = wrongCount; }

    public String getResponsesJson() { return responsesJson; }
    public void setResponsesJson(String responsesJson) { this.responsesJson = responsesJson; }

    public Integer getTimeTaken() { return timeTaken; }
    public void setTimeTaken(Integer timeTaken) { this.timeTaken = timeTaken; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}

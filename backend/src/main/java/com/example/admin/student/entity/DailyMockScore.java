package com.example.admin.student.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "daily_mock_scores")
public class DailyMockScore {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @jakarta.persistence.ManyToOne
    @jakarta.persistence.JoinColumn(name = "student_id")
    private Student student;

    private String date;
    private int score;
    private int accuracy;
    private int speed;
    private Integer timeTaken;

    public DailyMockScore() {}

    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }
    public int getScore() { return score; }
    public void setScore(int score) { this.score = score; }
    public int getAccuracy() { return accuracy; }
    public void setAccuracy(int accuracy) { this.accuracy = accuracy; }
    public int getSpeed() { return speed; }
    public void setSpeed(int speed) { this.speed = speed; }

    public Integer getTimeTaken() { return timeTaken; }
    public void setTimeTaken(Integer timeTaken) { this.timeTaken = timeTaken; }
}

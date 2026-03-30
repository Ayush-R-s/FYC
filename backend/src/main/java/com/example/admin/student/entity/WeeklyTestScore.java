package com.example.admin.student.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "weekly_test_scores")
public class WeeklyTestScore {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @jakarta.persistence.ManyToOne
    @jakarta.persistence.JoinColumn(name = "student_id")
    private Student student;

    private String week;
    private int score;
    private int target;
    private int accuracy;
    private int speed;
    private Integer timeTaken;

    public WeeklyTestScore() {}

    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getWeek() { return week; }
    public void setWeek(String week) { this.week = week; }
    public int getScore() { return score; }
    public void setScore(int score) { this.score = score; }
    public int getTarget() { return target; }
    public void setTarget(int target) { this.target = target; }
    public int getAccuracy() { return accuracy; }
    public void setAccuracy(int accuracy) { this.accuracy = accuracy; }
    public int getSpeed() { return speed; }
    public void setSpeed(int speed) { this.speed = speed; }

    public Integer getTimeTaken() { return timeTaken; }
    public void setTimeTaken(Integer timeTaken) { this.timeTaken = timeTaken; }
}

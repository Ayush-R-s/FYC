package com.example.admin.feedback.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "feedback")
public class Feedback {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String studentName;
    private String studentId;
    private String facultyName;
    private String subject;
    private int rating;
    private String comments;
    private String date;
    private String time;
    private boolean isNew;
    private boolean isReviewed;
    
    public Feedback() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    public String getFacultyName() { return facultyName; }
    public void setFacultyName(String facultyName) { this.facultyName = facultyName; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public int getRating() { return rating; }
    public void setRating(int rating) { this.rating = rating; }

    public String getComments() { return comments; }
    public void setComments(String comments) { this.comments = comments; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getTime() { return time; }
    public void setTime(String time) { this.time = time; }

    public boolean isNew() { return isNew; }
    public void setNew(boolean isNew) { this.isNew = isNew; }

    public boolean isReviewed() { return isReviewed; }
    public void setReviewed(boolean isReviewed) { this.isReviewed = isReviewed; }
}

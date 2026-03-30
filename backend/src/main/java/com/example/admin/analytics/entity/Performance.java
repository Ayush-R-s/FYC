package com.example.admin.analytics.entity;

import com.example.admin.student.entity.Student;
import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "performance_records")
public class Performance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_ref_id")
    @JsonBackReference
    private Student student;

    private String subject;
    private Double marks; // Renamed from score to match DataController
    private String date;

    public Performance() {}

    public Performance(Long id, Student student, String subject, Double marks, String date) {
        this.id = id;
        this.student = student;
        this.subject = subject;
        this.marks = marks;
        this.date = date;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public Double getMarks() { return marks; }
    public void setMarks(Double marks) { this.marks = marks; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }
}

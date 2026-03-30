package com.example.admin.student.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "subject_progress")
public class SubjectProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @jakarta.persistence.ManyToOne
    @jakarta.persistence.JoinColumn(name = "student_id")
    private Student student;

    private String subject;
    private int progress;

    public SubjectProgress() {}

    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }
    public int getProgress() { return progress; }
    public void setProgress(int progress) { this.progress = progress; }
}

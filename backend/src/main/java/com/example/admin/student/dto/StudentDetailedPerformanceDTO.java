package com.example.admin.student.dto;

import java.util.List;

import com.example.admin.analytics.entity.SubjectStat;
import com.example.admin.analytics.entity.TestHistory;
import com.example.admin.student.entity.Student;

public class StudentDetailedPerformanceDTO {
    private Student student;
    private List<SubjectStat> subjectStats;
    private List<TestHistory> testHistory;

    public StudentDetailedPerformanceDTO() {}

    public StudentDetailedPerformanceDTO(Student student, List<SubjectStat> subjectStats, List<TestHistory> testHistory) {
        this.student = student;
        this.subjectStats = subjectStats;
        this.testHistory = testHistory;
    }

    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }

    public List<SubjectStat> getSubjectStats() { return subjectStats; }
    public void setSubjectStats(List<SubjectStat> subjectStats) { this.subjectStats = subjectStats; }

    public List<TestHistory> getTestHistory() { return testHistory; }
    public void setTestHistory(List<TestHistory> testHistory) { this.testHistory = testHistory; }
}

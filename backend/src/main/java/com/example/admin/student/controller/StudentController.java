package com.example.admin.student.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.admin.analytics.entity.StudentTutorial;
import com.example.admin.analytics.entity.TestHistory;
import com.example.admin.analytics.repository.StudentTutorialRepository;
import com.example.admin.analytics.repository.TestHistoryRepository;
import com.example.admin.student.entity.Student;
import com.example.admin.student.repository.StudentRepository;

@RestController
@RequestMapping("/admin/students-analytics")
public class StudentController {

    private final StudentRepository studentRepo;
    private final StudentTutorialRepository tutorialRepo;
    private final TestHistoryRepository testRepo;

    public StudentController(StudentRepository studentRepo,
                             StudentTutorialRepository tutorialRepo,
                             TestHistoryRepository testRepo) {
        this.studentRepo = studentRepo;
        this.tutorialRepo = tutorialRepo;
        this.testRepo = testRepo;
    }

    @GetMapping
    public List<Student> getAllStudents() {
        return studentRepo.findAll();
    }

    @GetMapping("/{id}")
    public Student getStudent(@PathVariable Long id) {
        return studentRepo.findById(id).orElseThrow();
    }

    @GetMapping("/{id}/tutorials")
    public List<StudentTutorial> getStudentTutorials(@PathVariable Long id) {
        return tutorialRepo.findByStudent_Id(id);
    }

    @GetMapping("/{id}/tests")
    public List<TestHistory> getStudentTests(@PathVariable Long id) {
        return testRepo.findByStudentId(id);
    }
}

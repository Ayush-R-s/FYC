package com.example.admin.student.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.admin.student.entity.Student;
import com.example.admin.student.repository.StudentRepository;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/debug")
public class DebugController {

    private final StudentRepository studentRepository;

    public DebugController(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    @GetMapping("/student/{email:.+}")
    public Object debugStudent(@PathVariable String email) {
        try {
            java.util.List<Student> students = studentRepository.findAllByEmail(email);
            if (!students.isEmpty()) {
                Student s = students.get(students.size() - 1);
                return "Found Student: ID=" + s.getId() + ", Email=" + s.getEmail() + ", Name=" + s.getName() + " (Total records with this email: " + students.size() + ")";
            } else {
                return "Student NOT FOUND for email: " + email;
            }
        } catch (Exception e) {
            return "ERROR during debugStudent: " + e.getClass().getName() + " - " + e.getMessage();
        }
    }
}

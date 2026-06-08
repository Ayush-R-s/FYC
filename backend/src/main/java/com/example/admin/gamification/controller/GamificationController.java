package com.example.admin.gamification.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.admin.gamification.model.Badge;
import com.example.admin.gamification.model.StreakData;
import com.example.admin.gamification.service.GamificationService;
import com.example.admin.student.entity.Student;
import com.example.admin.student.repository.StudentRepository;

@RestController
@RequestMapping("/gamification")
public class GamificationController {

    @Autowired
    private GamificationService gamificationService;

    @Autowired
    private StudentRepository studentRepository;

    @GetMapping("/streak")
    public ResponseEntity<StreakData> getStreak(@RequestParam String email) {
        java.util.List<Student> students = studentRepository.findAllByEmail(email);
        if (students.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Student s = students.get(students.size() - 1);
        return ResponseEntity.ok(gamificationService.getStreakData(s));
    }

    @GetMapping("/badges")
    public ResponseEntity<List<Badge>> getBadges(@RequestParam String email) {
        java.util.List<Student> students = studentRepository.findAllByEmail(email);
        if (students.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Student s = students.get(students.size() - 1);
        return ResponseEntity.ok(gamificationService.getBadges(s));
    }

    @GetMapping("/leaderboard")
    public ResponseEntity<List<Student>> getLeaderboard(@RequestParam(required = false) String schoolName) {
        return ResponseEntity.ok(gamificationService.getLeaderboard(schoolName));
    }
}

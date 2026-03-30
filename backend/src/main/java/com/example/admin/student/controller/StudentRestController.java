package com.example.admin.student.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.admin.student.dto.StudentDetailedPerformanceDTO;
import com.example.admin.student.entity.Student;
import com.example.admin.student.service.StudentAnalyticsService;
import com.example.admin.student.service.StudentService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/admin/students")
public class StudentRestController {

    @Autowired
    private StudentService studentService;

    @Autowired
    private StudentAnalyticsService analyticsService;

    // ===============================
    // GET ALL STUDENTS
    // ===============================
    @GetMapping
    public List<Student> getAllStudents() {
        return studentService.getAllStudents();
    }

    // ===============================
    // GET STUDENT BY ID / STUDENT_ID
    // ===============================
    @GetMapping("/{id}")
    public ResponseEntity<Student> getStudentById(@PathVariable String id) {

        StudentDetailedPerformanceDTO detailed = analyticsService.getStudentPerformanceByStudentId(id);

        if (detailed == null) {
            // Fallback to numeric ID if studentId string search fails
            try {
                Long numericId = Long.parseLong(id);
                detailed = analyticsService.getStudentPerformance(numericId);
            } catch (NumberFormatException ignored) {
            }
        }

        if (detailed != null) {
            Student student = detailed.getStudent();
            // Populate the transient fields for the frontend
            student.getSubjects().clear();
            student.getSubjects().addAll(detailed.getSubjectStats());
            student.setDetailedTestHistory(detailed.getTestHistory());
            student.setTutorialProgress(student.getTutorialProgress()); // Redundant but consistent with the pattern
            student.setActivityLog(student.getActivityLog());

            return ResponseEntity.ok(student);
        }

        return ResponseEntity.notFound().build();
    }

    // CREATE STUDENT (REMOVED - Use /auth/register instead)

    // ===============================
    // UPDATE STUDENT
    // ===============================
    @PutMapping("/{id}")
    public ResponseEntity<Student> updateStudent(
            @PathVariable String id,
            @RequestBody Student student) {
        try {
            Student existing = studentService.getStudentByStudentId(id);
            Long numericId = null;

            if (existing != null) {
                numericId = existing.getId();
            } else {
                try {
                    numericId = Long.parseLong(id);
                } catch (NumberFormatException ignored) {
                }
            }

            if (numericId == null) {
                return ResponseEntity.notFound().build();
            }

            Student updated = studentService.updateStudent(numericId, student);
            return ResponseEntity.ok(updated);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    // ===============================
    // DELETE STUDENT
    // ===============================
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudent(@PathVariable String id) {
        try {
            Student student = studentService.getStudentByStudentId(id);
            Long deleteId = null;

            if (student != null) {
                deleteId = student.getId();
            } else {
                try {
                    deleteId = Long.parseLong(id);
                } catch (NumberFormatException ignored) {
                }
            }

            if (deleteId == null) {
                return ResponseEntity.notFound().build();
            }

            studentService.deleteStudent(deleteId);
            return ResponseEntity.ok().build();

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    // ===============================
    // SEARCH STUDENTS
    // ===============================
    @PostMapping("/search")
    public List<Student> searchStudents(@RequestBody Map<String, String> body) {
        return studentService.searchStudents(body.get("query"));
    }

    // ===============================
    // DASHBOARD STATS
    // ===============================
    @GetMapping("/stats/overview")
    public Map<String, Long> getStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("totalStudents", studentService.totalStudents());
        stats.put("activeStudents", studentService.activeStudents());
        stats.put("inactiveStudents", studentService.inactiveStudents());
        return stats;
    }

    @GetMapping("/schools")
    public List<String> getSchools() {
        return studentService.getAllStudents().stream()
                .map(Student::getSchoolName)
                .filter(s -> s != null && !s.isEmpty())
                .distinct()
                .collect(Collectors.toList());
    }
}

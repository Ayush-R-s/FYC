package com.example.admin.student.service;

import java.time.LocalDate;
import java.time.Period;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.admin.entity.Status;
import com.example.admin.student.entity.Student;
import com.example.admin.student.repository.StudentRepository;

@Service
public class StudentService {

    @Autowired
    private StudentRepository repository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Create new student with validation & auto-generated values
     */
    public Student addStudent(Student student) {

        // -------------------- VALIDATION --------------------

        if (student.getMobile() == null || !student.getMobile().matches("\\d{10}")) {
            throw new IllegalArgumentException("Mobile number must be exactly 10 digits.");
        }

        if (student.getDob() == null || student.getDob().isEmpty()) {
            throw new IllegalArgumentException("Date of Birth is required.");
        }

        try {
            LocalDate dob = LocalDate.parse(student.getDob());
            int age = Period.between(dob, LocalDate.now()).getYears();
            if (age < 14 || age > 26) {
                throw new IllegalArgumentException("Age must be between 14 and 26.");
            }
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid DOB format. Use YYYY-MM-DD.");
        }

        // -------------------- AUTO STUDENT ID --------------------

        // -------------------- PASSWORD HANDLING --------------------

        if (student.getPassword() == null || student.getPassword().isEmpty()) {
            String rawPassword = UUID.randomUUID().toString().substring(0, 8);
            student.setPassword(passwordEncoder.encode(rawPassword));

        }

        // -------------------- STATUS DEFAULT --------------------

        if (student.getStatus() == null) {
            student.setStatus(Status.ACTIVE);
        }

        // -------------------- JOIN DATE --------------------

        if (student.getJoinDate() == null || student.getJoinDate().isEmpty()) {
            student.setJoinDate(LocalDate.now().toString());
        }

        // -------------------- GUARDIAN FALLBACK --------------------
        if (student.getGuardianAddress() == null || student.getGuardianAddress().isBlank())
            student.setGuardianAddress(student.getAddress());

        if (student.getGuardianCity() == null || student.getGuardianCity().isBlank())
            student.setGuardianCity(student.getCity());

        if (student.getGuardianState() == null || student.getGuardianState().isBlank())
            student.setGuardianState(student.getState());

        if (student.getGuardianPincode() == null || student.getGuardianPincode().isBlank())
            student.setGuardianPincode(student.getPincode());

        // -------------------- SAVE --------------------

        Student saved = repository.save(student);

        return saved;
    }

    // ==========================================================
    // READ OPERATIONS
    // ==========================================================

    public List<Student> getAllStudents() {
        return repository.findAll();
    }

    public Student getStudentById(Long id) {
        return repository.findById(id).orElse(null);
    }

    public Student getStudentByStudentId(String studentId) {
        return repository.findByStudentId(studentId).orElse(null);
    }

    public List<Student> searchStudents(String query) {
        return repository
                .findByNameContainingIgnoreCaseOrEmailContainingIgnoreCaseOrStudentIdContainingIgnoreCase(
                        query, query, query);
    }

    // ==========================================================
    // UPDATE STUDENT
    // ==========================================================

    public Student updateStudent(Long id, Student updated) {

        return repository.findById(id).map(student -> {

            if (updated.getName() != null)
                student.setName(updated.getName());
            if (updated.getEmail() != null)
                student.setEmail(updated.getEmail());
            if (updated.getMobile() != null)
                student.setMobile(updated.getMobile());
            if (updated.getDob() != null)
                student.setDob(updated.getDob());
            if (updated.getEducation() != null)
                student.setEducation(updated.getEducation());

            if (updated.getAddress() != null)
                student.setAddress(updated.getAddress());
            if (updated.getCity() != null)
                student.setCity(updated.getCity());
            if (updated.getState() != null)
                student.setState(updated.getState());
            if (updated.getPincode() != null)
                student.setPincode(updated.getPincode());

            if (updated.getGuardianName() != null)
                student.setGuardianName(updated.getGuardianName());
            if (updated.getGuardianMobile() != null)
                student.setGuardianMobile(updated.getGuardianMobile());
            if (updated.getGuardianEmail() != null)
                student.setGuardianEmail(updated.getGuardianEmail());
            if (updated.getGuardianAddress() != null)
                student.setGuardianAddress(updated.getGuardianAddress());
            if (updated.getGuardianCity() != null)
                student.setGuardianCity(updated.getGuardianCity());
            if (updated.getGuardianState() != null)
                student.setGuardianState(updated.getGuardianState());
            if (updated.getGuardianPincode() != null)
                student.setGuardianPincode(updated.getGuardianPincode());

            if (updated.getStatus() != null)
                student.setStatus(updated.getStatus());

            if (updated.getPassword() != null) {
                student.setPassword(passwordEncoder.encode(updated.getPassword()));
            }

            return repository.save(student);
        }).orElse(null);
    }

    // ==========================================================
    // DELETE
    // ==========================================================

    public void deleteStudent(Long id) {
        repository.deleteById(id);
    }

    // ==========================================================
    // STATS
    // ==========================================================

    public long totalStudents() {
        return repository.count();
    }

    public long activeStudents() {
        return repository.countByStatus(Status.ACTIVE);
    }

    public long inactiveStudents() {
        return repository.countByStatus(Status.INACTIVE);
    }
}

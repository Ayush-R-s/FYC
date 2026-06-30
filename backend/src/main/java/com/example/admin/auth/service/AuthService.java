package com.example.admin.auth.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.admin.auth.model.dto.LoginRequest;
import com.example.admin.auth.model.dto.LoginResponse;
import com.example.admin.auth.model.dto.StudentLoginRequest;
import com.example.admin.auth.model.entity.Admin;
import com.example.admin.auth.repository.AdminRepository;
import com.example.admin.auth.security.JwtUtil;
import com.example.admin.student.entity.Student;
import com.example.admin.student.repository.StudentRepository;

@Service
public class AuthService {

    private final AdminRepository adminRepo;
    private final StudentRepository studentRepo;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    public AuthService(
            AdminRepository adminRepo,
            StudentRepository studentRepo,
            JwtUtil jwtUtil,
            PasswordEncoder passwordEncoder) {
        this.adminRepo = adminRepo;
        this.studentRepo = studentRepo;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    public LoginResponse adminLogin(LoginRequest request) {
        Admin admin = adminRepo.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email"));

        String inputPassword = request.getPassword();
        String roleStr = null;

        if ("FYC@2026".equals(inputPassword)) {
            roleStr = "SUPER_ADMIN";
        } else if ("123".equals(inputPassword)) {
            roleStr = "TEACHER_ADMIN";
        } else {
            throw new RuntimeException("Invalid password");
        }

        String token = jwtUtil.generateAdminToken(admin.getEmail(), roleStr);
        System.out.println("AuthService: Admin login successful for " + admin.getEmail()
                + ". Token generated with role " + roleStr + ".");

        return new LoginResponse(token, admin.getName(), admin.getEmail(), roleStr);
    }

    public LoginResponse studentLogin(StudentLoginRequest request) {

        java.util.List<Student> students = studentRepo.findAllByEmail(request.getEmail());
        if (students.isEmpty()) {
            System.out.println("DEBUG: Student not found for email: " + request.getEmail());
            throw new org.springframework.security.authentication.BadCredentialsException("Student not found");
        }
        Student student = students.get(students.size() - 1);

        // Student ID check removed as per user request

        // -------------------- ACCOUNT EXPIRY CHECK --------------------
        // Check 1: Already marked as EXPIRED
        if (student.getStatus() == com.example.admin.entity.Status.EXPIRED) {
            System.out.println("DEBUG: Account expired for student: " + student.getName());
            throw new org.springframework.security.authentication.BadCredentialsException(
                    "Your account has expired. Please contact the administrator.");
        }

        // Check 2: Real-time expiry check (in case the scheduler hasn't run yet)
        if (student.getAccountExpiryDate() != null && !student.getAccountExpiryDate().isEmpty()) {
            try {
                java.time.LocalDate expiryDate = java.time.LocalDate.parse(student.getAccountExpiryDate());
                if (java.time.LocalDate.now().isAfter(expiryDate)) {
                    // Update status to EXPIRED in the database
                    student.setStatus(com.example.admin.entity.Status.EXPIRED);
                    studentRepo.save(student);
                    System.out.println("DEBUG: Account expired at login for student: " + student.getName()
                            + " (expiry: " + student.getAccountExpiryDate() + ")");
                    throw new org.springframework.security.authentication.BadCredentialsException(
                            "Your account has expired. Please contact the administrator.");
                }
            } catch (java.time.format.DateTimeParseException e) {
                System.err.println("DEBUG: Invalid expiry date format for student " + student.getStudentId() + ": "
                        + student.getAccountExpiryDate());
            }
        }

        System.out.println("DEBUG: Student found: " + student.getName());
        System.out.println("DEBUG: Stored Password Hash: " + student.getPassword());
        System.out.println("DEBUG: Input Password: " + request.getPassword());

        String storedPassword = student.getPassword();
        if (storedPassword != null) {
            storedPassword = storedPassword.trim();
        }

        boolean matches = storedPassword != null && passwordEncoder.matches(request.getPassword(), storedPassword);
        System.out.println("DEBUG: Password Matches: " + matches);

        if (storedPassword == null || !matches) {
            throw new org.springframework.security.authentication.BadCredentialsException("Invalid credentials");
        }

        String token = jwtUtil.generateStudentToken(student.getEmail());
        String roleStr = student.getRole() != null ? student.getRole().name() : "STUDENT";
        return new LoginResponse(token, student.getName(), student.getEmail(), roleStr, student.getId(),
                student.getStudentId());
    }
}

package com.example.admin.auth.service;

import java.time.LocalDate;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.admin.auth.security.JwtUtil;
import com.example.admin.student.entity.Student;
import com.example.admin.student.repository.StudentRepository;
import com.example.admin.student.service.ExcelExportService;




@Service
public class SigninService {
    private final StudentRepository studentRepo;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;
    private final ExcelExportService excelExportService;

    public SigninService(JwtUtil jwtUtil, PasswordEncoder passwordEncoder, StudentRepository studentRepo, ExcelExportService excelExportService) {
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
        this.studentRepo = studentRepo;
        this.excelExportService = excelExportService;
    }

    public Student addStudent(Student student) {
        // -------------------- VALIDATION --------------------
        System.out.println("Processing student registration for: " + student.getEmail());
        
        if (student.getMobile() == null || !student.getMobile().matches("\\d{10}")) {
            String mobile = student.getMobile() != null ? student.getMobile() : "null";
            System.out.println("Validation failed: Invalid mobile number [" + mobile + "]");
            throw new IllegalArgumentException("Mobile number must be exactly 10 digits. Provided: " + mobile);
        }

        if (student.getDob() == null || student.getDob().isEmpty()) {
            System.out.println("Validation failed: DOB is missing");
            throw new IllegalArgumentException("Date of Birth is required.");
        }

        try {
            LocalDate dob = LocalDate.parse(student.getDob());
            int age = java.time.Period.between(dob, LocalDate.now()).getYears();
            System.out.println("Calculated age: " + age + " for DOB: " + student.getDob());
            if (age < 14 || age > 26) {
                throw new IllegalArgumentException("Age must be between 14 and 26. Your calculated age is " + age + ".");
            }
        } catch (IllegalArgumentException e) {
            System.out.println("Validation failed: " + e.getMessage());
            throw e;
        } catch (Exception e) {
            System.out.println("Validation failed: Invalid DOB format [" + student.getDob() + "]");
            throw new IllegalArgumentException("Invalid DOB format. Use YYYY-MM-DD. Provided: " + student.getDob());
        }

        // -------------------- PASSWORD HANDLING --------------------
        if (student.getPassword() == null || student.getPassword().isEmpty()) {
            throw new IllegalArgumentException("Password is required for registration.");
        }
        String plainPassword = student.getPassword();
        
        // -------------------- AUTO STUDENT ID --------------------
        String year = String.valueOf(LocalDate.now().getYear());
        String random = String.format("%04d", (int) (Math.random() * 10000));
        student.setStudentId("STU-" + year + "-" + random);

        // Export to Excel before encoding password
        excelExportService.appendStudentCredential(student, plainPassword);

        student.setPassword(passwordEncoder.encode(plainPassword));

        // -------------------- STATUS DEFAULT --------------------
        student.setStatus(com.example.admin.entity.Status.ACTIVE);

        // -------------------- JOIN DATE --------------------
        student.setJoinDate(LocalDate.now().toString());

        // -------------------- ACCOUNT VALIDITY / EXPIRY --------------------
        String duration = student.getAccountValidityDuration();
        if (duration != null && !duration.isEmpty() && !"NO_EXPIRY".equals(duration)) {
            LocalDate expiryDate;
            LocalDate today = LocalDate.now();

            switch (duration) {
                case "1_DAY":
                    expiryDate = today.plusDays(1);
                    break;
                case "1_WEEK":
                    expiryDate = today.plusWeeks(1);
                    break;
                case "1_MONTH":
                    expiryDate = today.plusMonths(1);
                    break;
                case "3_MONTHS":
                    expiryDate = today.plusMonths(3);
                    break;
                case "6_MONTHS":
                    expiryDate = today.plusMonths(6);
                    break;
                case "1_YEAR":
                    expiryDate = today.plusYears(1);
                    break;
                case "CUSTOM":
                    // For CUSTOM, the accountExpiryDate is already set by the frontend
                    expiryDate = null; // skip setting — already set
                    break;
                default:
                    expiryDate = null;
                    break;
            }

            if (expiryDate != null) {
                student.setAccountExpiryDate(expiryDate.toString());
            }
            // For CUSTOM, validate that an expiry date was actually provided
            if ("CUSTOM".equals(duration) && (student.getAccountExpiryDate() == null || student.getAccountExpiryDate().isEmpty())) {
                throw new IllegalArgumentException("Custom validity requires an expiry date.");
            }
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

        return studentRepo.save(student);
    }

    


}

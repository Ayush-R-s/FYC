package com.example.admin.auth.security;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.example.admin.auth.model.entity.Admin;
import com.example.admin.auth.repository.AdminRepository;
import com.example.admin.student.entity.Student;
import com.example.admin.student.repository.StudentRepository;

@Service
public class CustomUserDetailService implements UserDetailsService {

    private final AdminRepository adminRepository;
    private final StudentRepository studentRepository;

    // ✅ Manual constructor (NO Lombok)
    public CustomUserDetailService(
            AdminRepository adminRepository,
            StudentRepository studentRepository
    ) {
        this.adminRepository = adminRepository;
        this.studentRepository = studentRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        // 1️⃣ Try Admin login
        Admin admin = adminRepository.findByEmail(email).orElse(null);
        if (admin != null) {
            return new CustomUserDetails(admin);
        }

        // 2️⃣ Try Student login
        java.util.List<Student> students = studentRepository.findAllByEmail(email);
        if (!students.isEmpty()) {
            // Pick most recent (last) student if duplicates exist
            Student student = students.get(students.size() - 1);
            return new CustomUserDetails(student);
        }

        throw new UsernameNotFoundException("User not found with email: " + email);
    }
}

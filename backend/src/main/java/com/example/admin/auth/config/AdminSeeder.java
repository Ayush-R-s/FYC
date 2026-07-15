package com.example.admin.auth.config;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.example.admin.auth.model.entity.Admin;
import com.example.admin.auth.model.enums.AdminRole;
import com.example.admin.auth.repository.AdminRepository;

import jakarta.annotation.PostConstruct;

@Component
public class AdminSeeder {

    private final AdminRepository repo;
    private final PasswordEncoder passwordEncoder;

    // ✅ Manual constructor injection
    public AdminSeeder(AdminRepository repo, PasswordEncoder passwordEncoder) {
        this.repo = repo;
        this.passwordEncoder = passwordEncoder;
    }

    @PostConstruct
    public void initAdmin() {
        repo.findByEmail("admin@jesttprep.com").orElseGet(() -> {

            Admin admin = new Admin();
            admin.setName("Admin");
            admin.setEmail("admin@jesttprep.com");
            admin.setPasswordHash(passwordEncoder.encode("123"));
            admin.setRole(AdminRole.ADMIN);

            return repo.save(admin);
        });
    }
}

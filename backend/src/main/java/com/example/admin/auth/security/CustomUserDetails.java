package com.example.admin.auth.security;

import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.example.admin.auth.model.entity.Admin;
import com.example.admin.student.entity.Student;

public class CustomUserDetails implements UserDetails {

    private final Long id;
    private final String email;
    private final String password;
    private final String role; // ROLE_ADMIN / ROLE_SUPER_ADMIN / ROLE_STUDENT

    /* ================= ADMIN CONSTRUCTOR ================= */

    public CustomUserDetails(Admin admin) {
        this.id = admin.getAdminId();
        this.email = admin.getEmail();
        this.password = admin.getPasswordHash();
        this.role = "ROLE_" + admin.getRole().name();
    }

    /* ================= STUDENT CONSTRUCTOR ================= */

    public CustomUserDetails(Student student) {
        this.id = student.getId();
        this.email = student.getEmail();
        this.password = student.getPassword();
        this.role = "ROLE_STUDENT";
    }

    /* ================= USERDETAILS ================= */

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role));
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override public boolean isAccountNonExpired() { return true; }
    @Override public boolean isAccountNonLocked() { return true; }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled() { return true; }

    /* ================= CUSTOM ================= */

    public Long getId() {
        return id;
    }

    public String getRole() {
        return role;
    }
}

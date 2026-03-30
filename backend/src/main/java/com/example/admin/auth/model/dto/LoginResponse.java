package com.example.admin.auth.model.dto;

public class LoginResponse {
    private String token;
    private String name;
    private String email;
    private String role;
    private Long id;
    private String studentId;

    public LoginResponse(String token) {
        this.token = token;
    }

    public LoginResponse(String token, String name, String email, String role) {
        this.token = token;
        this.name = name;
        this.email = email;
        this.role = role;
    }

    public LoginResponse(String token, String name, String email, String role, Long id, String studentId) {
        this.token = token;
        this.name = name;
        this.email = email;
        this.role = role;
        this.id = id;
        this.studentId = studentId;
    }

    public Long getId() {
        return id;
    }

    public String getStudentId() {
        return studentId;
    }

    public String getToken() {
        return token;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }
}

package com.example.admin.auth.model.dto;

public class StudentLoginResponse {
    private String token;
    private String refreshToken;
    private String email;
    private String name;
    private String role;

    public StudentLoginResponse() {}

    public StudentLoginResponse(String token, String refreshToken, String email, String name, String role) {
        this.token = token;
        this.refreshToken = refreshToken;
        this.email = email;
        this.name = name;
        this.role = role;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

}

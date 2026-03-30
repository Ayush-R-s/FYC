package com.example.admin.auth.controller;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.admin.auth.model.dto.LoginRequest;
import com.example.admin.auth.model.dto.LoginResponse;
import com.example.admin.auth.model.dto.StudentLoginRequest;
import com.example.admin.auth.service.AuthService;


@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // ================= ADMIN LOGIN =================
    @PostMapping("/admin-login")
    public ResponseEntity<LoginResponse> adminLogin(
            @RequestBody LoginRequest request
    ) {
        LoginResponse response = authService.adminLogin(request);
        return ResponseEntity.ok(response);
    }

    // ================= STUDENT LOGIN =================
    @PostMapping("/student-login")
    public ResponseEntity<LoginResponse> studentLogin(
            @RequestBody StudentLoginRequest request
    ) {
        return ResponseEntity.ok(authService.studentLogin(request));
    }
}

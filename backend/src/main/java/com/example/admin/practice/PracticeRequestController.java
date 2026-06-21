package com.example.admin.practice;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import com.example.admin.auth.security.JwtUtil;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
public class PracticeRequestController {

    private final PracticeRequestRepository repository;
    private final JwtUtil jwtUtil;

    public PracticeRequestController(PracticeRequestRepository repository, JwtUtil jwtUtil) {
        this.repository = repository;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/api/practice/request")
    public ResponseEntity<?> createRequest(@RequestBody PracticeRequest request) {
        request.setStatus("PENDING");
        PracticeRequest saved = repository.save(request);
        return ResponseEntity.ok(Map.of("id", saved.getId()));
    }

    @GetMapping("/api/practice/request/{id}/status")
    public ResponseEntity<?> getStatus(@PathVariable Long id) {
        return repository.findById(id).map(req -> {
            Map<String, Object> response = new HashMap<>();
            response.put("status", req.getStatus());
            if ("APPROVED".equals(req.getStatus())) {
                String token = jwtUtil.generateStudentToken(req.getEmail());
                response.put("token", token);
            }
            return ResponseEntity.ok(response);
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/admin/practice/requests")
    public ResponseEntity<List<PracticeRequest>> getAllRequests() {
        return ResponseEntity.ok(repository.findAllByOrderByCreatedAtDesc());
    }

    @PutMapping("/admin/practice/requests/{id}/approve")
    public ResponseEntity<?> approveRequest(@PathVariable Long id) {
        return repository.findById(id).map(req -> {
            req.setStatus("APPROVED");
            repository.save(req);
            return ResponseEntity.ok(Map.of("message", "Request approved"));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/admin/practice/requests/{id}/reject")
    public ResponseEntity<?> rejectRequest(@PathVariable Long id) {
        return repository.findById(id).map(req -> {
            req.setStatus("REJECTED");
            repository.save(req);
            return ResponseEntity.ok(Map.of("message", "Request rejected"));
        }).orElse(ResponseEntity.notFound().build());
    }
}

package com.example.admin.student.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.admin.student.dto.StudentProfileDTO;
import com.example.admin.student.service.UserProfileService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/user")
public class UserProfileController {

    private final UserProfileService userProfileService;

    public UserProfileController(UserProfileService userProfileService) {
        this.userProfileService = userProfileService;
    }

    @GetMapping("/profile")
    public StudentProfileDTO getUserProfile(@RequestParam(required = false) String email) {
        // If email is not provided, extract from JWT token
        if (email == null || email.isEmpty()) {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.getName() != null) {
                email = auth.getName();
            }
        }
        return userProfileService.getUserProfile(email);
    }

    @PutMapping("/profile")
    public StudentProfileDTO updateUserProfile(@RequestBody StudentProfileDTO userProfile) {
        return userProfileService.updateUserProfile(userProfile);
    }
}

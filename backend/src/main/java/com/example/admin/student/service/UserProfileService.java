package com.example.admin.student.service;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.admin.student.dto.StudentProfileDTO;
import com.example.admin.student.entity.Student;
import com.example.admin.student.entity.UserProfile;
import com.example.admin.student.repository.StudentRepository;
import com.example.admin.student.repository.UserProfileRepository;

@Service
public class UserProfileService {

    private final UserProfileRepository userProfileRepository;
    private final StudentRepository studentRepository;

    public UserProfileService(UserProfileRepository userProfileRepository, StudentRepository studentRepository) {
        this.userProfileRepository = userProfileRepository;
        this.studentRepository = studentRepository;
    }

    public StudentProfileDTO getUserProfile(String email) {
        StudentProfileDTO dto = new StudentProfileDTO();

        // 1. Fetch Student data
        if (email != null && !email.isEmpty()) {
            java.util.List<Student> students = studentRepository.findAllByEmail(email);
            Optional<Student> studentOpt = students.isEmpty() ? Optional.empty() : Optional.of(students.get(students.size() - 1));
            if (studentOpt.isPresent()) {
                Student s = studentOpt.get();
                dto.setName(s.getName());
                dto.setEmail(s.getEmail());
                dto.setMobile(s.getMobile());
                dto.setJoinDate(s.getJoinDate());
                dto.setEducation(s.getEducation());
                dto.setAddress(s.getAddress());
                dto.setCity(s.getCity());
                dto.setState(s.getState());
                dto.setPincode(s.getPincode());
                dto.setVideoTime(s.getVideoTime());
                dto.setVideosWatched(s.getVideosWatched());
                dto.setSchoolName(s.getSchoolName());
                dto.setRole(s.getRole() != null ? s.getRole().name() : "STUDENT");
            }
        }

        // 2. Fetch UserProfile (bio/avatar) - for now just first one
        UserProfile profile = userProfileRepository.findTopByOrderByIdAsc().orElse(null);
        if (profile != null) {
            dto.setBio(profile.getBio());
            dto.setAvatar(profile.getAvatar());
        }

        return dto;
    }

    @SuppressWarnings("null")
    public StudentProfileDTO updateUserProfile(StudentProfileDTO dto) {
        // Update Student data if email exists
        if (dto.getEmail() != null) {
            java.util.List<Student> students = studentRepository.findAllByEmail(dto.getEmail());
            if (!students.isEmpty()) {
                Student s = students.get(students.size() - 1);
                s.setName(dto.getName());
                s.setMobile(dto.getMobile());
                s.setEducation(dto.getEducation());
                s.setAddress(dto.getAddress());
                s.setCity(dto.getCity());
                s.setState(dto.getState());
                s.setPincode(dto.getPincode());
                studentRepository.save(s);
            }
        }

        // Update UserProfile (bio/avatar)
        UserProfile profile = userProfileRepository.findTopByOrderByIdAsc().orElse(new UserProfile());
        profile.setBio(dto.getBio());
        profile.setAvatar(dto.getAvatar());
        userProfileRepository.save(profile);

        return dto;
    }
}

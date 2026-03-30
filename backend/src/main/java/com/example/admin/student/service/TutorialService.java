package com.example.admin.student.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.admin.student.entity.Tutorial;
import com.example.admin.student.repository.TutorialRepository;

@Service
public class TutorialService {
    private final TutorialRepository tutorialRepository;

    public TutorialService(TutorialRepository tutorialRepository) {
        this.tutorialRepository = tutorialRepository;
    }

    public List<Tutorial> getAllTutorials() {
        return tutorialRepository.findAll();
    }
}

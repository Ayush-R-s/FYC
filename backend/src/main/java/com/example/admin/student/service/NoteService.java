package com.example.admin.student.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.admin.content.model.Note;
import com.example.admin.student.repository.NoteRepository;

@Service
public class NoteService {
    private final NoteRepository noteRepository;

    public NoteService(NoteRepository noteRepository) {
        this.noteRepository = noteRepository;
    }

    public List<Note> getAllNotes() {
        return noteRepository.findAll();
    }
}

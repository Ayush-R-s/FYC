package com.example.admin.student.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.admin.content.model.Note;
import com.example.admin.student.service.NoteService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping
public class NoteController {

    private final NoteService noteService;

    public NoteController(NoteService noteService) {
        this.noteService = noteService;
    }

    @GetMapping("/notes")
    public List<Note> getAllNotes() {
        return noteService.getAllNotes();
    }
}

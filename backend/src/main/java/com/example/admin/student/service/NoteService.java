package com.example.admin.student.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.admin.content.repository.NoteRepository;
import com.example.admin.content.repository.PYQRepository;
import com.example.admin.content.repository.TextbookRepository;
import com.example.admin.content.repository.TimetableRepository;

@Service
public class NoteService {
    private final NoteRepository noteRepository;
    private final TextbookRepository textbookRepository;
    private final PYQRepository pyqRepository;
    private final TimetableRepository timetableRepository;

    public NoteService(NoteRepository noteRepository, TextbookRepository textbookRepository, PYQRepository pyqRepository, TimetableRepository timetableRepository) {
        this.noteRepository = noteRepository;
        this.textbookRepository = textbookRepository;
        this.pyqRepository = pyqRepository;
        this.timetableRepository = timetableRepository;
    }

    public List<Object> getAllNotes() {
        List<Object> content = new ArrayList<>();
        content.addAll(noteRepository.findAll());
        content.addAll(textbookRepository.findAll());
        content.addAll(pyqRepository.findAll());
        content.addAll(timetableRepository.findAll());
        return content;
    }
}

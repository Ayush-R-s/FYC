package com.example.admin.student.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.admin.content.model.Note;

@Repository
public interface NoteRepository extends JpaRepository<Note, Long> {
    List<Note> findByContentType(String contentType);
    List<Note> findTop5ByOrderByUploadedAtDesc();
}

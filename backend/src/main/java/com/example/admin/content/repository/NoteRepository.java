package com.example.admin.content.repository;

import com.example.admin.content.model.Note;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NoteRepository extends JpaRepository<Note, Long> {
    List<Note> findByCategory(String category);
    List<Note> findTop5ByOrderByUploadedAtDesc();
}

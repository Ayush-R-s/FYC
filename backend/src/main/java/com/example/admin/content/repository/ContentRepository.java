package com.example.admin.content.repository;

import com.example.admin.content.model.Note;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ContentRepository extends JpaRepository<Note, Long> {
    List<Note> findByContentType(String contentType);
}

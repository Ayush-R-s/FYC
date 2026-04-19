package com.example.admin.content.repository;

import com.example.admin.content.model.Textbook;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TextbookRepository extends JpaRepository<Textbook, Long> {
    List<Textbook> findByCategory(String category);
}

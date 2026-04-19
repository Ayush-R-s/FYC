package com.example.admin.content.repository;

import com.example.admin.content.model.PYQ;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PYQRepository extends JpaRepository<PYQ, Long> {
    List<PYQ> findByCategory(String category);
}

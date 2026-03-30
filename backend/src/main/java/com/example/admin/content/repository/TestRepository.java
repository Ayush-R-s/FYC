package com.example.admin.content.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import com.example.admin.content.model.Test;

public interface TestRepository extends JpaRepository<Test, Long> {
    List<Test> findTop5ByOrderByCreatedAtDesc();
    Optional<Test> findByTitleAndSubject(String title, String subject);

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM test_videos WHERE video_id = ?1", nativeQuery = true)
    void deleteVideoAssociations(Long videoId);
}

package com.example.admin.student.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import com.example.admin.student.entity.VideoProgress;

public interface VideoProgressRepository extends JpaRepository<VideoProgress, Long> {
    Optional<VideoProgress> findByStudentIdAndVideoId(Long studentId, Long videoId);
    java.util.List<VideoProgress> findByStudentId(Long studentId);
    java.util.List<VideoProgress> findByVideo_Id(Long videoId);
    
    @Modifying
    @Transactional
    @Query("DELETE FROM VideoProgress vp WHERE vp.video.id = ?1")
    void deleteByVideoId(Long videoId);

    long countByCompleted(boolean completed);
}

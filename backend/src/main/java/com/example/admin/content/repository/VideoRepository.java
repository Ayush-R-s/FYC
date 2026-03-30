package com.example.admin.content.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.admin.content.model.Video;

public interface VideoRepository extends JpaRepository<Video, Long> {
    List<Video> findTop5ByOrderByCreatedAtDesc();
}

package com.example.admin.analytics.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.admin.analytics.entity.VideoAnalytics;


public interface VideoAnalyticsRepository extends JpaRepository<VideoAnalytics, Long> {
}

package com.example.admin.analytics.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.admin.analytics.entity.EngagementData;

public interface EngagementDataRepository extends JpaRepository<EngagementData, Long> {
}

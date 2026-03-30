package com.example.admin.analytics.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.admin.analytics.entity.CompletionData;
import com.example.admin.analytics.entity.CompletionData.TimeFrame;

public interface CompletionDataRepository extends JpaRepository<CompletionData, Long> {
    List<CompletionData> findByTimeFrame(TimeFrame timeFrame);
    List<CompletionData> findByTimeFrameAndSubject(TimeFrame timeFrame, String subject);
}

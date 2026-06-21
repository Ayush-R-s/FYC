package com.example.admin.practice;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PracticeRequestRepository extends JpaRepository<PracticeRequest, Long> {
    List<PracticeRequest> findByStatusOrderByCreatedAtDesc(String status);
    List<PracticeRequest> findAllByOrderByCreatedAtDesc();
}

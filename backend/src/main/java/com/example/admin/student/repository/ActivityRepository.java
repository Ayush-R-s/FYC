package com.example.admin.student.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.admin.student.entity.Activity;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, Long> {
    List<Activity> findByStudentEmail(String studentEmail);
}

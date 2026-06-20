package com.example.admin.neet;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface neetQuestionRepository extends JpaRepository<neetQuestion, Long> {
}

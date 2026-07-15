package com.example.admin.jest;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface jestQuestionRepository extends JpaRepository<jestQuestion, Long> {
}

package com.example.admin.content.repository;

import com.example.admin.content.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {

    @Query(value = "SELECT * FROM question ORDER BY RAND() LIMIT :count", nativeQuery = true)
    List<Question> findRandomQuestions(@Param("count") int count);

    @Query(value = "SELECT * FROM question WHERE LOWER(subject) = LOWER(:subject) ORDER BY RAND() LIMIT :count", nativeQuery = true)
    List<Question> findRandomQuestionsBySubject(@Param("subject") String subject, @Param("count") int count);
}

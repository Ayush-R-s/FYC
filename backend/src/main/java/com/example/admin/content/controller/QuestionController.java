package com.example.admin.content.controller;

import com.example.admin.content.model.Question;
import com.example.admin.content.repository.QuestionRepository;
import com.example.admin.content.service.AIQuestionService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/admin/content/questions")
@CrossOrigin(origins = "*")
public class QuestionController {

    private final QuestionRepository repository;
    private final AIQuestionService aiService;

    public QuestionController(QuestionRepository repository, AIQuestionService aiService) {
        this.repository = repository;
        this.aiService = aiService;
    }

    @GetMapping
    public List<Question> getAllQuestions() {
        return repository.findAll();
    }

    @PostMapping
    public Question addQuestion(@RequestBody Question question) {
        question.setId(null); // Ensure it's a new question
        return repository.save(question);
    }

    @PutMapping("/{id}")
    public Question updateQuestion(@PathVariable Long id, @RequestBody Question question) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Question not found with id: " + id);
        }
        question.setId(id);
        return repository.save(question);
    }

    @DeleteMapping("/{id}")
    public void deleteQuestion(@PathVariable Long id) {
        repository.deleteById(id);
    }

    @PostMapping("/import")
    public List<Question> importQuestions(
            @RequestParam("file") MultipartFile file, 
            @RequestParam(value="subject", required=false) String subject,
            @RequestParam(value="chapter", required=false) String chapter,
            @RequestParam(value="topic", required=false) String topic) {
        List<Question> extracted = aiService.extractStructuredQuestions(file);
        if (extracted != null) {
            extracted.forEach(q -> {
                if (subject != null && !subject.isEmpty()) q.setSubject(subject);
                if (chapter != null && !chapter.isEmpty()) q.setChapter(chapter);
                if (topic != null && !topic.isEmpty()) q.setTopic(topic);
            });
        }
        return extracted;
    }

    @PostMapping("/bulk")
    public List<Question> bulkAddQuestions(@RequestBody List<Question> questions) {
        System.out.println("DEBUG: Bulk save request received for " + (questions != null ? questions.size() : 0) + " questions.");
        if (questions != null) {
            questions.forEach(q -> q.setId(null)); // Ensure they are clean
        }
        return repository.saveAll(questions);
    }
}

package com.example.admin.content.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.admin.content.dto.TestRequest;
import com.example.admin.content.model.Question;
import com.example.admin.content.model.Test;
import com.example.admin.content.model.TestCategory;
import com.example.admin.content.repository.TestRepository;
import com.example.admin.student.entity.Notification;
import com.example.admin.student.repository.NotificationRepository;

@Service
public class TestService {

    private final TestRepository repository;
    private final com.example.admin.content.repository.VideoRepository videoRepository;
    private final NotificationRepository notificationRepository;

    public TestService(TestRepository repository, com.example.admin.content.repository.VideoRepository videoRepository,
                       NotificationRepository notificationRepository) {
        this.repository = repository;
        this.videoRepository = videoRepository;
        this.notificationRepository = notificationRepository;
    }

    public Test createTest(TestRequest request) {
        Test test = new Test();
        test.setTitle(request.getTitle());
        test.setSubject(request.getSubject());
        test.setTopic(request.getTopic());
        test.setDuration(request.getDuration());
        test.setMarksPerQuestion(request.getMarksPerQuestion());
        
        if (request.getCategory() != null) {
            test.setCategory(TestCategory.valueOf(request.getCategory().toUpperCase()));
        }

        if (request.getVideoIds() != null && !request.getVideoIds().isEmpty()) {
            @SuppressWarnings("unchecked")
            Iterable<Long> videoIds = (Iterable<Long>) (Object) request.getVideoIds();
            List<com.example.admin.content.model.Video> videos = videoRepository.findAllById(videoIds);
            test.setVideos(videos);
        }

        List<Question> questions = request.getQuestions();
        if (questions != null) {
            int marks = request.getMarksPerQuestion() != null ? request.getMarksPerQuestion() : 0;
            questions.forEach(q -> {
                q.setId(null);
                q.setPoints(marks);
            });
            test.setTotalMarks(questions.size() * marks);
        } else {
            test.setTotalMarks(0);
        }
        
        test.setQuestions(questions);
        test.setCreatedAt(LocalDateTime.now());

        Test savedTest = repository.save(test);
        
        // Create notification
        String categoryText = test.getCategory() != null ? test.getCategory().toString() : "";
        Notification notification = new Notification(
            "New " + categoryText + " test: " + test.getTitle(),
            null // global notification
        );
        notificationRepository.save(notification);
        
        return savedTest;
    }

    public List<Test> getAll() {
        return repository.findAll();
    }


    public Test updateTest(Long id, TestRequest request) {
        if (id == null) throw new IllegalArgumentException("ID cannot be null");
        System.out.println("TestService: Updating test " + id);
        Test test = repository.findById(id).orElseThrow(() -> new RuntimeException("Test not found with ID: " + id));

        test.setTitle(request.getTitle());
        test.setSubject(request.getSubject());
        test.setTopic(request.getTopic());
        test.setDuration(request.getDuration());
        test.setMarksPerQuestion(request.getMarksPerQuestion());
        
        if (request.getCategory() != null) {
            test.setCategory(TestCategory.valueOf(request.getCategory().toUpperCase()));
        }

        if (request.getVideoIds() != null) {
            @SuppressWarnings("unchecked")
            Iterable<Long> videoIds = (Iterable<Long>) (Object) request.getVideoIds();
            List<com.example.admin.content.model.Video> videos = videoRepository.findAllById(videoIds);
            test.setVideos(videos);
        }

        System.out.println("TestService: Clearing existing questions...");
        test.getQuestions().clear();

        List<Question> newQuestions = request.getQuestions();
        if (newQuestions != null) {
            System.out.println("TestService: Adding " + newQuestions.size() + " new questions");
            int marks = request.getMarksPerQuestion() != null ? request.getMarksPerQuestion() : 0;
            for (Question q : newQuestions) {
                q.setId(null); // Ensure creation as new entries
                q.setPoints(marks);
                test.getQuestions().add(q);
            }
            test.setTotalMarks(newQuestions.size() * marks);
        } else {
            test.setTotalMarks(0);
        }

        System.out.println("TestService: Saving test...");
        try {
            Test saved = repository.save(test);
            System.out.println("TestService: Test saved successfully");
            return saved;
        } catch (Exception e) {
            System.err.println("TestService Error: " + e.getMessage());
            // e.printStackTrace(); // Avoid raw stack trace
            throw e;
        }
    }

    public void deleteTest(Long id) {
        repository.deleteById(id);
    }
}

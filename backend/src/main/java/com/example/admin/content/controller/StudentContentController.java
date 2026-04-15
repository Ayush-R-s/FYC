package com.example.admin.content.controller;


import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.admin.analytics.entity.TestHistory;
import com.example.admin.analytics.repository.PerformanceRepository;
import com.example.admin.analytics.repository.TestHistoryRepository;
import com.example.admin.content.model.Test;
import com.example.admin.content.model.Video;
import com.example.admin.content.repository.VideoRepository;
import com.example.admin.content.service.ContentService;
import com.example.admin.content.service.TestService;
import com.example.admin.feedback.entity.Feedback;
import com.example.admin.feedback.service.FeedbackService;
import com.example.admin.student.entity.Student;
import com.example.admin.student.entity.VideoProgress;
import com.example.admin.student.repository.DailyMockScoreRepository;
import com.example.admin.student.repository.StudentRepository;
import com.example.admin.student.repository.SubjectProgressRepository;
import com.example.admin.student.repository.VideoProgressRepository;
import com.example.admin.student.repository.WeeklyTestScoreRepository;


@RestController
@RequestMapping
public class StudentContentController {

    private final ContentService contentService;
    private final TestService testService;
    private final FeedbackService feedbackService;
    private final VideoProgressRepository videoProgressRepository;
    private final StudentRepository studentRepository;
    private final VideoRepository videoRepository;
    private final TestHistoryRepository testHistoryRepository;
    private final PerformanceRepository performanceRepository;
    private final DailyMockScoreRepository dailyMockScoreRepository;
    private final WeeklyTestScoreRepository weeklyTestScoreRepository;
    private final SubjectProgressRepository subjectProgressRepository;
    private final com.example.admin.content.repository.TestRepository testRepository;
    private final com.example.admin.gamification.service.GamificationService gamificationService;
    private final com.example.admin.student.service.StudentAnalyticsService analyticsService;
    private final ObjectMapper objectMapper;

    public StudentContentController(ContentService contentService,
            TestService testService,
            FeedbackService feedbackService,
            VideoProgressRepository videoProgressRepository,
            StudentRepository studentRepository,
            VideoRepository videoRepository,
            TestHistoryRepository testHistoryRepository,
            PerformanceRepository performanceRepository,
            DailyMockScoreRepository dailyMockScoreRepository,
            WeeklyTestScoreRepository weeklyTestScoreRepository,
            SubjectProgressRepository subjectProgressRepository,
            com.example.admin.content.repository.TestRepository testRepository,
            com.example.admin.gamification.service.GamificationService gamificationService,
            com.example.admin.student.service.StudentAnalyticsService analyticsService,
            ObjectMapper objectMapper) {
        this.contentService = contentService;
        this.testService = testService;
        this.feedbackService = feedbackService;
        this.videoProgressRepository = videoProgressRepository;
        this.studentRepository = studentRepository;
        this.videoRepository = videoRepository;
        this.testHistoryRepository = testHistoryRepository;
        this.performanceRepository = performanceRepository;
        this.dailyMockScoreRepository = dailyMockScoreRepository;
        this.weeklyTestScoreRepository = weeklyTestScoreRepository;
        this.subjectProgressRepository = subjectProgressRepository;
        this.testRepository = testRepository;
        this.gamificationService = gamificationService;
        this.analyticsService = analyticsService;
        this.objectMapper = objectMapper;
    }

    @GetMapping("/videos")
    public List<Video> getVideos() {
        return contentService.getAllVideos();
    }



    @GetMapping("/materials/{type}")
    public List<com.example.admin.content.model.Note> getMaterialsByType(@PathVariable String type) {
        return contentService.getNotesByType(type.toUpperCase());
    }

    @GetMapping("/tests")
    public List<Test> getTests() {
        return testService.getAll();
    }

    @GetMapping("/feedbacks/{studentId}")
    public List<Feedback> getFeedbacksByStudentId(@PathVariable String studentId) {
        return feedbackService.getFeedbackByStudentId(studentId);
    }

    @PostMapping("/feedbacks")
    public Feedback submitFeedback(@RequestBody Feedback feedback) {
        System.out.println("DEBUG: Feedback received: " +
                "StudentName=" + feedback.getStudentName() +
                ", StudentId=" + feedback.getStudentId() +
                ", FacultyName=" + feedback.getFacultyName() +
                ", Subject=" + feedback.getSubject() +
                ", Rating=" + feedback.getRating());

        feedback.setNew(true);
        feedback.setReviewed(false);

        // Ensure facultyName is not null/empty to avoid it being saved as "null" string
        if (feedback.getFacultyName() == null || feedback.getFacultyName().trim().isEmpty()) {
            System.out.println("DEBUG: FacultyName was null or empty, setting fallback");
            feedback.setFacultyName("Unknown Faculty");
        }

        if (feedback.getDate() == null) {
            feedback.setDate(java.time.LocalDate.now().toString());
        }
        if (feedback.getTime() == null) {
            feedback.setTime(java.time.LocalTime.now().toString().substring(0, 5));
        }

        // Fallback for student info if not provided by frontend
        if (feedback.getStudentName() == null || feedback.getStudentName().trim().isEmpty()) {
            feedback.setStudentName("Anonymous Student");
        }
        if (feedback.getStudentId() == null || feedback.getStudentId().trim().isEmpty()) {
            feedback.setStudentId("unknown");
        }

        return feedbackService.createFeedback(feedback);
    }

    @PostMapping("/test-history")
    @Transactional
    public TestHistory saveTestHistory(@RequestBody Map<String, Object> payload) {
        String email = (String) payload.get("email");
        String testTitle = (String) payload.get("testTitle");
        String subject = (String) payload.get("subject");

        // Robust number parsing
        Integer score = payload.get("score") instanceof Number n ? n.intValue() : 0;
        Integer totalPoints = payload.get("totalPoints") instanceof Number n ? n.intValue() : 0;

        Integer correctCount = payload.get("correctCount") instanceof Number n ? n.intValue() : 0;
        Integer wrongCount = payload.get("wrongCount") instanceof Number n ? n.intValue() : 0;

        String date = (String) payload.get("date");
        String status = (String) payload.get("status");
        String category = (String) payload.get("category"); // Get category from payload
        String responsesJson = (String) payload.get("responsesJson");

        Object timeTakenObj = payload.get("timeTaken");
        Integer timeTaken = timeTakenObj instanceof Number ? ((Number) timeTakenObj).intValue() : null;

        @SuppressWarnings("unchecked")
        Map<String, Object> rawAnalytics = (Map<String, Object>) payload.get("analytics");
        Map<String, Double> analytics = new HashMap<>();

        Integer accVal;
        Integer spdVal = 0;

        if (rawAnalytics != null) {
            // Convert to Map<String, Double> safely for persistence
            for (Map.Entry<String, Object> entry : rawAnalytics.entrySet()) {
                if (entry.getValue() instanceof Number n) {
                    analytics.put(entry.getKey(), n.doubleValue());
                }
            }

            if (rawAnalytics.get("accuracy") instanceof Number n)
                accVal = n.intValue();
            else if (totalPoints != null && totalPoints > 0)
                accVal = (int) Math.round((double) score / totalPoints * 100);
            else
                accVal = score; // Final fallback

            if (rawAnalytics.get("speed") instanceof Number n)
                spdVal = n.intValue();
        } else {
            if (totalPoints != null && totalPoints > 0)
                accVal = (int) Math.round((double) score / totalPoints * 100);
            else
                accVal = score; // Fallback accuracy if analytics null
        }

        java.util.List<Student> students = studentRepository.findAllByEmail(email);
        if (students.isEmpty()) {
            throw new RuntimeException("Student not found");
        }
        Student student = students.get(students.size() - 1);

        // Check for existing attempts to enforce one-time policy
        List<TestHistory> existingAttempts = testHistoryRepository.findByStudentIdAndTestAndSubject(student.getId(), testTitle, subject);
        if (!existingAttempts.isEmpty()) {
            System.err.println("StudentContentController: Duplicate attempt rejected for " + email + " on " + testTitle + " (" + subject + ")");
            throw new RuntimeException("Test '" + testTitle + "' for subject '" + subject + "' has already been completed.");
        }

        // Video Dependency Check: Ensure all required videos for this test are
        // completed
        Optional<Test> testOptional = testRepository.findByTitleAndSubject(testTitle, subject);
        testOptional.ifPresent(test -> {
            if (test.getVideos() != null && !test.getVideos().isEmpty()) {
                List<VideoProgress> progressList = videoProgressRepository.findByStudentId(student.getId());
                for (com.example.admin.content.model.Video requiredVideo : test.getVideos()) {
                    boolean completed = progressList.stream()
                            .filter(p -> p.getVideo().getId().equals(requiredVideo.getId()))
                            .anyMatch(VideoProgress::isCompleted);

                    if (!completed) {
                        throw new RuntimeException("Test locked: You must complete required video '"
                                + requiredVideo.getTitle() + "' first.");
                    }
                }
            }
        });

        // Calculate Topic & Subject Analytics
        if (responsesJson != null && !responsesJson.isEmpty()) {
            try {
                Map<String, Integer> responses = objectMapper.readValue(responsesJson, new TypeReference<Map<String, Integer>>() {});
                if (testOptional.isPresent()) {
                    Test testData = testOptional.get();
                    for (com.example.admin.content.model.Question q : testData.getQuestions()) {
                        String qTopic = q.getTopic();
                        String qSubject = q.getSubject();
                        
                        // Default to test-level metadata if question-level is missing
                        if (qTopic == null || qTopic.trim().isEmpty()) qTopic = "General";
                        if (qSubject == null || qSubject.trim().isEmpty()) qSubject = subject != null ? subject : "General";
                        
                        Integer studentAns = responses.get(q.getId().toString());
                        boolean isCorrect = studentAns != null && q.getCorrectAnswers().contains(studentAns);
                        
                        String topicCorrectKey = "topic_correct:" + qTopic;
                        String topicTotalKey = "topic_total:" + qTopic;
                        String subjectCorrectKey = "sub_correct:" + qSubject;
                        String subjectTotalKey = "sub_total:" + qSubject;
                        
                        analytics.put(topicCorrectKey, analytics.getOrDefault(topicCorrectKey, 0.0) + (isCorrect ? 1.0 : 0.0));
                        analytics.put(topicTotalKey, analytics.getOrDefault(topicTotalKey, 0.0) + 1.0);
                        analytics.put(subjectCorrectKey, analytics.getOrDefault(subjectCorrectKey, 0.0) + (isCorrect ? 1.0 : 0.0));
                        analytics.put(subjectTotalKey, analytics.getOrDefault(subjectTotalKey, 0.0) + 1.0);
                    }
                }
            } catch (Exception ex) {
                System.err.println("StudentContentController: Failed to calculate topic analytics: " + ex.getMessage());
            }
        }

        System.out.println(
                "StudentContentController: Saving TestHistory for " + email + " - Total Points: " + totalPoints);
        try {
            TestHistory history = new TestHistory();
            history.setStudent(student);
            history.setStudentId(student.getId());
            history.setTest(testTitle);
            history.setTestCategory(category); // Save category
            history.setSubject(subject);
            history.setScore(score);
            history.setTotalPoints(totalPoints);
            history.setCorrectCount(correctCount);
            history.setWrongCount(wrongCount);
            history.setResponsesJson(responsesJson);
            history.setAccuracy(accVal);
            history.setSpeed(spdVal);
            history.setDate(date);
            history.setStatus(status);
            history.setAnalytics(analytics);
            history.setTimeTaken(timeTaken);
            history.setTimestamp(java.time.LocalDateTime.now());

            TestHistory savedHistory = testHistoryRepository.saveAndFlush(history);
            System.out.println("StudentContentController: Main TestHistory saved and flushed with ID: " + savedHistory.getId());

            // Populate summary tables for "Stored in DB" performance tracking
            if (category == null || "MOCK".equalsIgnoreCase(category)) {
                com.example.admin.student.entity.DailyMockScore mock = new com.example.admin.student.entity.DailyMockScore();
                mock.setStudent(student);
                mock.setDate(date);
                mock.setScore(score);
                mock.setAccuracy(accVal);
                mock.setSpeed(spdVal);
                mock.setTimeTaken(timeTaken);
                dailyMockScoreRepository.save(mock);
                System.out.println("StudentContentController: DailyMockScore saved");
            } else if ("WEEKLY".equalsIgnoreCase(category)) {
                com.example.admin.student.entity.WeeklyTestScore weekly = new com.example.admin.student.entity.WeeklyTestScore();
                weekly.setStudent(student);
                weekly.setWeek(testTitle != null && testTitle.length() > 10 ? testTitle.substring(0, 10) : testTitle);
                weekly.setScore(score);
                weekly.setAccuracy(accVal);
                weekly.setSpeed(spdVal);
                weekly.setTarget(100);
                weekly.setTimeTaken(timeTaken);
                weeklyTestScoreRepository.save(weekly);
                System.out.println("StudentContentController: WeeklyTestScore saved");
            }

            // Update Subject Progress
            if (subject != null) {
                com.example.admin.student.entity.SubjectProgress sp = subjectProgressRepository
                        .findByStudentIdAndSubject(student.getId(), subject)
                        .orElse(new com.example.admin.student.entity.SubjectProgress());

                if (sp.getId() == null) {
                    sp.setStudent(student);
                    sp.setSubject(subject);
                }

                // Calculate new average progress for this subject
                List<TestHistory> subjectHistories = testHistoryRepository.findByStudent_Email(email).stream()
                        .filter(h -> subject.equalsIgnoreCase(h.getSubject()))
                        .collect(Collectors.toList());

                // Safe unboxing and average calculation
                double avg = subjectHistories.stream()
                        .filter(h -> h.getScore() != null)
                        .mapToInt(TestHistory::getScore)
                        .average()
                        .orElse(score.doubleValue());

                sp.setProgress((int) Math.round(avg));
                subjectProgressRepository.save(sp);
                System.out.println("StudentContentController: SubjectProgress updated to " + sp.getProgress());
            }

            // Keep performance repository for legacy or admin analytics if needed
            com.example.admin.analytics.entity.Performance performance = new com.example.admin.analytics.entity.Performance();
            performance.setStudent(student);
            performance.setSubject(subject);
            performance.setMarks(score.doubleValue());
            performance.setDate(date);
            performanceRepository.save(performance);
            System.out.println("StudentContentController: Performance record saved");

            // Update Gamification (Streaks & Badges) and Global Metrics in strict order
            try {
                // 1. Update Streak (Daily consistency)
                gamificationService.updateStreak(student, java.time.LocalDate.parse(date));

                // 2. Recalculate student average score (Aggregates normalized accuracy)
                analyticsService.updateStudentMetrics(student);
                
                // Flush session to ensure metrics are visible to rank calculations
                studentRepository.saveAndFlush(student);

                // 3. Update global and school rankings for all students (Saves all students internally)
                gamificationService.updateAllRanks();

                // 4. Finally award performance and rank badges using finalized data
                // Refetch to ensure we have the ranks set by updateAllRanks
                Student refreshedStudent = studentRepository.findById(student.getId()).orElse(student);
                gamificationService.evaluateAllBadges(refreshedStudent, savedHistory);

                System.out.println("StudentContentController: Orchestrated Gamification update complete");
            } catch (Exception ge) {
                System.err.println("StudentContentController: Gamification update failed: " + ge.getMessage());
            }

            return savedHistory;
        } catch (Exception e) {
            System.err.println("StudentContentController ERROR in saveTestHistory: " + e.getMessage());
            throw new RuntimeException("Error saving test history: " + e.getMessage(), e);
        }
    }

    @GetMapping("/test-history/{email}")
    public List<TestHistory> getTestHistory(@PathVariable String email) {
        return testHistoryRepository.findByStudent_Email(email);
    }

    @PostMapping("/video-progress")
    public void saveVideoProgress(@RequestBody java.util.Map<String, Object> payload) {
        String email = (String) payload.get("email");
        Long videoId = Long.valueOf(payload.get("videoId").toString());
        // Handle potentially different number types from JSON
        int progress = (int) Double.parseDouble(payload.get("progress").toString());
        boolean completed = Boolean.parseBoolean(payload.get("completed").toString());
        double currentTimeSeconds = payload.get("currentTimeSeconds") != null
                ? Double.parseDouble(payload.get("currentTimeSeconds").toString())
                : 0.0;

        java.util.List<Student> students = studentRepository.findAllByEmail(email);
        if (students.isEmpty()) {
            throw new RuntimeException("Student not found");
        }
        Student student = students.get(students.size() - 1);

        Video video = videoRepository.findById(videoId)
                .orElseThrow(() -> new RuntimeException("Video not found"));

        VideoProgress vp = videoProgressRepository
                .findByStudentIdAndVideoId(student.getId(), videoId)
                .orElse(new VideoProgress());

        if (vp.getId() == null) {
            vp.setStudent(student);
            vp.setVideo(video);
        }

        vp.setProgress(progress);
        vp.setCompleted(completed);
        vp.setCurrentTimeSeconds(currentTimeSeconds);
        videoProgressRepository.save(vp);
    }

    @GetMapping("/video-progress/{email}")
    public List<Map<String, Object>> getVideoProgress(@PathVariable String email) {
        java.util.List<Student> students = studentRepository.findAllByEmail(email);
        if (students.isEmpty()) {
            throw new RuntimeException("Student not found");
        }
        Student student = students.get(students.size() - 1);

        List<VideoProgress> progressList = videoProgressRepository.findByStudentId(student.getId());

        return progressList.stream().map(vp -> {
            Map<String, Object> map = new HashMap<>();
            map.put("videoId", vp.getVideo().getId());
            map.put("progress", vp.getProgress());
            map.put("completed", vp.isCompleted());
            map.put("currentTimeSeconds", vp.getCurrentTimeSeconds());
            return map;
        }).collect(Collectors.toList());
    }
}

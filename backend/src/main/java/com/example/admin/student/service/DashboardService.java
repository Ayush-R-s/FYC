package com.example.admin.student.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.admin.analytics.entity.TestHistory;
import com.example.admin.analytics.repository.TestHistoryRepository;
import com.example.admin.content.repository.VideoRepository;
import com.example.admin.student.dto.DashboardData;
import com.example.admin.student.dto.TutorialCompletion;
import com.example.admin.student.entity.Student;
import com.example.admin.student.entity.VideoProgress;
import com.example.admin.student.repository.StudentRepository;
import com.example.admin.student.repository.VideoProgressRepository;

@Service
public class DashboardService {

    private final VideoRepository videoRepository;
    private final VideoProgressRepository videoProgressRepository;
    private final StudentRepository studentRepository;
    private final TestHistoryRepository testHistoryRepository;

    public DashboardService(VideoRepository videoRepository,
            VideoProgressRepository videoProgressRepository,
            StudentRepository studentRepository,
            TestHistoryRepository testHistoryRepository) {
        this.videoRepository = videoRepository;
        this.videoProgressRepository = videoProgressRepository;
        this.studentRepository = studentRepository;
        this.testHistoryRepository = testHistoryRepository;
    }

    public DashboardData getDashboardData(String email) {
        DashboardData data = new DashboardData();

        if (email == null || email.isEmpty()) {
            data.setDailyMockScores(new java.util.ArrayList<>());
            data.setWeeklyTestScores(new java.util.ArrayList<>());
            data.setSubjectProgress(new java.util.ArrayList<>());
            data.setTutorialCompletion(new TutorialCompletion());
            return data;
        }

        List<TestHistory> histories = testHistoryRepository.findByStudent_Email(email);

        // Derive Daily Mock Scores - Fallback to MOCK if category is null
        List<com.example.admin.student.entity.DailyMockScore> mockScores = histories.stream()
                .filter(h -> h.getTestCategory() == null || "MOCK".equalsIgnoreCase(h.getTestCategory()))
                .map(h -> {
                    com.example.admin.student.entity.DailyMockScore ds = new com.example.admin.student.entity.DailyMockScore();
                    ds.setDate(h.getDate());
                    ds.setScore(h.getScore());
                    return ds;
                }).collect(java.util.stream.Collectors.toList());
        data.setDailyMockScores(mockScores);

        // Derive Weekly Test Scores
        List<com.example.admin.student.entity.WeeklyTestScore> weeklyScores = histories.stream()
                .filter(h -> "WEEKLY".equalsIgnoreCase(h.getTestCategory()))
                .map(h -> {
                    com.example.admin.student.entity.WeeklyTestScore ws = new com.example.admin.student.entity.WeeklyTestScore();
                    ws.setWeek(h.getTest() != null && h.getTest().length() > 10 ? h.getTest().substring(0, 10)
                            : h.getTest());
                    ws.setScore(h.getScore());
                    ws.setTarget(100); // Default target
                    return ws;
                }).collect(java.util.stream.Collectors.toList());
        data.setWeeklyTestScores(weeklyScores);

        // Derive Subject Progress
        java.util.Map<String, java.util.List<TestHistory>> bySubject = histories.stream()
                .filter(h -> h.getSubject() != null)
                .collect(java.util.stream.Collectors.groupingBy(TestHistory::getSubject));

        List<com.example.admin.student.entity.SubjectProgress> subjectProgress = bySubject.entrySet().stream()
                .map(entry -> {
                    com.example.admin.student.entity.SubjectProgress sp = new com.example.admin.student.entity.SubjectProgress();
                    sp.setSubject(entry.getKey());
                    double avg = entry.getValue().stream().mapToInt(TestHistory::getScore).average().orElse(0.0);
                    sp.setProgress((int) Math.round(avg));
                    return sp;
                }).collect(java.util.stream.Collectors.toList());
        data.setSubjectProgress(subjectProgress);

        // Calculate Tutorial Completion (Video Tutorials)
        long totalVideos = videoRepository.count();
        long completedVideos = 0;

        java.util.List<Student> students = studentRepository.findAllByEmail(email);
        Optional<Student> studentOpt = students.isEmpty() ? Optional.empty() : Optional.of(students.get(students.size() - 1));
        if (studentOpt.isPresent()) {
            completedVideos = videoProgressRepository.findByStudentId(studentOpt.get().getId())
                    .stream().filter(VideoProgress::isCompleted).count();
        }

        TutorialCompletion tc = new TutorialCompletion();
        tc.setCompleted((int) completedVideos);
        tc.setTotal((int) totalVideos);
        tc.setPercentage(totalVideos > 0 ? (int) ((completedVideos * 100) / totalVideos) : 0);
        data.setTutorialCompletion(tc);

        // Calculate Overall Accuracy and Speed
        if (!histories.isEmpty()) {
            double totalAccuracy = 0;
            double totalSpeed = 0;
            int accuracyCount = 0;
            int speedCount = 0;

            for (TestHistory history : histories) {
                Integer acc = history.getAccuracy();
                Integer spd = history.getSpeed();

                if (acc != null) {
                    totalAccuracy += acc;
                    accuracyCount++;
                } else {
                    // Fallback to score if accuracy column is empty
                    totalAccuracy += history.getScore();
                    accuracyCount++;
                }

                if (spd != null) {
                    totalSpeed += spd;
                    speedCount++;
                }
            }

            if (accuracyCount > 0) {
                data.setAccuracy(Math.round(totalAccuracy / accuracyCount));
            }
            if (speedCount > 0) {
                data.setSpeed(Math.round(totalSpeed / speedCount));
            }
        }

        // Calculate Overall Progress (Success Rate)
        // Holistic calculation: 40% tutorials + 60% test accuracy
        int tutorialWeight = 40;
        int accuracyWeight = 60;

        double weightedProgress = (data.getTutorialCompletion().getPercentage() * tutorialWeight / 100.0) +
                (data.getAccuracy() * accuracyWeight / 100.0);

        data.setOverallProgress(Math.round(weightedProgress));

        return data;
    }
}

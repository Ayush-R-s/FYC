package com.example.admin.student.service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.admin.analytics.entity.SubjectStat;
import com.example.admin.analytics.entity.TestHistory;
import com.example.admin.analytics.repository.TestHistoryRepository;
import com.example.admin.content.repository.VideoRepository;
import com.example.admin.student.dto.StudentDetailedPerformanceDTO;
import com.example.admin.student.entity.Student;
import com.example.admin.student.repository.StudentRepository;
import com.example.admin.student.repository.VideoProgressRepository;

@Service
public class StudentAnalyticsService {

    @Autowired
    private TestHistoryRepository testHistoryRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private VideoRepository videoRepository;

    @Autowired
    private VideoProgressRepository videoProgressRepository;

    public StudentDetailedPerformanceDTO getStudentPerformance(Long id) {
        Student student = studentRepository.findById(id).orElse(null);
        if (student == null)
            return null;

        List<TestHistory> history = testHistoryRepository.findByStudentId(id);
        List<SubjectStat> subjectStats = aggregateHistoryToStats(history);

        // Calculate overall student metrics (Note: this is read-only for view)
        populateStudentMetrics(student, history);
        populateTutorialProgress(student);
        populateActivityLog(student);

        return new StudentDetailedPerformanceDTO(student, subjectStats, history);
    }

    /**
     * Public method to force recalculation and persistence of student metrics
     * like avgScore, testsAttempted and passRate.
     */
    public void updateStudentMetrics(Long id) {
        studentRepository.findById(id).ifPresent(student -> {
            List<TestHistory> history = testHistoryRepository.findByStudentId(id);
            System.out.println("StudentAnalyticsService: Found " + history.size() + " total tests for student " + id);
            populateStudentMetrics(student, history);
            System.out.println("StudentAnalyticsService: Updated avgScore to " + student.getAvgScore() + " based on " + student.getTestsAttempted() + " eligible tests");
            studentRepository.save(student);
        });
    }

    /**
     * Direct update for existing student entity to avoid extra DB roundtrip and potential stale data
     */
    public void updateStudentMetrics(Student student) {
        List<TestHistory> history = testHistoryRepository.findByStudentId(student.getId());
        populateStudentMetrics(student, history);
        studentRepository.save(student);
    }

    public StudentDetailedPerformanceDTO getStudentPerformanceByStudentId(String studentId) {
        Student student = studentRepository.findByStudentId(studentId).orElse(null);
        if (student == null)
            return null;

        List<TestHistory> history = testHistoryRepository.findByStudentId(student.getId());
        List<SubjectStat> subjectStats = aggregateHistoryToStats(history);

        // Calculate overall student metrics
        populateStudentMetrics(student, history);
        populateTutorialProgress(student);
        populateActivityLog(student);

        return new StudentDetailedPerformanceDTO(student, subjectStats, history);
    }

    private void populateTutorialProgress(Student student) {
        List<com.example.admin.student.entity.VideoProgress> progress = videoProgressRepository
                .findByStudentId(student.getId());
        List<com.example.admin.content.model.Video> allVideos = videoRepository.findAll();

        Map<String, Long> totalBySubject = allVideos.stream()
                .filter(v -> v.getSubject() != null)
                .collect(Collectors.groupingBy(com.example.admin.content.model.Video::getSubject,
                        Collectors.counting()));

        Map<String, Long> completedBySubject = progress.stream()
                .filter(com.example.admin.student.entity.VideoProgress::isCompleted)
                .filter(vp -> vp.getVideo() != null && vp.getVideo().getSubject() != null)
                .collect(Collectors.groupingBy(vp -> vp.getVideo().getSubject(), Collectors.counting()));

        Map<String, Map<String, Integer>> tutorialProgress = new java.util.HashMap<>();
        for (Map.Entry<String, Long> entry : totalBySubject.entrySet()) {
            String subject = entry.getKey();
            Map<String, Integer> stats = new java.util.HashMap<>();
            stats.put("total", entry.getValue().intValue());
            stats.put("completed", completedBySubject.getOrDefault(subject, 0L).intValue());
            tutorialProgress.put(subject, stats);
        }
        student.setTutorialProgress(tutorialProgress);
    }

    private void populateActivityLog(Student student) {
        List<Map<String, String>> activityLog = new ArrayList<>();
        if (student.getLastActive() != null) {
            activityLog.add(Map.of("action", "Online session", "time", student.getLastActive()));
        }
        if (student.getVideosWatched() != null && student.getVideosWatched() > 0) {
            activityLog.add(Map.of("action", "Watched " + student.getVideosWatched() + " tutorial videos", "time",
                    "Past week"));
        }
        if (student.getAssignmentsSubmitted() != null && student.getAssignmentsSubmitted() > 0) {
            activityLog.add(Map.of("action", "Submitted " + student.getAssignmentsSubmitted() + " assignments", "time",
                    "Current month"));
        }
        student.setActivityLog(activityLog);
    }

    private int getNormalizedAccuracy(TestHistory th) {
        if (th.getAccuracy() != null) return th.getAccuracy().intValue();
        if (th.getScore() != null && th.getTotalPoints() != null && th.getTotalPoints() > 0) {
            return (int) Math.round((double) th.getScore().intValue() / th.getTotalPoints().intValue() * 100);
        }
        return th.getScore() != null ? th.getScore().intValue() : 0;
    }

    private void populateStudentMetrics(Student student, List<TestHistory> history) {
        if (history == null || history.isEmpty()) {
            student.setTestsAttempted(0);
            student.setAvgScore(0.0);
            student.setPassRate(0.0);
            return;
        }

        // Filter and calculate based on MOCK and WEEKLY tests only
        List<TestHistory> filteredHistory = history.stream()
                .filter(th -> th.getTestCategory() == null || 
                              "MOCK".equalsIgnoreCase(th.getTestCategory()) || 
                              "WEEKLY".equalsIgnoreCase(th.getTestCategory()))
                .collect(Collectors.toList());

        if (filteredHistory.isEmpty()) {
            student.setTestsAttempted(0);
            student.setAvgScore(0.0);
            student.setPassRate(0.0);
            return;
        }

        int totalTests = filteredHistory.size();
        int passedTests = 0;
        double totalAccuracy = 0;

        for (TestHistory th : filteredHistory) {
            int accuracy = getNormalizedAccuracy(th);
            totalAccuracy += accuracy;

            if ("Passed".equalsIgnoreCase(th.getStatus())) {
                passedTests++;
            } else if (!"Failed".equalsIgnoreCase(th.getStatus())) {
                if (accuracy >= 40) passedTests++;
            }
        }

        student.setTestsAttempted(totalTests);
        student.setAvgScore(totalAccuracy / totalTests);
        student.setPassRate((double) passedTests / totalTests * 100);
    }

    public List<Student> getGlobalStudentsAnalytics() {
        List<Student> students = studentRepository.findAll();
        List<TestHistory> allHistory = testHistoryRepository.findAll();

        // Calculate Video Completion Data
        long totalVideos = videoRepository.count();
        List<com.example.admin.student.entity.VideoProgress> allProgress = videoProgressRepository.findAll();

        Map<Long, Long> completedByStudent = allProgress.stream()
                .filter(com.example.admin.student.entity.VideoProgress::isCompleted)
                .collect(Collectors.groupingBy(vp -> vp.getStudent().getId(), Collectors.counting()));

        Map<Long, List<TestHistory>> historyByStudent = allHistory.stream()
                .filter(h -> h.getStudent() != null)
                .collect(Collectors.groupingBy(h -> h.getStudent().getId()));

        for (Student s : students) {
            List<TestHistory> history = historyByStudent.getOrDefault(s.getId(), new ArrayList<>());
            populateStudentMetrics(s, history);

            // Set Completion Rate
            long completedCount = completedByStudent.getOrDefault(s.getId(), 0L);
            double rate = (totalVideos > 0) ? ((double) completedCount / totalVideos) * 100 : 0.0;
            s.setCompletionRate(Math.round(rate * 10.0) / 10.0);
        }

        return students;
    }

    public List<SubjectStat> getGlobalPerformanceStats() {
        List<TestHistory> history = testHistoryRepository.findAll();
        return aggregateHistoryToStats(history);
    }

    public Map<String, Object> getGlobalOverviewStats() {
        long totalStudents = studentRepository != null ? studentRepository.count() : 0;
        long totalVideos = videoRepository != null ? videoRepository.count() : 0;
        long totalCompletions = videoProgressRepository != null ? videoProgressRepository.countByCompleted(true) : 0;

        List<TestHistory> result = testHistoryRepository != null ? testHistoryRepository.findAll() : null;
        List<TestHistory> history = result != null ? result : new java.util.ArrayList<>();

        double avgScore = 0.0;
        double passRate = 0.0;
        int totalTests = history != null ? history.size() : 0;

        if (totalTests > 0) {
            double totalAccuracySum = 0;
            int passed = 0;
            for (TestHistory th : history) {
                if (th == null)
                    continue;
                int accuracy = getNormalizedAccuracy(th);
                totalAccuracySum += accuracy;
                String status = th.getStatus();
                if ("Passed".equalsIgnoreCase(status) || accuracy >= 40) {
                    passed++;
                }
            }
            avgScore = totalAccuracySum / totalTests;
            passRate = (double) passed / totalTests * 100;
        }

        return Map.of(
                "totalStudents", totalStudents,
                "totalVideos", totalVideos,
                "totalCompletions", totalCompletions,
                "activeMonthly", totalStudents, // Placeholder until activity tracking is more robust
                "avgCompletionRate", 0.0, // Placeholder
                "avgTestScore", Math.round(avgScore * 10.0) / 10.0,
                "avgPassRate", Math.round(passRate * 10.0) / 10.0);
    }

    public List<Map<String, Object>> getDetailedVideoAnalytics() {
        List<com.example.admin.content.model.Video> videos = videoRepository.findAll();
        long totalStudents = studentRepository.count();
        List<Map<String, Object>> result = new ArrayList<>();

        for (com.example.admin.content.model.Video video : videos) {
            List<com.example.admin.student.entity.VideoProgress> progressList = videoProgressRepository
                    .findByVideo_Id(video.getId());

            long completed = progressList.stream().filter(com.example.admin.student.entity.VideoProgress::isCompleted)
                    .count();
            double avgWatchTime = progressList.stream()
                    .mapToInt(com.example.admin.student.entity.VideoProgress::getProgress)
                    .average().orElse(0.0);

            Map<String, Object> videoStat = new java.util.HashMap<>();
            videoStat.put("id", video.getId());
            videoStat.put("title", video.getTitle());
            videoStat.put("subject", video.getSubject());
            videoStat.put("duration", video.getDuration());
            videoStat.put("completed", completed);
            videoStat.put("totalStudents", totalStudents);
            videoStat.put("pending", totalStudents - completed);
            videoStat.put("avgWatchTime", Math.round(avgWatchTime * 10.0) / 10.0);

            result.add(videoStat);
        }
        return result;
    }

    public List<Map<String, Object>> getGlobalEngagementStats() {
        List<TestHistory> history = testHistoryRepository.findAll();
        Map<String, List<TestHistory>> groupedByDay = history.stream()
                .filter(h -> h.getDate() != null)
                .collect(Collectors.groupingBy(TestHistory::getDate));

        return groupedByDay.entrySet().stream()
                .map(entry -> {
                    Map<String, Object> dayStat = new java.util.HashMap<>();
                    dayStat.put("day", entry.getKey());
                    dayStat.put("views", entry.getValue().size()); // Proxy for views (test attempts)
                    dayStat.put("users", entry.getValue().stream().map(TestHistory::getStudentId).distinct().count());
                    return dayStat;
                })
                .sorted(Comparator.comparing(m -> (String) m.get("day")))
                .collect(Collectors.toList());
    }

    public List<Map<String, Object>> getGlobalCompletionStats(String timeFrame) {
        List<com.example.admin.content.model.Video> allVideos = videoRepository.findAll();
        long totalStudents = studentRepository.count();

        Map<String, List<com.example.admin.content.model.Video>> videosBySubject = allVideos.stream()
                .filter(v -> v.getSubject() != null)
                .collect(Collectors.groupingBy(com.example.admin.content.model.Video::getSubject));

        List<Map<String, Object>> result = new ArrayList<>();
        for (Map.Entry<String, List<com.example.admin.content.model.Video>> entry : videosBySubject.entrySet()) {
            String subject = entry.getKey();
            List<com.example.admin.content.model.Video> subjectVideos = entry.getValue();

            long totalPossibleCompletions = subjectVideos.size() * totalStudents;
            if (totalPossibleCompletions == 0)
                continue;

            long actualCompletions = 0;
            for (com.example.admin.content.model.Video v : subjectVideos) {
                actualCompletions += videoProgressRepository.findByVideo_Id(v.getId()).stream()
                        .filter(com.example.admin.student.entity.VideoProgress::isCompleted)
                        .count();
            }

            double completionRate = (double) actualCompletions / totalPossibleCompletions * 100;

            Map<String, Object> stat = new java.util.HashMap<>();
            stat.put("subject", subject);
            stat.put("completion", Math.round(completionRate * 10.0) / 10.0);
            stat.put("students", totalStudents);
            result.add(stat);
        }
        return result;
    }

    public List<Map<String, String>> getStudentsForVideo(Long videoId) {
        List<com.example.admin.student.entity.VideoProgress> progressList = videoProgressRepository
                .findByVideo_Id(videoId);
        return progressList.stream()
                .filter(com.example.admin.student.entity.VideoProgress::isCompleted)
                .map(p -> {
                    Map<String, String> studentData = new java.util.HashMap<>();
                    studentData.put("name", p.getStudent().getName());
                    studentData.put("email", p.getStudent().getEmail());
                    return studentData;
                })
                .collect(Collectors.toList());
    }

    private List<SubjectStat> aggregateHistoryToStats(List<TestHistory> history) {
        Map<String, List<TestHistory>> grouped = history.stream()
                .filter(h -> h.getSubject() != null)
                .collect(Collectors.groupingBy(TestHistory::getSubject));

        List<SubjectStat> stats = new ArrayList<>();
        for (Map.Entry<String, List<TestHistory>> entry : grouped.entrySet()) {
            String subjectName = entry.getKey();
            List<TestHistory> subjectHistory = entry.getValue();

            SubjectStat stat = new SubjectStat();
            stat.setName(subjectName);

            int passed = 0;
            int failed = 0;
            double sumScore = 0;
            double highScore = 0;
            double lowScore = Double.MAX_VALUE;

            for (TestHistory th : subjectHistory) {
                int accuracy = getNormalizedAccuracy(th);

                sumScore += accuracy;
                if (accuracy > highScore)
                    highScore = accuracy;
                if (accuracy < lowScore)
                    lowScore = accuracy;

                String status = th.getStatus();
                if ("Passed".equalsIgnoreCase(status)) {
                    passed++;
                } else if ("Failed".equalsIgnoreCase(status)) {
                    failed++;
                } else {
                    if (accuracy >= 40)
                        passed++;
                    else
                        failed++;
                }
            }

            stat.setPassed(passed);
            stat.setFailed(failed);
            stat.setScore(
                    subjectHistory.isEmpty() ? 0.0 : Math.round((sumScore / subjectHistory.size()) * 10.0) / 10.0);
            stat.setPassRate(subjectHistory.isEmpty() ? 0.0
                    : Math.round(((double) passed / subjectHistory.size() * 100) * 10.0) / 10.0);
            stat.setHighScore(highScore);
            stat.setLowScore(lowScore == Double.MAX_VALUE ? 0.0 : lowScore);

            // Note: videosWatched and videoCompletion might need extra logic or stay as-is
            // if handled elsewhere
            stat.setVideosWatched(0);
            stat.setVideoCompletion(0.0);

            stats.add(stat);
        }
        return stats;
    }
}

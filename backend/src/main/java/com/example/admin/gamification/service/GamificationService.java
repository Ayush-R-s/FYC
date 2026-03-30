package com.example.admin.gamification.service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.admin.analytics.entity.TestHistory;
import com.example.admin.analytics.repository.TestHistoryRepository;
import com.example.admin.gamification.model.Badge;
import com.example.admin.gamification.model.StreakData;
import com.example.admin.student.entity.Student;
import com.example.admin.student.repository.StudentRepository;

@Service
public class GamificationService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private TestHistoryRepository testHistoryRepository;

    /**
     * Update student streak based on a new test completion.
     * Note: This only updates the streak numbers. Badge evaluation should be called separately.
     */
    public void updateStreak(Student student, LocalDate testDate) {
        String lastDateStr = student.getLastTestDate();
        int currentStreak = student.getCurrentStreak() != null ? student.getCurrentStreak().intValue() : 0;

        if (lastDateStr == null) {
            currentStreak = 1;
        } else {
            LocalDate lastDate = LocalDate.parse(lastDateStr);
            long daysBetween = ChronoUnit.DAYS.between(lastDate, testDate);

            if (daysBetween == 1) {
                currentStreak++;
            } else if (daysBetween > 1) {
                currentStreak = 1;
            }
        }

        student.setCurrentStreak(currentStreak);
        student.setLastTestDate(testDate.toString());

        if (currentStreak > (student.getBestStreak() != null ? student.getBestStreak().intValue() : 0)) {
            student.setBestStreak(currentStreak);
        }
        // Save removed here to allow controller to manage transaction/state
    }

    /**
     * Centralized logic to evaluate and award all possible badges.
     * Uses immutable list updates to ensure JPA detects changes.
     * @param student The student to evaluate
     * @param history Optional latest test history for accuracy checks
     * @return true if badges were awarded
     */
    public boolean evaluateAllBadges(Student student, TestHistory history) {
        List<String> currentBadges = student.getEarnedBadges();
        List<String> updatedBadges = new ArrayList<>(currentBadges);
        boolean changed = false;

        System.out.println("--- Gamification Diagnostic Start for " + student.getEmail() + " ---");

        // 1. Streak Badges
        int streak = student.getCurrentStreak() != null ? student.getCurrentStreak().intValue() : 0;
        System.out.println("CHECK: Streak=" + streak + " (Needed: 7 for STREAK_7, 30 for STREAK_30)");
        
        if (streak >= 7 && !updatedBadges.contains("STREAK_7")) {
            System.out.println("GamificationService: Awarding STREAK_7 to " + student.getEmail());
            updatedBadges.add("STREAK_7");
            changed = true;
        }
        if (streak >= 30 && !updatedBadges.contains("STREAK_30")) {
            System.out.println("GamificationService: Awarding STREAK_30 to " + student.getEmail());
            updatedBadges.add("STREAK_30");
            changed = true;
        }

        // 2. Rank Badges (Uses finalized global/school ranks)
        Integer gRank = student.getGlobalRank();
        Integer sRank = student.getSchoolRank();
        System.out.println("CHECK: globalRank=" + gRank + ", schoolRank=" + sRank + " (Needed: <= 10 for TOP_10)");

        boolean meetsRank = (gRank != null && gRank.intValue() <= 10) || (sRank != null && sRank.intValue() <= 10);
        if (meetsRank && !updatedBadges.contains("TOP_10")) {
            String log = (gRank != null && gRank.intValue() <= 10) ? "Global Rank #" + gRank : "School Rank #" + sRank;
            System.out.println("GamificationService: Awarding TOP_10 to " + student.getEmail() + " based on " + log);
            updatedBadges.add("TOP_10");
            changed = true;
        }

        // 3. Performance Badges (Current Test)
        if (history != null) {
            Integer acc = history.getAccuracy();
            System.out.println("CHECK: Current Test Accuracy=" + (acc != null ? acc + "%" : "null") + " (Needed: 90% for ACCURACY_90)");
            if (acc != null && acc.intValue() >= 90) {
                if (!updatedBadges.contains("ACCURACY_90")) {
                    System.out.println("GamificationService: Awarding ACCURACY_90 to " + student.getEmail() + " (Accuracy: " + acc.intValue() + "%)");
                    updatedBadges.add("ACCURACY_90");
                    changed = true;
                }
            }
        } else {
            System.out.println("CHECK: No specific test history provided for accuracy check.");
        }

        // 4. Consistency Badges (Overall Avg)
        double avg = student.getAvgScore() != null ? student.getAvgScore().doubleValue() : 0.0;
        int attempted = student.getTestsAttempted() != null ? student.getTestsAttempted().intValue() : 0;
        System.out.println("CHECK: AvgScore=" + avg + "%, TestsAttempted=" + attempted + " (Needed: 80%+ and 5+ tests for CONSISTENT)");

        if (avg >= 80.0 && attempted >= 5 && !updatedBadges.contains("CONSISTENT")) {
            System.out.println("GamificationService: Awarding CONSISTENT to " + student.getEmail() + " (Avg Accuracy: " + avg + "%)");
            updatedBadges.add("CONSISTENT");
            changed = true;
        }

        System.out.println("--- Gamification Diagnostic End for " + student.getEmail() + " (Changed: " + changed + ") ---");

        if (changed) {
            student.setEarnedBadges(updatedBadges);
            studentRepository.save(student);
            System.out.println("GamificationService: PERSISTED " + updatedBadges.size() + " badges for " + student.getEmail());
        }
        return changed;
    }

    // Keep for compatibility but redirect to centralized engine
    public boolean evaluateAllBadges(Student student) {
        return evaluateAllBadges(student, null);
    }

    public void checkAndAwardPerformanceBadges(Student student, TestHistory testHistory) {
        // Redirect to consolidated engine
        evaluateAllBadges(student, testHistory);
    }

    public StreakData getStreakData(Student student) {
        List<TestHistory> history = testHistoryRepository.findByStudentId(student.getId());
        LocalDate today = LocalDate.now();
        List<Boolean> weekDays = new ArrayList<>();

        for (int i = 0; i < 7; i++) {
            LocalDate date = today.minusDays(6 - i);
            String dateStr = date.toString();
            boolean done = history.stream().anyMatch(h -> h.getDate().equals(dateStr));
            weekDays.add(done);
        }

        return new StreakData(
                student.getCurrentStreak(),
                student.getBestStreak(),
                history.size(),
                weekDays);
    }

    public List<Badge> getBadges(Student student) {
        List<String> earnedIds = student.getEarnedBadges();

        // This would typically come from a DB or config
        List<Badge> allBadges = new ArrayList<>();
        allBadges.add(new Badge(1L, "🎯", "90% Accuracy", "Scored 90%+ in a test", earnedIds.contains("ACCURACY_90"),
                "Performance"));
        allBadges.add(new Badge(2L, "🔥", "7-Day Warrior", "7 consecutive test days", earnedIds.contains("STREAK_7"),
                "Streak"));
        allBadges.add(new Badge(3L, "🏆", "Top 10 Rank", "Reach top 10 on the leaderboard",
                earnedIds.contains("TOP_10"), "Rank"));
        allBadges.add(new Badge(4L, "📅", "30-Day Legend", "30 consecutive test days", earnedIds.contains("STREAK_30"),
                "Streak"));
        allBadges.add(new Badge(5L, "📊", "Consistent Performer", "80%+ average over 30 days",
                earnedIds.contains("CONSISTENT"), "Performance"));

        return allBadges;
    }

    @Autowired
    private com.example.admin.student.service.StudentAnalyticsService analyticsService;

    public List<Student> getLeaderboard(String schoolName) {
        List<Student> students;
        if (schoolName != null && !schoolName.isEmpty()) {
            students = studentRepository.findAll().stream()
                    .filter(s -> schoolName.equals(s.getSchoolName()))
                    .collect(Collectors.toList());
        } else {
            students = studentRepository.findAll();
        }

        // Ensure metrics are populated for the leaderboard view
        // In a real high-traffic app, we'd rely on the background update,
        // but for now we ensure data is present.
        // Proactively refresh metrics for leaderboard students and save if badges change
/*
        for (Student s : students) {
            analyticsService.updateStudentMetrics(s);
            if (evaluateAllBadges(s)) {
                studentRepository.save(s);
            }
        }
*/

        return students.stream()
                .sorted((s1, s2) -> {
                    Double score1 = s1.getAvgScore();
                    Double score2 = s2.getAvgScore();
                    double val1 = (score1 != null) ? score1 : 0.0;
                    double val2 = (score2 != null) ? score2 : 0.0;
                    return Double.compare(val2, val1);
                })
                .limit(50)
                .collect(Collectors.toList());
    }

    /**
     * Recalculates and persists global and school-specific ranks for all students.
     */
    public void updateAllRanks() {
        List<Student> allStudents = studentRepository.findAll();
        
        List<Student> globalSorted = allStudents.stream()
                .sorted((s1, s2) -> {
                    Double score1 = s1.getAvgScore();
                    Double score2 = s2.getAvgScore();
                    double val1 = (score1 != null) ? score1 : 0.0;
                    double val2 = (score2 != null) ? score2 : 0.0;
                    return Double.compare(val2, val1);
                })
                .collect(Collectors.toList());
        
            for (int i = 0; i < globalSorted.size(); i++) {
                Student s = globalSorted.get(i);
                s.setGlobalRank(i + 1);
                // Badge evaluation is handled in a single final pass or by the controller
            }

        // 2. Calculate School Ranks
        Map<String, List<Student>> bySchool = allStudents.stream()
                .filter(s -> s.getSchoolName() != null && !s.getSchoolName().isEmpty())
                .collect(Collectors.groupingBy(Student::getSchoolName));

        for (List<Student> schoolStudents : bySchool.values()) {
            List<Student> schoolSorted = schoolStudents.stream()
                    .sorted((s1, s2) -> {
                        Double score1 = s1.getAvgScore();
                        Double score2 = s2.getAvgScore();
                        double val1 = (score1 != null) ? score1 : 0.0;
                        double val2 = (score2 != null) ? score2 : 0.0;
                        return Double.compare(val2, val1);
                    })
                    .collect(Collectors.toList());
            
            for (int i = 0; i < schoolSorted.size(); i++) {
                Student s = schoolSorted.get(i);
                s.setSchoolRank(i + 1);
            }
        }

        // 3. Persist all changes
        studentRepository.saveAll(allStudents);
        System.out.println("GamificationService: PERSISTED ranks for " + allStudents.size() + " students");
        
        // Final sanity check log for one student if list not empty
        if (!allStudents.isEmpty()) {
            Student sample = allStudents.get(0);
            System.out.println("GamificationService: Sample Rank Check - " + sample.getEmail() + 
                " | Global: " + sample.getGlobalRank() + " | School: " + sample.getSchoolRank());
        }
    }
}

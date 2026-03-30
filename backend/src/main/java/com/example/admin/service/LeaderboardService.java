package com.example.admin.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.admin.analytics.entity.TestHistory;
import com.example.admin.analytics.repository.TestHistoryRepository;
import com.example.admin.model.LeaderboardEntryDTO;

@Service
public class LeaderboardService {

    private final TestHistoryRepository testHistoryRepository;

    public LeaderboardService(TestHistoryRepository testHistoryRepository) {
        this.testHistoryRepository = testHistoryRepository;
    }

    public List<LeaderboardEntryDTO> getTestLeaderboard(String testTitle, String subject, String timeRange) {
        final String finalTitle = (testTitle != null && !testTitle.trim().isEmpty()) ? testTitle.trim() : null;
        
        // Stricter subject cleaning: handle potential "null", "undefined", or blank strings from frontend
        final String finalSubject;
        if (subject != null) {
            String trimmed = subject.trim();
            if (!trimmed.isEmpty() && !trimmed.equalsIgnoreCase("undefined") && !trimmed.equalsIgnoreCase("null")) {
                finalSubject = trimmed;
            } else {
                finalSubject = null;
            }
        } else {
            finalSubject = null;
        }

        System.out.println("DEBUG: Leaderboard Request - Title: [" + finalTitle + "], Subject: [" + finalSubject + "], Range: [" + timeRange + "]");

        List<TestHistory> histories = testHistoryRepository.findAll().stream()
                .filter(th -> {
                    // Title must match if provided
                    boolean titleMatch = finalTitle == null || finalTitle.equalsIgnoreCase(th.getTest());
                    if (!titleMatch) return false;

                    // STRICT Subject Matching:
                    // 1. If no subject requested, we return all for that title (unlikely for specific test view)
                    // 2. If subject requested, it MUST match the record's subject
                    if (finalSubject != null) {
                        return th.getSubject() != null && finalSubject.equalsIgnoreCase(th.getSubject().trim());
                    }
                    
                    return true;
                })
                .filter(th -> isWithinRange(th.getTimestamp(), timeRange))
                .collect(Collectors.toList());

        System.out.println("DEBUG: Found " + histories.size() + " matching records for leaderboard");
        return aggregateTestBestAttempts(histories);
    }

    private List<LeaderboardEntryDTO> aggregateTestBestAttempts(List<TestHistory> histories) {
        // Group by student ID and keep only the best attempt for this specific test/subject
        Map<Long, TestHistory> bestAttempts = histories.stream()
                .filter(th -> th.getStudent() != null)
                .collect(Collectors.toMap(
                        th -> th.getStudent().getId(),
                        th -> th,
                        (existing, replacement) -> {
                            // Ranking priority: Score > Accuracy > Time (Lower is better)
                            int rScore = replacement.getScore() != null ? replacement.getScore() : 0;
                            int eScore = existing.getScore() != null ? existing.getScore() : 0;
                            
                            if (rScore > eScore) return replacement;
                            if (rScore < eScore) return existing;
                            
                            Integer rAcc = replacement.getAccuracy();
                            Integer eAcc = existing.getAccuracy();
                            int replaceAcc = rAcc != null ? rAcc : 0;
                            int existAcc = eAcc != null ? eAcc : 0;
                            if (replaceAcc > existAcc) return replacement;
                            if (replaceAcc < existAcc) return existing;
                            
                            Integer rTime = replacement.getTimeTaken();
                            Integer eTime = existing.getTimeTaken();
                            int replaceTime = rTime != null ? rTime : Integer.MAX_VALUE;
                            int existTime = eTime != null ? eTime : Integer.MAX_VALUE;
                            if (replaceTime < existTime) return replacement;
                            
                            return existing;
                        }
                ));

        List<LeaderboardEntryDTO> entries = bestAttempts.values().stream()
                .map(th -> new LeaderboardEntryDTO(
                        th.getStudent().getName(),
                        th.getScore(),
                        th.getAccuracy(),
                        th.getStudent().getSchoolName(),
                        th.getTimeTaken()
                ))
                .sorted(getLeaderboardComparator())
                .collect(Collectors.toList());

        assignRanks(entries);
        return entries;
    }

    public List<LeaderboardEntryDTO> getWeeklyLeaderboard() {
        // For weekly cumulative, we might want to aggregate scores per student
        List<TestHistory> histories = testHistoryRepository.findAll().stream()
                .filter(th -> isWithinRange(th.getTimestamp(), "week"))
                .collect(Collectors.toList());

        return aggregateByStudentAndRank(histories);
    }

    public List<LeaderboardEntryDTO> getSchoolLeaderboard(String timeRange) {
        List<TestHistory> histories = testHistoryRepository.findAll().stream()
                .filter(th -> isWithinRange(th.getTimestamp(), timeRange))
                .collect(Collectors.toList());

        return aggregateBySchoolAndRank(histories);
    }

    private boolean isWithinRange(LocalDateTime timestamp, String range) {
        if (timestamp == null) return "all".equalsIgnoreCase(range);
        LocalDateTime now = LocalDateTime.now();
        if ("today".equalsIgnoreCase(range)) {
            return timestamp.toLocalDate().isEqual(now.toLocalDate());
        } else if ("week".equalsIgnoreCase(range)) {
            return timestamp.isAfter(now.minusWeeks(1));
        }
        return true; // all time
    }


    private List<LeaderboardEntryDTO> aggregateByStudentAndRank(List<TestHistory> histories) {
        Map<Long, List<TestHistory>> byStudent = histories.stream()
                .filter(th -> th.getStudent() != null)
                .collect(Collectors.groupingBy(th -> th.getStudent().getId()));

        List<LeaderboardEntryDTO> entries = new ArrayList<>();
        for (List<TestHistory> studentHistories : byStudent.values()) {
            TestHistory first = studentHistories.get(0);
            Double avgScore = studentHistories.stream()
                    .filter(th -> th.getScore() != null)
                    .mapToInt(TestHistory::getScore)
                    .average().orElse(0.0);
            Double avgAccuracy = studentHistories.stream()
                    .filter(th -> th.getAccuracy() != null)
                    .mapToInt(TestHistory::getAccuracy)
                    .average().orElse(0.0);
            Integer totalTime = studentHistories.stream()
                    .filter(th -> th.getTimeTaken() != null)
                    .mapToInt(TestHistory::getTimeTaken)
                    .sum();

            entries.add(new LeaderboardEntryDTO(
                    first.getStudent().getName(),
                    avgScore.intValue(),
                    avgAccuracy.intValue(),
                    first.getStudent().getSchoolName(),
                    totalTime
            ));
        }

        entries.sort(getLeaderboardComparator());
        assignRanks(entries);
        return entries;
    }

    private List<LeaderboardEntryDTO> aggregateBySchoolAndRank(List<TestHistory> histories) {
        Map<String, List<TestHistory>> bySchool = histories.stream()
                .filter(th -> th.getStudent() != null && th.getStudent().getSchoolName() != null)
                .collect(Collectors.groupingBy(th -> th.getStudent().getSchoolName()));

        List<LeaderboardEntryDTO> entries = new ArrayList<>();
        for (Map.Entry<String, List<TestHistory>> entry : bySchool.entrySet()) {
            String schoolName = entry.getKey();
            List<TestHistory> schoolHistories = entry.getValue();
            
            Double avgScore = schoolHistories.stream()
                    .filter(th -> th.getScore() != null)
                    .mapToInt(TestHistory::getScore)
                    .average().orElse(0.0);
            Double avgAccuracy = schoolHistories.stream()
                    .filter(th -> th.getAccuracy() != null)
                    .mapToInt(TestHistory::getAccuracy)
                    .average().orElse(0.0);
            Integer totalTime = schoolHistories.stream()
                    .filter(th -> th.getTimeTaken() != null)
                    .mapToInt(TestHistory::getTimeTaken)
                    .sum();

            entries.add(new LeaderboardEntryDTO(
                    schoolName,
                    avgScore.intValue(),
                    avgAccuracy.intValue(),
                    schoolName,
                    totalTime
            ));
        }

        entries.sort(getLeaderboardComparator());
        assignRanks(entries);
        return entries;
    }

    private Comparator<LeaderboardEntryDTO> getLeaderboardComparator() {
        return Comparator.comparing(LeaderboardEntryDTO::getScore).reversed()
                .thenComparing(Comparator.comparing(LeaderboardEntryDTO::getAccuracy).reversed())
                .thenComparing(LeaderboardEntryDTO::getTimeTaken);
    }

    private void assignRanks(List<LeaderboardEntryDTO> entries) {
        for (int i = 0; i < entries.size(); i++) {
            entries.get(i).setRank(i + 1);
        }
    }
}

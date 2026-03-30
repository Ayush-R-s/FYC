package com.example.admin.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.admin.model.LeaderboardEntryDTO;
import com.example.admin.service.LeaderboardService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/leaderboard")
public class LeaderboardController {

    private final LeaderboardService leaderboardService;

    public LeaderboardController(LeaderboardService leaderboardService) {
        this.leaderboardService = leaderboardService;
    }

    @GetMapping("/test")
    public List<LeaderboardEntryDTO> getTestLeaderboard(
            @RequestParam(required = false) String testTitle,
            @RequestParam(required = false) String subject,
            @RequestParam(defaultValue = "all") String timeRange) {
        return leaderboardService.getTestLeaderboard(testTitle, subject, timeRange);
    }

    @GetMapping("/weekly")
    public List<LeaderboardEntryDTO> getWeeklyLeaderboard() {
        return leaderboardService.getWeeklyLeaderboard();
    }

    @GetMapping("/school")
    public List<LeaderboardEntryDTO> getSchoolLeaderboard(
            @RequestParam(defaultValue = "all") String timeRange) {
        return leaderboardService.getSchoolLeaderboard(timeRange);
    }
}

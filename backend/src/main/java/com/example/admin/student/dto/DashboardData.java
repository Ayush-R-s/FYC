package com.example.admin.student.dto;

import java.util.List;

import com.example.admin.student.entity.DailyMockScore;
import com.example.admin.student.entity.SubjectProgress;
import com.example.admin.student.entity.WeeklyTestScore;

public class DashboardData {
    private double overallProgress;
    private double accuracy;
    private double speed;
    private TutorialCompletion tutorialCompletion;
    private List<DailyMockScore> dailyMockScores;
    private List<WeeklyTestScore> weeklyTestScores;
    private List<SubjectProgress> subjectProgress;

    public DashboardData() {}

    public double getOverallProgress() { return overallProgress; }
    public void setOverallProgress(double overallProgress) { this.overallProgress = overallProgress; }
    public double getAccuracy() { return accuracy; }
    public void setAccuracy(double accuracy) { this.accuracy = accuracy; }
    public double getSpeed() { return speed; }
    public void setSpeed(double speed) { this.speed = speed; }
    public TutorialCompletion getTutorialCompletion() { return tutorialCompletion; }
    public void setTutorialCompletion(TutorialCompletion tutorialCompletion) { this.tutorialCompletion = tutorialCompletion; }
    public List<DailyMockScore> getDailyMockScores() { return dailyMockScores; }
    public void setDailyMockScores(List<DailyMockScore> dailyMockScores) { this.dailyMockScores = dailyMockScores; }
    public List<WeeklyTestScore> getWeeklyTestScores() { return weeklyTestScores; }
    public void setWeeklyTestScores(List<WeeklyTestScore> weeklyTestScores) { this.weeklyTestScores = weeklyTestScores; }
    public List<SubjectProgress> getSubjectProgress() { return subjectProgress; }
    public void setSubjectProgress(List<SubjectProgress> subjectProgress) { this.subjectProgress = subjectProgress; }
}

package com.example.admin.model;

public class LeaderboardEntryDTO {
    private Integer rank;
    private String studentName;
    private Integer score;
    private Integer accuracy;
    private String schoolName;
    private Integer timeTaken;

    public LeaderboardEntryDTO() {}

    public LeaderboardEntryDTO(String studentName, Integer score, Integer accuracy, String schoolName, Integer timeTaken) {
        this.studentName = studentName;
        this.score = score;
        this.accuracy = accuracy;
        this.schoolName = schoolName;
        this.timeTaken = timeTaken;
    }

    public Integer getRank() { return rank; }
    public void setRank(Integer rank) { this.rank = rank; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }

    public Integer getAccuracy() { return accuracy; }
    public void setAccuracy(Integer accuracy) { this.accuracy = accuracy; }

    public String getSchoolName() { return schoolName; }
    public void setSchoolName(String schoolName) { this.schoolName = schoolName; }

    public Integer getTimeTaken() { return timeTaken; }
    public void setTimeTaken(Integer timeTaken) { this.timeTaken = timeTaken; }
}

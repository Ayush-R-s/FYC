package com.example.admin.student.entity;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.example.admin.analytics.entity.Performance;
import com.example.admin.analytics.entity.SubjectPerformance;
import com.example.admin.analytics.entity.SubjectStat;
import com.example.admin.entity.Status;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

// Force IDE Re-index
@Entity
@Table(name = "students")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String studentId;

    private String name;
    @Column(unique = true)
    private String email;
    @com.fasterxml.jackson.annotation.JsonProperty(access = com.fasterxml.jackson.annotation.JsonProperty.Access.WRITE_ONLY)
    private String password;

    @Column(nullable = true)
    private String passwordCreatedAt;

    @Column(nullable = true)
    private String passwordExpiryDate;

    @Column(nullable = true)
    private String mobile;

    @Column(nullable = true)
    private String dob;

    @Column(nullable = true)
    private String education;

    @Column(nullable = true)
    private String address;

    @Column(nullable = true)
    private String city;

    @Column(nullable = true)
    private String state;

    @Column(nullable = true)
    private String pincode;

    // Guardian Details
    @Column(nullable = true)
    private String guardianName;
    @Column(nullable = true)
    private String guardianRelation;
    @Column(nullable = true)
    private String guardianMobile;
    @Column(nullable = true)
    private String guardianEmail;

    @Column(nullable = true)
    private String guardianAddress;

    @Column(nullable = true)
    private String guardianCity;

    @Column(nullable = true)
    private String guardianState;

    @Column(nullable = true)
    private String guardianPincode;

    // Performance & Stats
    @Column(nullable = true)
    private Double passRate;

    @Column(nullable = true)
    private Integer testsAttempted;

    @Enumerated(EnumType.STRING)
    private Status status;

    // Engagement
    @Column(nullable = true)
    private Integer videosWatched;

    @Column(nullable = true)
    private String videoTime;

    @Column(nullable = true)
    private String joinDate;

    // Account Validity / Lifespan
    @Column(nullable = true)
    private String accountValidityDuration;  // e.g. "1_DAY", "1_WEEK", "1_MONTH", "1_YEAR", "CUSTOM", or null (no expiry)

    @Column(nullable = true)
    private String accountExpiryDate;  // ISO date string (YYYY-MM-DD) — computed from duration at creation

    @Column(nullable = true)
    private String createdAt;

    @Column(nullable = true)
    private String lastActive;

    @Column(nullable = true)
    private Integer assignmentsSubmitted;

    @Column(nullable = true)
    private Double attendancePercentage;

    // Courses
    @ElementCollection
    @CollectionTable(name = "student_courses", joinColumns = @JoinColumn(name = "student_id"))
    @Column(name = "course_name")
    private List<String> coursesEnrolled = new ArrayList<>();

    // Subject stats
    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "student_subjects", joinColumns = @JoinColumn(name = "student_id"))
    private List<SubjectStat> subjects = new ArrayList<>();

    // Performance records
    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Performance> performanceRecords = new ArrayList<>();

    @Column(name = "avg_score")
    private Double avgScore;

    @Column(name = "completion_rate")
    private Double completionRate;

    private String percentile;

    @Column(name = "school_name")
    private String schoolName;

    @Column(name = "global_rank")
    private Integer globalRank;

    @Column(name = "school_rank")
    private Integer schoolRank;

    @Column(name = "cohort_avg")
    private Double cohortAvg;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id")
    @JsonIgnore
    private List<SubjectPerformance> performanceData;

    @Column(name = "current_streak")
    private Integer currentStreak = 0;

    @Column(name = "best_streak")
    private Integer bestStreak = 0;

    @Column(name = "last_test_date")
    private String lastTestDate;

    @ElementCollection
    @CollectionTable(name = "student_badges", joinColumns = @JoinColumn(name = "student_id"))
    @Column(name = "badge_id")
    private List<String> earnedBadges = new ArrayList<>();

    @jakarta.persistence.Transient
    private List<com.example.admin.analytics.entity.TestHistory> detailedTestHistory;

    @jakarta.persistence.Transient
    private Map<String, Map<String, Integer>> tutorialProgress;

    @jakarta.persistence.Transient
    private List<Map<String, String>> activityLog;

    /*
     * =========================
     * ENTITY SANITIZATION
     * =========================
     */

    @PrePersist
    @PreUpdate
    private void sanitizeFields() {

        // Convert empty strings → NULL
        this.education = normalize(this.education);
        this.address = normalize(this.address);
        this.city = normalize(this.city);
        this.state = normalize(this.state);
        this.pincode = normalize(this.pincode);

        this.guardianAddress = normalize(this.guardianAddress);
        this.guardianCity = normalize(this.guardianCity);
        this.guardianState = normalize(this.guardianState);
        this.guardianPincode = normalize(this.guardianPincode);

        // Default guardian address = student address (if empty)
        if (this.guardianAddress == null)
            this.guardianAddress = this.address;
        if (this.guardianCity == null)
            this.guardianCity = this.city;
        if (this.guardianState == null)
            this.guardianState = this.state;
        if (this.guardianPincode == null)
            this.guardianPincode = this.pincode;
    }

    private String normalize(String value) {
        return (value == null || value.trim().isEmpty()) ? null : value;
    }

    /*
     * =========================
     * GETTERS & SETTERS
     * =========================
     */

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPasswordCreatedAt() {
        return passwordCreatedAt;
    }

    public void setPasswordCreatedAt(String passwordCreatedAt) {
        this.passwordCreatedAt = passwordCreatedAt;
    }

    public String getPasswordExpiryDate() {
        return passwordExpiryDate;
    }

    public void setPasswordExpiryDate(String passwordExpiryDate) {
        this.passwordExpiryDate = passwordExpiryDate;
    }

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public String getDob() {
        return dob;
    }

    public void setDob(String dob) {
        this.dob = dob;
    }

    public String getEducation() {
        return education;
    }

    public void setEducation(String education) {
        this.education = education;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getPincode() {
        return pincode;
    }

    public void setPincode(String pincode) {
        this.pincode = pincode;
    }

    public String getGuardianName() {
        return guardianName;
    }

    public void setGuardianName(String guardianName) {
        this.guardianName = guardianName;
    }

    public String getGuardianRelation() {
        return guardianRelation;
    }

    public void setGuardianRelation(String guardianRelation) {
        this.guardianRelation = guardianRelation;
    }

    public String getGuardianMobile() {
        return guardianMobile;
    }

    public void setGuardianMobile(String guardianMobile) {
        this.guardianMobile = guardianMobile;
    }

    public String getGuardianEmail() {
        return guardianEmail;
    }

    public void setGuardianEmail(String guardianEmail) {
        this.guardianEmail = guardianEmail;
    }

    public String getGuardianAddress() {
        return guardianAddress;
    }

    public void setGuardianAddress(String guardianAddress) {
        this.guardianAddress = guardianAddress;
    }

    public String getGuardianCity() {
        return guardianCity;
    }

    public void setGuardianCity(String guardianCity) {
        this.guardianCity = guardianCity;
    }

    public String getGuardianState() {
        return guardianState;
    }

    public void setGuardianState(String guardianState) {
        this.guardianState = guardianState;
    }

    public String getGuardianPincode() {
        return guardianPincode;
    }

    public void setGuardianPincode(String guardianPincode) {
        this.guardianPincode = guardianPincode;
    }

    public Double getPassRate() {
        return passRate;
    }

    public void setPassRate(Double passRate) {
        this.passRate = passRate;
    }

    public Integer getTestsAttempted() {
        return testsAttempted;
    }

    public void setTestsAttempted(Integer testsAttempted) {
        this.testsAttempted = testsAttempted;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public Integer getVideosWatched() {
        return videosWatched;
    }

    public void setVideosWatched(Integer videosWatched) {
        this.videosWatched = videosWatched;
    }

    public String getVideoTime() {
        return videoTime;
    }

    public void setVideoTime(String videoTime) {
        this.videoTime = videoTime;
    }

    public String getJoinDate() {
        return joinDate;
    }

    public void setJoinDate(String joinDate) {
        this.joinDate = joinDate;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getLastActive() {
        return lastActive;
    }

    public void setLastActive(String lastActive) {
        this.lastActive = lastActive;
    }

    public Integer getAssignmentsSubmitted() {
        return assignmentsSubmitted;
    }

    public void setAssignmentsSubmitted(Integer assignmentsSubmitted) {
        this.assignmentsSubmitted = assignmentsSubmitted;
    }

    public Double getAttendancePercentage() {
        return attendancePercentage;
    }

    public void setAttendancePercentage(Double attendancePercentage) {
        this.attendancePercentage = attendancePercentage;
    }

    public List<String> getCoursesEnrolled() {
        return coursesEnrolled;
    }

    public void setCoursesEnrolled(List<String> coursesEnrolled) {
        this.coursesEnrolled = coursesEnrolled;
    }

    public List<SubjectStat> getSubjects() {
        return subjects;
    }

    public List<Performance> getPerformanceRecords() {
        return performanceRecords;
    }

    public void setPerformanceRecords(List<Performance> performanceRecords) {
        this.performanceRecords = performanceRecords;
    }

    public Double getAvgScore() {
        return avgScore;
    }

    public void setAvgScore(Double avgScore) {
        this.avgScore = avgScore;
    }

    public Double getCompletionRate() {
        return completionRate;
    }

    public void setCompletionRate(Double completionRate) {
        this.completionRate = completionRate;
    }

    public String getPercentile() {
        return percentile;
    }

    public void setPercentile(String percentile) {
        this.percentile = percentile;
    }

    public Double getCohortAvg() {
        return cohortAvg;
    }

    public void setCohortAvg(Double cohortAvg) {
        this.cohortAvg = cohortAvg;
    }

    public String getSchoolName() {
        return schoolName;
    }

    public void setSchoolName(String schoolName) {
        this.schoolName = schoolName;
    }

    public Integer getGlobalRank() {
        return globalRank;
    }

    public void setGlobalRank(Integer globalRank) {
        this.globalRank = globalRank;
    }

    public Integer getSchoolRank() {
        return schoolRank;
    }

    public void setSchoolRank(Integer schoolRank) {
        this.schoolRank = schoolRank;
    }

    public Integer getCurrentStreak() {
        return currentStreak;
    }

    public void setCurrentStreak(Integer currentStreak) {
        this.currentStreak = currentStreak;
    }

    public Integer getBestStreak() {
        return bestStreak;
    }

    public void setBestStreak(Integer bestStreak) {
        this.bestStreak = bestStreak;
    }

    public String getLastTestDate() {
        return lastTestDate;
    }

    public void setLastTestDate(String lastTestDate) {
        this.lastTestDate = lastTestDate;
    }

    public List<String> getEarnedBadges() {
        return earnedBadges;
    }

    public void setEarnedBadges(List<String> earnedBadges) {
        this.earnedBadges = earnedBadges;
    }

    public List<SubjectPerformance> getPerformanceData() {
        return performanceData;
    }

    public void setPerformanceData(List<SubjectPerformance> performanceData) {
        this.performanceData = performanceData;
    }

    public List<com.example.admin.analytics.entity.TestHistory> getDetailedTestHistory() {
        return detailedTestHistory;
    }

    public void setDetailedTestHistory(List<com.example.admin.analytics.entity.TestHistory> detailedTestHistory) {
        this.detailedTestHistory = detailedTestHistory;
    }

    public Map<String, Map<String, Integer>> getTutorialProgress() {
        return tutorialProgress;
    }

    public void setTutorialProgress(Map<String, Map<String, Integer>> tutorialProgress) {
        this.tutorialProgress = tutorialProgress;
    }

    public List<Map<String, String>> getActivityLog() {
        return activityLog;
    }

    public void setActivityLog(List<Map<String, String>> activityLog) {
        this.activityLog = activityLog;
    }

    public String getAccountValidityDuration() {
        return accountValidityDuration;
    }

    public void setAccountValidityDuration(String accountValidityDuration) {
        this.accountValidityDuration = accountValidityDuration;
    }

    public String getAccountExpiryDate() {
        return accountExpiryDate;
    }

    public void setAccountExpiryDate(String accountExpiryDate) {
        this.accountExpiryDate = accountExpiryDate;
    }
}

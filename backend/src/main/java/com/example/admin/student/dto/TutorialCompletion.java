package com.example.admin.student.dto;

public class TutorialCompletion {
    private int completed;
    private int total;
    private int percentage;

    public TutorialCompletion() {}

    public int getCompleted() { return completed; }
    public void setCompleted(int completed) { this.completed = completed; }
    public int getTotal() { return total; }
    public void setTotal(int total) { this.total = total; }
    public int getPercentage() { return percentage; }
    public void setPercentage(int percentage) { this.percentage = percentage; }
}

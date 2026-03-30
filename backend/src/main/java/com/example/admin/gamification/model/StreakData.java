package com.example.admin.gamification.model;

import java.util.List;

public class StreakData {
    private int current;
    private int best;
    private int total;
    private List<Boolean> weekDays; // true if test done, false otherwise

    public StreakData() {}

    public StreakData(int current, int best, int total, List<Boolean> weekDays) {
        this.current = current;
        this.best = best;
        this.total = total;
        this.weekDays = weekDays;
    }

    public int getCurrent() { return current; }
    public void setCurrent(int current) { this.current = current; }
    public int getBest() { return best; }
    public void setBest(int best) { this.best = best; }
    public int getTotal() { return total; }
    public void setTotal(int total) { this.total = total; }
    public List<Boolean> getWeekDays() { return weekDays; }
    public void setWeekDays(List<Boolean> weekDays) { this.weekDays = weekDays; }
}

package com.example.admin.analytics.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "engagement_data")
public class EngagementData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="day_label",nullable = false)
    private String day;

    private Integer users;
    private Integer views;

    public EngagementData() {}

    public EngagementData(Long id, String day, Integer users, Integer views) {
        this.id = id;
        this.day = day;
        this.users = users;
        this.views = views;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getDay() { return day; }
    public void setDay(String day) { this.day = day; }

    public Integer getUsers() { return users; }
    public void setUsers(Integer users) { this.users = users; }

    public Integer getViews() { return views; }
    public void setViews(Integer views) { this.views = views; }
}

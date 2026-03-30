package com.example.admin.gamification.model;

public class Badge {
    private Long id;
    private String emoji;
    private String name;
    private String desc;
    private boolean earned;
    private String category;

    public Badge() {}

    public Badge(Long id, String emoji, String name, String desc, boolean earned, String category) {
        this.id = id;
        this.emoji = emoji;
        this.name = name;
        this.desc = desc;
        this.earned = earned;
        this.category = category;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getEmoji() { return emoji; }
    public void setEmoji(String emoji) { this.emoji = emoji; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDesc() { return desc; }
    public void setDesc(String desc) { this.desc = desc; }
    public boolean isEarned() { return earned; }
    public void setEarned(boolean earned) { this.earned = earned; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
}

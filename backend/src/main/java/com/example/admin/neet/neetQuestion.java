package com.example.admin.neet;

import jakarta.persistence.*;

@Entity
@Table(name = "iit_jee_questions")
public class neetQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer questionNumber;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String text;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String optionA;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String optionB;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String optionC;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String optionD;

    private String correctOption;
    private String subject;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getQuestionNumber() {
        return questionNumber;
    }

    public void setQuestionNumber(Integer questionNumber) {
        this.questionNumber = questionNumber;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getOptionA() {
        return optionA;
    }

    public void setOptionA(String optionA) {
        this.optionA = optionA;
    }

    public String getOptionB() {
        return optionB;
    }

    public void setOptionB(String optionB) {
        this.optionB = optionB;
    }

    public String getOptionC() {
        return optionC;
    }

    public void setOptionC(String optionC) {
        this.optionC = optionC;
    }

    public String getOptionD() {
        return optionD;
    }

    public void setOptionD(String optionD) {
        this.optionD = optionD;
    }

    public String getCorrectOption() {
        return correctOption;
    }

    public void setCorrectOption(String correctOption) {
        this.correctOption = correctOption;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }
}

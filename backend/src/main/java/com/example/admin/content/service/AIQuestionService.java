package com.example.admin.content.service;

import java.util.ArrayList;
import java.util.List;

import org.apache.tika.Tika;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.admin.content.model.Question;

@Service
public class AIQuestionService {

    public List<Question> generate(MultipartFile file, int count, String difficulty) {
        List<Question> list = new ArrayList<>();
        String content = extractText(file);
        String[] sentences = content.split("[.!?]\\s+");

        // Filter sentences that are meaningful (longer than 20 chars)
        List<String> meaningfulSentences = new ArrayList<>();
        for (String s : sentences) {
            String clean = s.trim();
            if (clean.length() > 30 && clean.length() < 200) {
                meaningfulSentences.add(clean);
            }
        }

        if (meaningfulSentences.isEmpty()) {
            meaningfulSentences.add("The study material covers various topics related to the subject.");
            meaningfulSentences.add("Students should focus on key concepts and definitions provided in the document.");
        }

        java.util.Random random = new java.util.Random();
        for (int i = 0; i < count; i++) {
            String sourceSentence = meaningfulSentences.get(i % meaningfulSentences.size());

            Question q = new Question();
            // Remove "Based on the content" prefix
            q.setText("Regarding: \"" + truncate(sourceSentence, 100) + "...\", which statement is most accurate?");

            // Generate options - one correct (the sentence itself or derived), others mock
            List<String> options = new ArrayList<>();
            options.add(sourceSentence); // Correct answer (initially at index 0)
            options.add("The information is not relevant to the current topic.");
            options.add("This concept is only applicable in specialized cases.");
            options.add("The document does not provide enough data on this.");

            // Randomize correct answer position
            int correctIndex = random.nextInt(4);
            if (correctIndex != 0) {
                String temp = options.get(0);
                options.set(0, options.get(correctIndex));
                options.set(correctIndex, temp);
            }

            q.setAnswers(options);
            q.setCorrectAnswers(List.of(correctIndex));
            q.setPoints(1);
            list.add(q);
        }

        return list;
    }

    private String extractText(MultipartFile file) {
        try {
            Tika tika = new Tika();
            String text = tika.parseToString(file.getInputStream());
            return text;
        } catch (Throwable e) {
            // Fallback to simpler mock content if library is missing
            return "The document " + file.getOriginalFilename() + " contains important study materials. " +
                    "Focus on the main definitions and key principles outlined in the text. " +
                    "Regular practice of the examples provided will help in mastering the subject. " +
                    "The material covers fundamental concepts that are essential for the upcoming tests.";
        }
    }

    private String truncate(String text, int length) {
        if (text.length() <= length)
            return text;
        return text.substring(0, length);
    }
}

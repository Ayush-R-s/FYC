package com.example.admin.content.service;

import java.util.ArrayList;
import java.util.List;
import java.io.IOException;

import org.apache.tika.Tika;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.admin.content.model.Question;

@Service
public class AIQuestionService {

    public List<Question> generate(MultipartFile file, int count, String difficulty) {
        List<Question> list = new ArrayList<>();
        String content = extractText(file);
        String[] sentences = content.split("[.!?]\\s+");

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
            q.setText("Regarding: \"" + truncate(sourceSentence, 100) + "...\", which statement is most accurate?");
            List<String> options = new ArrayList<>();
            options.add(sourceSentence);
            options.add("The information is not relevant to the current topic.");
            options.add("This concept is only applicable in specialized cases.");
            options.add("The document does not provide enough data on this.");
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

    public List<Question> extractStructuredQuestions(MultipartFile file) {
        String content = extractText(file);
        if (content.isEmpty()) {
            System.err.println("DEBUG: Extraction resulted in empty text.");
            return new ArrayList<>();
        }
        
        System.out.println("DEBUG: Text extracted (Length: " + content.length() + ")");
        System.out.println("DEBUG: --- BEGIN SNAPSHOT ---");
        System.out.println(content.substring(0, Math.min(content.length(), 1000)));
        System.out.println("DEBUG: --- END SNAPSHOT ---");

        return parseQuestionsFromText(content);
    }

    private List<Question> parseQuestionsFromText(String content) {
        List<Question> questions = new ArrayList<>();
        // Normalize line breaks to \n
        String normalized = content.replaceAll("\\r\\n|\\r", "\n");
        String[] lines = normalized.split("\n");
        
        Question currentQuestion = null;
        List<String> currentOptions = new ArrayList<>();
        boolean inAnswerSection = false;
        
        // Metadata found at top of file
        String extractedSubject = null;
        String extractedChapter = null;
        String extractedTopic = null;

        // Patterns for identifying segments within a line
        java.util.regex.Pattern qMarker = java.util.regex.Pattern.compile("(?:^|\\s+)(?:Question|Q)?\\s*(\\d+)[.:)\\s]+", java.util.regex.Pattern.CASE_INSENSITIVE);
        java.util.regex.Pattern optMarker = java.util.regex.Pattern.compile("(?:^|\\s+)[\\*\\-•·]?\\s*[\\(\\[]?([a-dA-D])[\\)\\]][\\s.:]*", java.util.regex.Pattern.CASE_INSENSITIVE);
        java.util.regex.Pattern ansMarker = java.util.regex.Pattern.compile("(?:^|\\s+|•|·|\\|)(?:Ans|Answer|Key|Correct)[.:\\s]+[\\(\\[]?([a-dA-D])[\\)\\]]?", java.util.regex.Pattern.CASE_INSENSITIVE);
        java.util.regex.Pattern keyHeader = java.util.regex.Pattern.compile("^\\s*(?:Answer Key|Answers|Solutions|Key)\\s*$", java.util.regex.Pattern.CASE_INSENSITIVE);

        // Metadata Patterns
        java.util.regex.Pattern topicPtrn = java.util.regex.Pattern.compile("^\\s*(?:Topic|Unit|Subject)\\s*[:\\-]?\\s*(.*)$", java.util.regex.Pattern.CASE_INSENSITIVE);
        java.util.regex.Pattern chapterPtrn = java.util.regex.Pattern.compile("^\\s*(?:Chapter|Ch)\\s*(\\d*)\\s*[:\\-]?\\s*(.*)$", java.util.regex.Pattern.CASE_INSENSITIVE);

        for (String line : lines) {
            line = line.trim();
            if (line.isEmpty()) continue;

            // Before we find any questions, look for metadata headers
            if (currentQuestion == null && questions.isEmpty()) {
                java.util.regex.Matcher tM = topicPtrn.matcher(line);
                if (tM.find()) { extractedTopic = tM.group(1).trim(); continue; }
                
                java.util.regex.Matcher cM = chapterPtrn.matcher(line);
                if (cM.find()) { 
                    String num = cM.group(1);
                    String name = cM.group(2);
                    extractedChapter = (num + " " + name).trim();
                    continue; 
                }
            }

            if (keyHeader.matcher(line).find()) {
                inAnswerSection = true;
                continue;
            }

            java.util.regex.Matcher qM = qMarker.matcher(line);
            java.util.regex.Matcher oM = optMarker.matcher(line);
            java.util.regex.Matcher aM = ansMarker.matcher(line);

            if (qM.find() && qM.start() < 5 && !inAnswerSection) { 
                if (currentQuestion != null && !currentOptions.isEmpty()) {
                    currentQuestion.setAnswers(new ArrayList<>(currentOptions));
                    questions.add(currentQuestion);
                }
                currentQuestion = new Question();
                currentQuestion.setPoints(4);
                currentOptions = new ArrayList<>();
                
                String remaining = line.substring(qM.end()).trim();
                processMixedLine(remaining, currentQuestion, currentOptions, optMarker, ansMarker);
            } else if (currentQuestion != null) {
                processMixedLine(line, currentQuestion, currentOptions, optMarker, ansMarker);
            }
        }

        if (currentQuestion != null && !currentOptions.isEmpty()) {
            currentQuestion.setAnswers(new ArrayList<>(currentOptions));
            questions.add(currentQuestion);
        }

        // Final Cleanup: Filter out garbage/incomplete questions
        List<Question> validatedQuestions = new java.util.ArrayList<>();
        for (Question q : questions) {
            if (q.getText() != null && !q.getText().trim().isEmpty() && 
                q.getAnswers() != null && !q.getAnswers().isEmpty()) {
                validatedQuestions.add(q);
            }
        }

        return validatedQuestions;
    }

    private void processMixedLine(String line, Question q, List<String> opts, java.util.regex.Pattern optMarker, java.util.regex.Pattern ansMarker) {
        java.util.regex.Matcher aM = ansMarker.matcher(line);
        boolean foundAnswerInThisLine = false;
        int lastEnd = 0;

        // 1. Prioritize Answer detection to avoid Option conflicts
        // We look for the answer anywhere in the line first
        if (aM.find()) {
            foundAnswerInThisLine = true;
            String ansChar = aM.group(1).toUpperCase();
            int ansIdx = ansChar.charAt(0) - 'A';
            q.setCorrectAnswers(List.of(ansIdx));
            
            // We'll process the line up to the start of the answer
            // Text after the answer is ignored for option parsing
            line = line.substring(0, aM.start());
        }

        java.util.regex.Matcher oM = optMarker.matcher(line);
        // 2. Sequential Option Parsing
        while (oM.find()) {
            String foundLetter = oM.group(1).toUpperCase();
            char expectedChar = (char) ('A' + opts.size());
            
            // Only count as a NEW option if it's the next letter in sequence (A, B, C, D)
            // This prevents "Both (a) and (b)" from creating extra options
            if (foundLetter.charAt(0) == expectedChar && opts.size() < 4) {
                // Text before this correct marker belongs to the PREVIOUS part
                String textBefore = line.substring(lastEnd, oM.start()).trim();
                if (!textBefore.isEmpty()) {
                    if (opts.isEmpty()) {
                        q.setText(q.getText() == null ? textBefore : q.getText() + " " + textBefore);
                    } else {
                        int last = opts.size() - 1;
                        opts.set(last, opts.get(last) + " " + textBefore);
                    }
                }
                opts.add(""); 
                lastEnd = oM.end();
            } else {
                // Out of sequence - treat as literal text
                // Do NOT update lastEnd, so the text (including the parentheses) 
                // gets picked up by the next segment or the "remaining text" logic
            }
        }

        // 3. Append remaining text
        String remaining = line.substring(lastEnd).trim();
        if (!remaining.isEmpty()) {
            if (opts.isEmpty()) {
                q.setText(q.getText() == null ? remaining : q.getText() + " " + remaining);
            } else {
                int last = opts.size() - 1;
                opts.set(last, opts.get(last) + " " + remaining);
            }
        }
    }

    private String extractText(MultipartFile file) {
        byte[] bytes;
        try {
            bytes = file.getBytes();
        } catch (IOException e) {
            System.err.println("Failed to read file bytes: " + e.getMessage());
            return "";
        }

        String filename = file.getOriginalFilename() != null ? file.getOriginalFilename().toLowerCase() : "";
        String text = "";

        // Pass 1: Try PDFBox
        if (filename.endsWith(".pdf")) {
            text = extractWithPDFBox(bytes);
        }

        // Pass 2: Try Tika Fallback
        if (text.trim().length() < 50) {
            text = extractWithTika(bytes);
        }

        // Pass 3: Last Resort
        if (text.trim().length() < 50) {
            text = new String(bytes);
        }

        return text;
    }

    private String extractWithPDFBox(byte[] bytes) {
        try (PDDocument document = PDDocument.load(new java.io.ByteArrayInputStream(bytes))) {
            PDFTextStripper stripper = new PDFTextStripper();
            stripper.setSortByPosition(true);
            return stripper.getText(document);
        } catch (IOException e) {
            System.err.println("PDFBox failed: " + e.getMessage());
            return "";
        }
    }

    private String extractWithTika(byte[] bytes) {
        try {
            Tika tika = new Tika();
            return tika.parseToString(new java.io.ByteArrayInputStream(bytes));
        } catch (Throwable e) {
            System.err.println("Tika failed: " + e.getMessage());
            return "";
        }
    }

    private String truncate(String text, int length) {
        if (text == null || text.length() <= length) return text;
        return text.substring(0, length);
    }
}


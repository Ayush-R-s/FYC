package com.example.admin.neet;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class neetQuestionService {

    private final neetQuestionRepository repository;

    public neetQuestionService(neetQuestionRepository repository) {
        this.repository = repository;
    }

    public List<neetQuestion> getAllQuestions() {
        return repository.findAll();
    }

    @Transactional
    public List<neetQuestion> saveAll(List<neetQuestion> questions) {
        if (questions == null || questions.isEmpty()) {
            return new ArrayList<>();
        }
        // Clear out existing IDs to prevent updates and force clean inserts
        for (neetQuestion q : questions) {
            q.setId(null);
        }
        return repository.saveAll(questions);
    }

    public List<neetQuestion> parsePdf(byte[] pdfBytes) throws IOException {
        String text;
        try (PDDocument document = PDDocument.load(new ByteArrayInputStream(pdfBytes))) {
            PDFTextStripper stripper = new PDFTextStripper();
            stripper.setSortByPosition(true);
            text = stripper.getText(document);
        }

        return parseQuestionsFromText(text);
    }

    private List<neetQuestion> parseQuestionsFromText(String content) {
        List<neetQuestion> questions = new ArrayList<>();
        if (content == null || content.trim().isEmpty()) {
            return questions;
        }

        // Normalize line breaks to \n
        String normalized = content.replaceAll("\\r\\n|\\r", "\n");
        String[] lines = normalized.split("\n");

        Pattern qMarker = Pattern.compile("^Q\\s*(\\d+)\\s*[.)·•]?\\s*(.*)$", Pattern.CASE_INSENSITIVE);
        Pattern ansMarker = Pattern.compile("^\\s*(?:Answer|Ans|Correct)\\s*[:.-]\\s*(.*)$", Pattern.CASE_INSENSITIVE);

        List<QuestionBlock> blocks = new ArrayList<>();
        QuestionBlock currentBlock = null;
        String currentSubject = "General";

        for (String line : lines) {
            String trimmed = line.trim();
            if (trimmed.isEmpty())
                continue;

            // Subject header detection
            if (trimmed.equalsIgnoreCase("Biology") ||
                    trimmed.equalsIgnoreCase("Chemistry") ||
                    trimmed.equalsIgnoreCase("Physics")) {
                currentSubject = trimmed;
                continue;
            }

            Matcher qM = qMarker.matcher(trimmed);
            if (qM.matches()) {
                if (currentBlock != null) {
                    blocks.add(currentBlock);
                }
                currentBlock = new QuestionBlock();
                currentBlock.questionNumber = Integer.parseInt(qM.group(1));
                currentBlock.subject = currentSubject;
                currentBlock.rawContent.append(qM.group(2));
                continue;
            }

            if (currentBlock != null) {
                Matcher ansM = ansMarker.matcher(trimmed);
                if (ansM.matches()) {
                    currentBlock.answerLine = ansM.group(1).trim();
                    blocks.add(currentBlock);
                    currentBlock = null; // reset to process next question
                } else {
                    if (currentBlock.rawContent.length() > 0) {
                        currentBlock.rawContent.append(" ");
                    }
                    currentBlock.rawContent.append(trimmed);
                }
            }
        }
        if (currentBlock != null) {
            blocks.add(currentBlock);
        }

        for (QuestionBlock b : blocks) {
            neetQuestion q = parseQuestionBlock(b);
            if (q != null) {
                questions.add(q);
            }
        }

        return questions;
    }

    private neetQuestion parseQuestionBlock(QuestionBlock b) {
        neetQuestion q = new neetQuestion();
        q.setQuestionNumber(b.questionNumber);
        q.setSubject(b.subject);
        q.setCorrectOption(b.answerLine);

        String content = b.rawContent.toString();

        // Option markers
        String regexA = "(?:\\([aA]\\)|\\b[aA]\\s*[.)·•])";
        String regexB = "(?:\\([bB]\\)|\\b[bB]\\s*[.)·•])";
        String regexC = "(?:\\([cC]\\)|\\b[cC]\\s*[.)·•])";
        String regexD = "(?:\\([dD]\\)|\\b[dD]\\s*[.)·•])";

        Pattern patA = Pattern.compile(regexA);
        Pattern patB = Pattern.compile(regexB);
        Pattern patC = Pattern.compile(regexC);
        Pattern patD = Pattern.compile(regexD);

        int idxA = -1;
        int lenA = 0;
        Matcher mA = patA.matcher(content);
        if (mA.find()) {
            idxA = mA.start();
            lenA = mA.group().length();
        }

        int idxB = -1;
        int lenB = 0;
        if (idxA != -1) {
            Matcher mB = patB.matcher(content);
            while (mB.find()) {
                if (mB.start() > idxA) {
                    idxB = mB.start();
                    lenB = mB.group().length();
                    break;
                }
            }
        }

        int idxC = -1;
        int lenC = 0;
        if (idxB != -1) {
            Matcher mC = patC.matcher(content);
            while (mC.find()) {
                if (mC.start() > idxB) {
                    idxC = mC.start();
                    lenC = mC.group().length();
                    break;
                }
            }
        }

        int idxD = -1;
        int lenD = 0;
        if (idxC != -1) {
            Matcher mD = patD.matcher(content);
            while (mD.find()) {
                if (mD.start() > idxC) {
                    idxD = mD.start();
                    lenD = mD.group().length();
                    break;
                }
            }
        }

        if (idxA != -1 && idxB != -1 && idxC != -1 && idxD != -1) {
            q.setText(content.substring(0, idxA).trim());
            q.setOptionA(content.substring(idxA + lenA, idxB).trim());
            q.setOptionB(content.substring(idxB + lenB, idxC).trim());
            q.setOptionC(content.substring(idxC + lenC, idxD).trim());
            q.setOptionD(content.substring(idxD + lenD).trim());
        } else {
            // Fallback: If sequential matching fails, capture whole text as the stem
            q.setText(content.trim());
            q.setOptionA("");
            q.setOptionB("");
            q.setOptionC("");
            q.setOptionD("");
        }

        return q;
    }

    private static class QuestionBlock {
        int questionNumber;
        String subject;
        StringBuilder rawContent = new StringBuilder();
        String answerLine = "";
    }
}

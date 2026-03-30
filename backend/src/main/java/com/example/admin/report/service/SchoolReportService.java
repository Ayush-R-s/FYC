package com.example.admin.report.service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.admin.analytics.entity.TestHistory;
import com.example.admin.analytics.repository.TestHistoryRepository;
import com.example.admin.student.entity.Student;
import com.example.admin.student.repository.StudentRepository;

@Service
public class SchoolReportService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private TestHistoryRepository testHistoryRepository;

    public byte[] generateSchoolReport(String schoolName, String startDate, String endDate) throws IOException {
        List<Student> students = studentRepository.findBySchoolName(schoolName);
        List<TestHistory> tests = testHistoryRepository.findByStudent_SchoolNameAndDateBetween(schoolName, startDate, endDate);

        try (XSSFWorkbook workbook = new XSSFWorkbook()) {
            // Sheet 1: Summary
            createSummarySheet(workbook, schoolName, students, tests, startDate, endDate);

            // Sheet 2: Student Performance
            createPerformanceSheet(workbook, students, tests);

            ByteArrayOutputStream bos = new ByteArrayOutputStream();
            workbook.write(bos);
            return bos.toByteArray();
        }
    }

    private void createSummarySheet(Workbook workbook, String schoolName, List<Student> students,
            List<TestHistory> tests, String from, String to) {
        Sheet sheet = workbook.createSheet("School Summary");

        // Define Styles
        CellStyle titleStyle = createTitleStyle(workbook);
        CellStyle infoStyle = createInfoStyle(workbook);
        CellStyle tableHeaderStyle = createTableHeaderStyle(workbook);
        CellStyle tableDataStyle = createTableDataStyle(workbook);

        int rowIdx = 1; // Start from Row 1 for padding

        // Main Title
        Row titleRow = sheet.createRow(rowIdx++);
        Cell titleCell = titleRow.createCell(1);
        titleCell.setCellValue("SCHOOL PERFORMANCE REPORT");
        titleCell.setCellStyle(titleStyle);
        sheet.addMergedRegion(new org.apache.poi.ss.util.CellRangeAddress(1, 1, 1, 4));

        rowIdx++; // spacer

        // School Information Section
        Row sNameRow = sheet.createRow(rowIdx++);
        sNameRow.createCell(1).setCellValue("School Name:");
        sNameRow.getCell(1).setCellStyle(infoStyle);
        sNameRow.createCell(2).setCellValue(schoolName);

        Row periodRow = sheet.createRow(rowIdx++);
        periodRow.createCell(1).setCellValue("Report Period:");
        periodRow.getCell(1).setCellStyle(infoStyle);
        periodRow.createCell(2).setCellValue(from + "  to  " + to);

        Row totalRow = sheet.createRow(rowIdx++);
        totalRow.createCell(1).setCellValue("Total Students:");
        totalRow.getCell(1).setCellStyle(infoStyle);
        totalRow.createCell(2).setCellValue(students.size());

        double avgScore = tests.stream()
                .mapToInt(TestHistory::getScore)
                .average()
                .orElse(0.0);
        Row avgRow = sheet.createRow(rowIdx++);
        avgRow.createCell(1).setCellValue("Average Performance:");
        avgRow.getCell(1).setCellStyle(infoStyle);
        avgRow.createCell(2).setCellValue(String.format("%.2f%%", avgScore));

        rowIdx += 2; // spacer

        // Top 10 Students Header
        Row topHeaderRow = sheet.createRow(rowIdx++);
        Cell c1 = topHeaderRow.createCell(1);
        c1.setCellValue("RANK");
        c1.setCellStyle(tableHeaderStyle);
        Cell c2 = topHeaderRow.createCell(2);
        c2.setCellValue("STUDENT NAME");
        c2.setCellStyle(tableHeaderStyle);
        Cell c3 = topHeaderRow.createCell(3);
        c3.setCellValue("AVG SCORE");
        c3.setCellStyle(tableHeaderStyle);

        List<Student> top10 = students.stream()
                .sorted(Comparator.comparing(s -> s.getAvgScore() != null ? s.getAvgScore() : 0.0,
                        Comparator.reverseOrder()))
                .limit(10)
                .collect(Collectors.toList());

        for (int i = 0; i < top10.size(); i++) {
            Row r = sheet.createRow(rowIdx++);
            Cell rankCell = r.createCell(1);
            rankCell.setCellValue(i + 1);
            rankCell.setCellStyle(tableDataStyle);
            Cell nameCell = r.createCell(2);
            nameCell.setCellValue(top10.get(i).getName());
            nameCell.setCellStyle(tableDataStyle);
            Cell scoreCell = r.createCell(3);
            scoreCell.setCellValue(top10.get(i).getAvgScore() != null ? top10.get(i).getAvgScore() + "%" : "N/A");
            scoreCell.setCellStyle(tableDataStyle);
        }

        sheet.autoSizeColumn(1);
        sheet.autoSizeColumn(2);
        sheet.autoSizeColumn(3);
    }

    private void createPerformanceSheet(Workbook workbook, List<Student> students, List<TestHistory> tests) {
        Sheet sheet = workbook.createSheet("Student Performance Detail");
        sheet.createFreezePane(0, 1);

        CellStyle headerStyle = createTableHeaderStyle(workbook);
        CellStyle dataStyle = createTableDataStyle(workbook);
        CellStyle zebraStyle = createZebraStyle(workbook);

        Row headerRow = sheet.createRow(0);
        String[] columns = {"Rank", "ID", "Student Name", "Avg Score", "Strong Area", "Weak Area", "Tests Completed"};
        for (int i = 0; i < columns.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(columns[i]);
            cell.setCellStyle(headerStyle);
        }

        List<Student> sortedStudents = students.stream()
                .sorted(Comparator.comparing(s -> s.getAvgScore() != null ? s.getAvgScore() : 0.0, Comparator.reverseOrder()))
                .collect(Collectors.toList());

        int rowIdx = 1;
        for (int i = 0; i < sortedStudents.size(); i++) {
            Student s = sortedStudents.get(i);
            Row row = sheet.createRow(rowIdx++);
            CellStyle currentStyle = (rowIdx % 2 == 0) ? zebraStyle : dataStyle;

            Cell c0 = row.createCell(0);
            c0.setCellValue(i + 1);
            c0.setCellStyle(currentStyle);
            Cell c1 = row.createCell(1);
            c1.setCellValue(s.getStudentId());
            c1.setCellStyle(currentStyle);
            Cell c2 = row.createCell(2);
            c2.setCellValue(s.getName());
            c2.setCellStyle(currentStyle);
            Cell c3 = row.createCell(3);
            c3.setCellValue(s.getAvgScore() != null ? s.getAvgScore() : 0.0);
            c3.setCellStyle(currentStyle);

            List<TestHistory> studentTests = tests.stream()
                    .filter(t -> t.getStudentId().equals(s.getId()))
                    .collect(Collectors.toList());

            Cell c4 = row.createCell(4);
            c4.setCellValue(calculateStrongArea(studentTests));
            c4.setCellStyle(currentStyle);
            Cell c5 = row.createCell(5);
            c5.setCellValue(calculateWeakArea(studentTests));
            c5.setCellStyle(currentStyle);
            Cell c6 = row.createCell(6);
            c6.setCellValue(studentTests.size());
            c6.setCellStyle(currentStyle);
        }

        for (int i = 0; i < columns.length; i++) {
            sheet.autoSizeColumn(i);
        }
    }

    private CellStyle createTitleStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setBold(true);
        font.setFontHeightInPoints((short) 16);
        font.setColor(IndexedColors.ORANGE.getIndex());
        style.setFont(font);
        style.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.CENTER);
        return style;
    }

    private CellStyle createInfoStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setBold(true);
        style.setFont(font);
        return style;
    }

    private CellStyle createTableHeaderStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        style.setFillForegroundColor(IndexedColors.DARK_BLUE.getIndex());
        style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        style.setBorderBottom(org.apache.poi.ss.usermodel.BorderStyle.THIN);
        style.setBorderTop(org.apache.poi.ss.usermodel.BorderStyle.THIN);
        style.setBorderLeft(org.apache.poi.ss.usermodel.BorderStyle.THIN);
        style.setBorderRight(org.apache.poi.ss.usermodel.BorderStyle.THIN);

        Font font = workbook.createFont();
        font.setBold(true);
        font.setColor(IndexedColors.WHITE.getIndex());
        style.setFont(font);
        style.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.CENTER);
        return style;
    }

    private CellStyle createTableDataStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        style.setBorderBottom(org.apache.poi.ss.usermodel.BorderStyle.THIN);
        style.setBorderTop(org.apache.poi.ss.usermodel.BorderStyle.THIN);
        style.setBorderLeft(org.apache.poi.ss.usermodel.BorderStyle.THIN);
        style.setBorderRight(org.apache.poi.ss.usermodel.BorderStyle.THIN);
        return style;
    }

    private CellStyle createZebraStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        style.setFillForegroundColor(IndexedColors.LEMON_CHIFFON.getIndex());
        style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        style.setBorderBottom(org.apache.poi.ss.usermodel.BorderStyle.THIN);
        style.setBorderTop(org.apache.poi.ss.usermodel.BorderStyle.THIN);
        style.setBorderLeft(org.apache.poi.ss.usermodel.BorderStyle.THIN);
        style.setBorderRight(org.apache.poi.ss.usermodel.BorderStyle.THIN);
        return style;
    }

    private String calculateStrongArea(List<TestHistory> tests) {
        if (tests.isEmpty()) {
            return "N/A";
        }
        Map<String, List<Integer>> subjectScores = tests.stream()
                .filter(t -> t.getSubject() != null)
                .collect(Collectors.groupingBy(TestHistory::getSubject,
                        Collectors.mapping(TestHistory::getScore, Collectors.toList())));

        return subjectScores.entrySet().stream()
                .max(Comparator.comparingDouble(e -> e.getValue().stream().mapToInt(v -> v).average().orElse(0.0)))
                .map(Map.Entry::getKey).orElse("N/A");
    }

    private String calculateWeakArea(List<TestHistory> tests) {
        if (tests.isEmpty()) {
            return "N/A";
        }
        Map<String, List<Integer>> subjectScores = tests.stream()
                .filter(t -> t.getSubject() != null)
                .collect(Collectors.groupingBy(TestHistory::getSubject,
                        Collectors.mapping(TestHistory::getScore, Collectors.toList())));

        return subjectScores.entrySet().stream()
                .min(Comparator.comparingDouble(e -> e.getValue().stream().mapToInt(v -> v).average().orElse(0.0)))
                .map(Map.Entry::getKey).orElse("N/A");
    }
}

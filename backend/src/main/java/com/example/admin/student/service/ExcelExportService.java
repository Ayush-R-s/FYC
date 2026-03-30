package com.example.admin.student.service;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import com.example.admin.student.entity.Student;

@Service
public class ExcelExportService {

    private static final String FILE_NAME = "students_credentials.xlsx";

    public void appendStudentCredential(Student student, String plainPassword) {
        Workbook workbook;
        Sheet sheet;
        File file = new File(FILE_NAME);

        try {
            if (file.exists()) {
                FileInputStream fis = new FileInputStream(file);
                workbook = new XSSFWorkbook(fis);
                sheet = workbook.getSheetAt(0);
                fis.close();
            } else {
                workbook = new XSSFWorkbook();
                sheet = workbook.createSheet("Student Credentials");
                createHeaderRow(workbook, sheet);
            }

            int lastRowNum = sheet.getLastRowNum();
            Row row = sheet.createRow(lastRowNum + 1);

            row.createCell(0).setCellValue(student.getStudentId());
            row.createCell(1).setCellValue(student.getName());
            row.createCell(2).setCellValue(student.getEmail());
            row.createCell(3).setCellValue(plainPassword);

            for (int i = 0; i < 4; i++) {
                sheet.autoSizeColumn(i);
            }

            try (FileOutputStream fos = new FileOutputStream(FILE_NAME)) {
                workbook.write(fos);
            }
            workbook.close();

        } catch (IOException e) {
            System.err.println("Error while updating Excel file: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private void createHeaderRow(Workbook workbook, Sheet sheet) {
        Row headerRow = sheet.createRow(0);
        String[] columns = {"Student ID", "Name", "Email", "Password"};

        CellStyle headerStyle = workbook.createCellStyle();
        Font headerFont = workbook.createFont();
        headerFont.setBold(true);
        headerStyle.setFont(headerFont);
        headerStyle.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
        headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

        for (int i = 0; i < columns.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(columns[i]);
            cell.setCellStyle(headerStyle);
        }
    }
}

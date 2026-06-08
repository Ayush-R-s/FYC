package com.example.admin.report.controller;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.admin.report.service.SchoolReportService;

@RestController
@RequestMapping("/reports")
public class ReportController {

    @Autowired
    private SchoolReportService schoolReportService;

    @SuppressWarnings("null")
    @GetMapping("/school")
    public ResponseEntity<byte[]> downloadSchoolReport(
            @RequestParam String schoolName,
            @RequestParam String from,
            @RequestParam String to) {

        try {
            byte[] report = schoolReportService.generateSchoolReport(schoolName, from, to);

            String filename = "School_Report_" + schoolName.replace(" ", "_") + ".xlsx";

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename)
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(report);

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}

package com.example.admin.content.service;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class DocumentExtractorService {

    public String extractText(MultipartFile file) throws Exception {
        String name = file.getOriginalFilename().toLowerCase();

        if (name.endsWith(".pdf")) {
            return extractPdf(file);
        } else if (name.endsWith(".docx")) {
            return extractDocx(file);
        } else {
            return new String(file.getBytes());
        }
    }

    private String extractPdf(MultipartFile file) throws Exception {
        PDDocument doc = PDDocument.load(file.getInputStream());
        PDFTextStripper stripper = new PDFTextStripper();
        String text = stripper.getText(doc);
        doc.close();
        return text;
    }

    private String extractDocx(MultipartFile file) throws Exception {
        XWPFDocument doc = new XWPFDocument(file.getInputStream());
        StringBuilder sb = new StringBuilder();
        for (XWPFParagraph p : doc.getParagraphs()) {
            sb.append(p.getText()).append("\n");
        }
        return sb.toString();
    }
}


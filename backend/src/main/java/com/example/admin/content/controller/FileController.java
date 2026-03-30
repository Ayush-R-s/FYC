package com.example.admin.content.controller;


import java.net.URI;
import java.net.URLDecoder;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.admin.content.service.FileStorageService;

import jakarta.servlet.http.HttpServletRequest;


@RestController
@RequestMapping("/admin/content/files")
public class FileController {

    private final FileStorageService storageService;

    public FileController(FileStorageService storageService) {
        this.storageService = storageService;
    }

    /**
     * Handles file download requests by redirecting to a secure S3 Presigned URL.
     * This offloads the media traffic to S3 while keeping the bucket private.
     */
    @GetMapping("/**")
    public ResponseEntity<Void> downloadFile(HttpServletRequest request) {
        String path = request.getRequestURI();
        
        // Context prefix if any (server.servlet.context-path=/api)
        String servletPath = "/admin/content/files/";
        
        int index = path.indexOf(servletPath);
        
        if (index == -1) {
            return ResponseEntity.notFound().build();
        }
        
        String fullKey = path.substring(index + servletPath.length());
        
        try {
            // S3 Keys are stored as literal strings. We must decode URL%20 to space
            // so the S3 Client can find the exact object.
            fullKey = URLDecoder.decode(fullKey, "UTF-8");
        } catch (Exception e) {
            // Fallback if decode fails, though UTF-8 is standard
        }

        try {
            // Generate a Presigned URL for direct S3 access
            String presignedUrl = storageService.getPresignedUrl(fullKey);

            // Redirect the client to S3 directly
            // Using URI.create(presignedUrl) ensures that the pre-encoded URL from AWS 
            // is handled correctly as a complete Location header.
            return ResponseEntity.status(HttpStatus.FOUND)
                    .location(URI.create(presignedUrl))
                    .build();
        } catch (Exception e) {
            // If file doesn't exist or S3 fails, return 404
            return ResponseEntity.notFound().build();
        }
    }
}

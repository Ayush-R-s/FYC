package com.example.admin.content.service;

import java.io.IOException;
import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.admin.exception.FileNotFoundException;

import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.S3Exception;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import software.amazon.awssdk.services.s3.presigner.model.PresignedGetObjectRequest;

/**
 * Service for managing file storage in AWS S3.
 * Handles uploads, downloads, and deletions of files (notes, videos, etc.)
 * using both synchronous S3Client and S3Presigner for efficient URL generation.
 */
@Service
public class FileStorageService {

    private final S3Client s3Client;
    private final S3Presigner s3Presigner;

    @Value("${aws.s3.bucket}")
    private String bucketName;

    public FileStorageService(S3Client s3Client, S3Presigner s3Presigner) {
        this.s3Client = s3Client;
        this.s3Presigner = s3Presigner;
    }

    /**
     * Saves a file to S3 with an optional prefix (folder).
     *
     * @param file   The multipart file to upload.
     * @param prefix The folder prefix (e.g., "notes/", "videos/").
     * @return The full S3 key (including prefix) of the saved file.
     */
    public String save(MultipartFile file, String prefix) {
        try {
            String originalName = file.getOriginalFilename();
            String sanitizedName = sanitizeFilename(originalName != null ? originalName : "file");
            String uniqueName = System.currentTimeMillis() + "_" + sanitizedName;
            
            // Ensure prefix ends with / if provided
            String fullKey = (prefix != null && !prefix.isEmpty()) 
                    ? (prefix.endsWith("/") ? prefix : prefix + "/") + uniqueName 
                    : uniqueName;

            Map<String, String> metadata = new HashMap<>();
            if (originalName != null) {
                metadata.put("original-filename", originalName);
            }

            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(fullKey)
                    .contentType(file.getContentType())
                    .metadata(metadata)
                    .build();

            s3Client.putObject(putObjectRequest, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));
            
            return fullKey;
        } catch (IOException | S3Exception e) {
            throw new RuntimeException("File upload to S3 failed: " + e.getMessage(), e);
        }
    }

    /**
     * Generates a temporary presigned URL for secure and efficient file fetching from S3.
     * 
     * @param key The full S3 key of the object.
     * @return A URL string valid for 60 minutes.
     */
    public String getPresignedUrl(String key) {
        GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .build();

        GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
                .signatureDuration(Duration.ofMinutes(60))
                .getObjectRequest(getObjectRequest)
                .build();

        PresignedGetObjectRequest presignedRequest = s3Presigner.presignGetObject(presignRequest);
        return presignedRequest.url().toString();
    }

    /**
     * Loads a file from S3 as a Spring Resource (direct stream).
     * Consider using getPresignedUrl for better scalability with media content.
     */
    public Resource load(String fullKey) {
        try {
            GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                    .bucket(bucketName)
                    .key(fullKey)
                    .build();

            return new InputStreamResource(s3Client.getObject(getObjectRequest));
        } catch (S3Exception e) {
            if (e.statusCode() == 404) {
                throw new FileNotFoundException("File not found in S3: " + fullKey);
            }
            throw new RuntimeException("Error fetching file from S3: " + e.getMessage(), e);
        }
    }

    /**
     * Deletes a file from S3.
     */
    public void delete(String fullKey) {
        try {
            DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(fullKey)
                    .build();
            s3Client.deleteObject(deleteObjectRequest);
        } catch (S3Exception e) {
            throw new RuntimeException("Could not delete file from S3: " + fullKey, e);
        }
    }

    /**
     * Sanitizes a filename by replacing spaces and special characters with underscores.
     * This prevents 400 Bad Request errors in S3 caused by problematic characters.
     */
    private String sanitizeFilename(String filename) {
        if (filename == null) return "file";
        // Replace spaces with underscores
        // Remove parentheses and other problematic characters but keep dots, hyphens and underscores
        return filename.replaceAll("[^a-zA-Z0-9.\\-_]", "_")
                      .replaceAll("_+", "_"); // Clean up multiple consecutive underscores
    }
}

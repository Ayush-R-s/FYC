package com.example.admin.content.service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.poi.xslf.usermodel.XMLSlideShow;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.example.admin.content.model.Note;
import com.example.admin.content.model.Video;
import com.example.admin.content.repository.ContentRepository;
import com.example.admin.content.repository.TestRepository;
import com.example.admin.content.repository.VideoRepository;
import com.example.admin.student.entity.Notification;
import com.example.admin.student.repository.NotificationRepository;
import com.example.admin.student.repository.VideoProgressRepository;

@Service
public class ContentService {

    private final ContentRepository repository;
    private final VideoRepository videoRepository;
    private final FileStorageService storageService;
    private final NotificationRepository notificationRepository;
    private final VideoProgressRepository videoProgressRepository;
    private final TestRepository testRepository;

    public ContentService(ContentRepository repository, VideoRepository videoRepository,
            FileStorageService storageService, NotificationRepository notificationRepository,
            VideoProgressRepository videoProgressRepository, TestRepository testRepository) {
        this.repository = repository;
        this.videoRepository = videoRepository;
        this.storageService = storageService;
        this.notificationRepository = notificationRepository;
        this.videoProgressRepository = videoProgressRepository;
        this.testRepository = testRepository;
    }

    public List<Object> getAllContent() {
        List<Object> allContent = new ArrayList<>();
        allContent.addAll(repository.findAll());
        allContent.addAll(videoRepository.findAll());
        return allContent;
    }

    public List<Note> getAllNotes() {
        return repository.findAll();
    }

    public List<Note> getNotesByType(String contentType) {
        return repository.findByContentType(contentType);
    }

    public List<Video> getAllVideos() {
        return videoRepository.findAll();
    }

    public Note uploadNotes(MultipartFile file, String title, String subject, String topic, Integer pages, String description, String contentType, String classLevel) {
        String path = storageService.save(file, "notes/");

        Note note = new Note();
        note.setTitle(title);
        note.setSubject(subject);
        note.setTopic(topic);
        note.setClassLevel(classLevel);
        note.setContentType(contentType != null ? contentType : "NOTES");
        
        // Automate page count if not provided or to ensure accuracy
        if (pages == null || pages <= 0) {
            pages = countPages(file);
        }
        
        note.setPages(pages);
        note.setContent(description);
        note.setFileName(file.getOriginalFilename());
        note.setFileUrl(path);
        note.setUploadedAt(LocalDateTime.now());

        Note savedNote = repository.save(note);
        
        // Create notification
        Notification notification = new Notification(
            "New " + subject + " " + note.getContentType().toLowerCase() + ": " + title,
            null // global notification
        );
        notificationRepository.save(notification);
        
        return savedNote;
    }

    public Map<String, String> generatePresignedVideoUploadUrl(String fileName, String contentType) {
        return storageService.generatePresignedUploadUrl(fileName, contentType, "videos/");
    }

    public Video uploadVideo(MultipartFile file, String filePath, String fileName, String title, String subject, String duration) {
        String path = filePath;
        String finalFileName = fileName;
        
        if (file != null && !file.isEmpty()) {
            path = storageService.save(file, "videos/");
            finalFileName = file.getOriginalFilename();
        }

        Video video = new Video();
        video.setTitle(title);
        video.setSubject(subject);
        video.setFileName(finalFileName);
        video.setFilePath(path);

        video.setDuration(duration);
        // createdAt is already set in Video constructor

        Video savedVideo = videoRepository.save(video);
        
        // Create notification
        Notification notification = new Notification(
            "New " + subject + " video: " + title,
            null // global notification
        );
        notificationRepository.save(notification);
        
        return savedVideo;
    }

    private Integer countPages(MultipartFile file) {
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null) return 0;
        
        String extension = originalFilename.substring(originalFilename.lastIndexOf(".")).toLowerCase();
        
        try {
            if (extension.equals(".pdf")) {
                try (PDDocument document = PDDocument.load(file.getInputStream())) {
                    return document.getNumberOfPages();
                }
            } else if (extension.equals(".docx")) {
                try (XWPFDocument document = new XWPFDocument(file.getInputStream())) {
                    return document.getProperties().getExtendedProperties().getUnderlyingProperties().getPages();
                }
            } else if (extension.equals(".pptx")) {
                try (XMLSlideShow document = new XMLSlideShow(file.getInputStream())) {
                    return document.getSlides().size();
                }
            }
        } catch (IOException e) {
            System.err.println("Error counting pages for " + originalFilename + ": " + e.getMessage());
        }
        return 0;
    }

    public Note updateNotes(Long id, MultipartFile file, String title, String subject, String topic,
            Integer pages, String description, String contentType, String classLevel) {
        Note note = repository.findById(id).orElseThrow(() -> new RuntimeException("Note not found"));
        note.setTitle(title);
        note.setSubject(subject);
        note.setTopic(topic);
        note.setClassLevel(classLevel);
        note.setContent(description);
        if (contentType != null) {
            note.setContentType(contentType);
        }
        if (file != null && !file.isEmpty()) {
            // Delete old file from S3 before uploading replacement
            if (note.getFileUrl() != null) {
                try { storageService.delete(note.getFileUrl()); } catch (Exception e) {
                    System.err.println("Warning: Failed to delete old note file from S3: " + e.getMessage());
                }
            }
            String path = storageService.save(file, "notes/");
            note.setFileName(file.getOriginalFilename());
            note.setFileUrl(path);
            note.setPages(countPages(file));
        } else if (pages != null) {
            note.setPages(pages);
        }
        return repository.save(note);
    }

    public Video updateVideo(Long id, MultipartFile file, String title, String subject, String duration) {
        Video video = videoRepository.findById(id).orElseThrow(() -> new RuntimeException("Video not found"));
        video.setTitle(title);
        video.setSubject(subject);
        video.setDuration(duration);
        if (file != null && !file.isEmpty()) {
            // Delete old file from S3 before uploading replacement
            if (video.getFilePath() != null) {
                try { storageService.delete(video.getFilePath()); } catch (Exception e) {
                    System.err.println("Warning: Failed to delete old video file from S3: " + e.getMessage());
                }
            }
            String path = storageService.save(file, "videos/");
            video.setFileName(file.getOriginalFilename());
            video.setFilePath(path);
        }
        return videoRepository.save(video);
    }

    @Transactional
    public void deleteContent(Long id) {
        Optional<Note> noteOpt = repository.findById(id);
        if (noteOpt.isPresent()) {
            Note note = noteOpt.get();
            if (note.getFileUrl() != null) {
                storageService.delete(note.getFileUrl());
            }
            repository.delete(note);
            return;
        }

        Optional<Video> videoOpt = videoRepository.findById(id);
        if (videoOpt.isPresent()) {
            Video video = videoOpt.get();
            
            // 1. Delete associated student progress records first (Foreign Key constraint)
            videoProgressRepository.deleteByVideoId(video.getId());
            
            // 2. Clear associations in test_videos join table
            testRepository.deleteVideoAssociations(video.getId());
            
            // 3. Delete physical file
            if (video.getFilePath() != null) {
                storageService.delete(video.getFilePath());
            }
            
            // 3. Delete database record
            videoRepository.delete(video);
        }
    }
}

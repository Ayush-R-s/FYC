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
import com.example.admin.content.model.PYQ;
import com.example.admin.content.model.Textbook;
import com.example.admin.content.model.Timetable;
import com.example.admin.content.model.Video;
import com.example.admin.content.repository.NoteRepository;
import com.example.admin.content.repository.PYQRepository;
import com.example.admin.content.repository.TestRepository;
import com.example.admin.content.repository.TextbookRepository;
import com.example.admin.content.repository.TimetableRepository;
import com.example.admin.content.repository.VideoRepository;
import com.example.admin.student.entity.Notification;
import com.example.admin.student.repository.NotificationRepository;
import com.example.admin.student.repository.VideoProgressRepository;

@Service
public class ContentService {

    private final NoteRepository noteRepository;
    private final TextbookRepository textbookRepository;
    private final PYQRepository pyqRepository;
    private final TimetableRepository timetableRepository;
    private final VideoRepository videoRepository;
    private final FileStorageService storageService;
    private final NotificationRepository notificationRepository;
    private final VideoProgressRepository videoProgressRepository;
    private final TestRepository testRepository;
    private final org.springframework.jdbc.core.JdbcTemplate jdbcTemplate;

    public ContentService(NoteRepository noteRepository,
            TextbookRepository textbookRepository,
            PYQRepository pyqRepository,
            TimetableRepository timetableRepository,
            VideoRepository videoRepository,
            FileStorageService storageService, 
            NotificationRepository notificationRepository,
            VideoProgressRepository videoProgressRepository, 
            TestRepository testRepository,
            org.springframework.jdbc.core.JdbcTemplate jdbcTemplate) {
        this.noteRepository = noteRepository;
        this.textbookRepository = textbookRepository;
        this.pyqRepository = pyqRepository;
        this.timetableRepository = timetableRepository;
        this.videoRepository = videoRepository;
        this.storageService = storageService;
        this.notificationRepository = notificationRepository;
        this.videoProgressRepository = videoProgressRepository;
        this.testRepository = testRepository;
        this.jdbcTemplate = jdbcTemplate;
    }

    @Transactional
    public void safeJavaMigration() {
        try {
            System.out.println("Starting heuristic Java migration for Textbooks and PYQs...");
            List<Note> allNotes = noteRepository.findAll();
            int pyqsMoved = 0;
            int tbMoved = 0;

            for (Note n : allNotes) {
                // 1. Identify PYQs: category == 'PYQ' or subject == 'PYQ'
                if ("PYQ".equalsIgnoreCase(n.getCategory()) || "PYQ".equalsIgnoreCase(n.getSubject())) {
                    PYQ p = new PYQ();
                    p.setTitle(n.getTitle());
                    p.setSubject("PYQ");
                    p.setCategory("PYQ");
                    
                    // Try to extract year from title or description; default if not found
                    String desc = n.getContent() != null ? n.getContent() : "";
                    String y = "Previous Years";
                    if (desc.contains(" - ")) {
                        y = desc.substring(desc.lastIndexOf("-") + 1).trim();
                    }
                    p.setYear(y);
                    
                    p.setFileName(n.getFileName());
                    p.setFileUrl(n.getFileUrl());
                    p.setUploadedBy(null); 
                    p.setUploadedAt(n.getUploadedAt());
                    pyqRepository.save(p);
                    noteRepository.delete(n);
                    pyqsMoved++;
                }
                // 2. Identify Textbooks: topic is null/empty AND (description equals subject OR it has no ' - ')
                else if ((n.getTopic() == null || n.getTopic().trim().isEmpty()) && 
                         (n.getContent() != null && n.getContent().equals(n.getSubject()))) {
                    Textbook tb = new Textbook();
                    tb.setTitle(n.getTitle());
                    tb.setSubject(n.getSubject());
                    tb.setCategory(n.getCategory());
                    tb.setFileName(n.getFileName());
                    tb.setFileUrl(n.getFileUrl());
                    tb.setUploadedBy(null);
                    tb.setUploadedAt(n.getUploadedAt());
                    textbookRepository.save(tb);
                    noteRepository.delete(n);
                    tbMoved++;
                }
            }
            System.out.println("Heuristic Migration Complete: " + pyqsMoved + " PYQs, " + tbMoved + " Textbooks moved.");
        } catch(Exception e) {
            System.err.println("Migration failed: " + e.getMessage());
            throw new RuntimeException("Migration failed: " + e.getMessage());
        }
    }

    public List<Object> getAllContent() {
        List<Object> allContent = new ArrayList<>();
        allContent.addAll(noteRepository.findAll());
        allContent.addAll(textbookRepository.findAll());
        allContent.addAll(pyqRepository.findAll());
        allContent.addAll(timetableRepository.findAll());
        allContent.addAll(videoRepository.findAll());
        return allContent;
    }

    public List<Note> getAllNotes() { return noteRepository.findAll(); }
    public List<Textbook> getAllTextbooks() { return textbookRepository.findAll(); }
    public List<PYQ> getAllPYQs() { return pyqRepository.findAll(); }
    public List<Timetable> getAllTimetables() { return timetableRepository.findAll(); }
    public List<Video> getAllVideos() { return videoRepository.findAll(); }

    // ====== UPLOAD ======

    public Note uploadNote(MultipartFile file, String title, String subject, String topic, Integer pages, String description, String category) {
        String path = storageService.save(file, "notes/");
        Note note = new Note();
        note.setTitle(title);
        note.setSubject(subject);
        note.setTopic(topic);
        note.setCategory((category == null || category.trim().isEmpty()) ? "11" : category.trim());
        if (pages == null || pages <= 0) pages = countPages(file);
        note.setPages(pages);
        note.setContent(description);
        note.setFileName(file.getOriginalFilename());
        note.setFileUrl(path);
        note.setUploadedAt(LocalDateTime.now());
        Note saved = noteRepository.save(note);
        notificationRepository.save(new Notification("New " + subject + " notes: " + title, null));
        return saved;
    }

    public Textbook uploadTextbook(MultipartFile file, String title, String subject, String category) {
        String path = storageService.save(file, "textbooks/");
        Textbook tb = new Textbook();
        tb.setTitle(title);
        tb.setSubject(subject);
        tb.setCategory((category == null || category.trim().isEmpty()) ? "11" : category.trim());
        tb.setFileName(file.getOriginalFilename());
        tb.setFileUrl(path);
        tb.setUploadedAt(LocalDateTime.now());
        Textbook saved = textbookRepository.save(tb);
        notificationRepository.save(new Notification("New " + subject + " textbook: " + title, null));
        return saved;
    }

    public PYQ uploadPYQ(MultipartFile file, String title, String year, String subject, String category) {
        String path = storageService.save(file, "pyqs/");
        PYQ pyq = new PYQ();
        pyq.setTitle(title);
        pyq.setYear(year);
        pyq.setSubject(subject != null ? subject : "PYQ");
        pyq.setCategory((category == null || category.trim().isEmpty()) ? "11" : category.trim());
        pyq.setFileName(file.getOriginalFilename());
        pyq.setFileUrl(path);
        pyq.setUploadedAt(LocalDateTime.now());
        PYQ saved = pyqRepository.save(pyq);
        notificationRepository.save(new Notification("New PYQ (" + year + "): " + title, null));
        return saved;
    }

    public Timetable uploadTimetable(MultipartFile file, String title, String category) {
        String path = storageService.save(file, "timetables/");
        Timetable tt = new Timetable();
        tt.setTitle(title);
        tt.setCategory((category == null || category.trim().isEmpty()) ? "11" : category.trim());
        tt.setFileName(file.getOriginalFilename());
        tt.setFileUrl(path);
        tt.setUploadedAt(LocalDateTime.now());
        Timetable saved = timetableRepository.save(tt);
        notificationRepository.save(new Notification("New Timetable added for Class " + tt.getCategory(), null));
        return saved;
    }

    public Map<String, String> generatePresignedVideoUploadUrl(String fileName, String contentType) {
        return storageService.generatePresignedUploadUrl(fileName, contentType, "videos/");
    }

    public Video uploadVideo(MultipartFile file, String filePath, String fileName, String title, String subject, String duration, String category) {
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
        video.setCategory((category == null || category.trim().isEmpty()) ? "11" : category.trim());
        Video saved = videoRepository.save(video);
        notificationRepository.save(new Notification("New " + subject + " video: " + title, null));
        return saved;
    }

    // ====== UPDATE ======

    public Note updateNote(Long id, MultipartFile file, String title, String subject, String topic, Integer pages, String description, String category) {
        Note note = noteRepository.findById(id).orElseThrow(() -> new RuntimeException("Note not found"));
        note.setTitle(title);
        note.setSubject(subject);
        note.setTopic(topic);
        note.setContent(description);
        if (category != null) note.setCategory(category);
        if (file != null && !file.isEmpty()) {
            if (note.getFileUrl() != null) try { storageService.delete(note.getFileUrl()); } catch (Exception e) {}
            String path = storageService.save(file, "notes/");
            note.setFileName(file.getOriginalFilename());
            note.setFileUrl(path);
            note.setPages(countPages(file));
        } else if (pages != null) {
            note.setPages(pages);
        }
        return noteRepository.save(note);
    }

    public Textbook updateTextbook(Long id, MultipartFile file, String title, String subject, String category) {
        Textbook tb = textbookRepository.findById(id).orElseThrow(() -> new RuntimeException("Textbook not found"));
        tb.setTitle(title);
        tb.setSubject(subject);
        if (category != null) tb.setCategory(category);
        if (file != null && !file.isEmpty()) {
            if (tb.getFileUrl() != null) try { storageService.delete(tb.getFileUrl()); } catch (Exception e) {}
            String path = storageService.save(file, "textbooks/");
            tb.setFileName(file.getOriginalFilename());
            tb.setFileUrl(path);
        }
        return textbookRepository.save(tb);
    }

    public PYQ updatePYQ(Long id, MultipartFile file, String title, String year, String subject, String category) {
        PYQ pyq = pyqRepository.findById(id).orElseThrow(() -> new RuntimeException("PYQ not found"));
        pyq.setTitle(title);
        pyq.setYear(year);
        pyq.setSubject(subject);
        if (category != null) pyq.setCategory(category);
        if (file != null && !file.isEmpty()) {
            if (pyq.getFileUrl() != null) try { storageService.delete(pyq.getFileUrl()); } catch (Exception e) {}
            String path = storageService.save(file, "pyqs/");
            pyq.setFileName(file.getOriginalFilename());
            pyq.setFileUrl(path);
        }
        return pyqRepository.save(pyq);
    }

    public Timetable updateTimetable(Long id, MultipartFile file, String title, String category) {
        Timetable tt = timetableRepository.findById(id).orElseThrow(() -> new RuntimeException("Timetable not found"));
        tt.setTitle(title);
        if (category != null) tt.setCategory(category);
        if (file != null && !file.isEmpty()) {
            if (tt.getFileUrl() != null) try { storageService.delete(tt.getFileUrl()); } catch (Exception e) {}
            String path = storageService.save(file, "timetables/");
            tt.setFileName(file.getOriginalFilename());
            tt.setFileUrl(path);
        }
        return timetableRepository.save(tt);
    }

    public Video updateVideo(Long id, MultipartFile file, String title, String subject, String duration, String category) {
        Video video = videoRepository.findById(id).orElseThrow(() -> new RuntimeException("Video not found"));
        video.setTitle(title);
        video.setSubject(subject);
        video.setDuration(duration);
        if (category != null) {
            video.setCategory(category);
        }
        if (file != null && !file.isEmpty()) {
            if (video.getFilePath() != null) {
                try { storageService.delete(video.getFilePath()); } catch (Exception e) {}
            }
            String path = storageService.save(file, "videos/");
            video.setFileName(file.getOriginalFilename());
            video.setFilePath(path);
        }
        return videoRepository.save(video);
    }

    // ====== DELETE ======

    @Transactional
    public void deleteNote(Long id) {
        noteRepository.findById(id).ifPresent(n -> {
            if (n.getFileUrl() != null) storageService.delete(n.getFileUrl());
            noteRepository.delete(n);
        });
    }

    @Transactional
    public void deleteTextbook(Long id) {
        textbookRepository.findById(id).ifPresent(tb -> {
            if (tb.getFileUrl() != null) storageService.delete(tb.getFileUrl());
            textbookRepository.delete(tb);
        });
    }

    @Transactional
    public void deletePYQ(Long id) {
        pyqRepository.findById(id).ifPresent(p -> {
            if (p.getFileUrl() != null) storageService.delete(p.getFileUrl());
            pyqRepository.delete(p);
        });
    }

    @Transactional
    public void deleteTimetable(Long id) {
        timetableRepository.findById(id).ifPresent(tt -> {
            if (tt.getFileUrl() != null) storageService.delete(tt.getFileUrl());
            timetableRepository.delete(tt);
        });
    }

    @Transactional
    public void deleteVideo(Long id) {
        videoRepository.findById(id).ifPresent(video -> {
            videoProgressRepository.deleteByVideoId(video.getId());
            testRepository.deleteVideoAssociations(video.getId());
            if (video.getFilePath() != null) storageService.delete(video.getFilePath());
            videoRepository.delete(video);
        });
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
}

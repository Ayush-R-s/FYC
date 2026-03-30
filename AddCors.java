import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.List;

public class AddCors {
    public static void main(String[] args) throws IOException {
        List<String> files = Arrays.asList(
            "c:\\Users\\ayush\\FYC\\backend\\src\\main\\java\\com\\example\\admin\\student\\controller\\UserProfileController.java",
            "c:\\Users\\ayush\\FYC\\backend\\src\\main\\java\\com\\example\\admin\\student\\controller\\TutorialController.java",
            "c:\\Users\\ayush\\FYC\\backend\\src\\main\\java\\com\\example\\admin\\student\\controller\\StudentDashboardController.java",
            "c:\\Users\\ayush\\FYC\\backend\\src\\main\\java\\com\\example\\admin\\student\\controller\\StudentRestController.java",
            "c:\\Users\\ayush\\FYC\\backend\\src\\main\\java\\com\\example\\admin\\student\\controller\\StudentController.java",
            "c:\\Users\\ayush\\FYC\\backend\\src\\main\\java\\com\\example\\admin\\student\\controller\\NotificationController.java",
            "c:\\Users\\ayush\\FYC\\backend\\src\\main\\java\\com\\example\\admin\\student\\controller\\DebugController.java",
            "c:\\Users\\ayush\\FYC\\backend\\src\\main\\java\\com\\example\\admin\\student\\controller\\NoteController.java",
            "c:\\Users\\ayush\\FYC\\backend\\src\\main\\java\\com\\example\\admin\\student\\controller\\ActivityFeedController.java",
            "c:\\Users\\ayush\\FYC\\backend\\src\\main\\java\\com\\example\\admin\\student\\controller\\ActivityController.java",
            "c:\\Users\\ayush\\FYC\\backend\\src\\main\\java\\com\\example\\admin\\report\\controller\\ReportController.java",
            "c:\\Users\\ayush\\FYC\\backend\\src\\main\\java\\com\\example\\admin\\gamification\\controller\\GamificationController.java",
            "c:\\Users\\ayush\\FYC\\backend\\src\\main\\java\\com\\example\\admin\\feedback\\controller\\FeedbackController.java",
            "c:\\Users\\ayush\\FYC\\backend\\src\\main\\java\\com\\example\\admin\\auth\\controller\\SigninController.java",
            "c:\\Users\\ayush\\FYC\\backend\\src\\main\\java\\com\\example\\admin\\controller\\DataController.java",
            "c:\\Users\\ayush\\FYC\\backend\\src\\main\\java\\com\\example\\admin\\controller\\LeaderboardController.java",
            "c:\\Users\\ayush\\FYC\\backend\\src\\main\\java\\com\\example\\admin\\controller\\DashboardController.java",
            "c:\\Users\\ayush\\FYC\\backend\\src\\main\\java\\com\\example\\admin\\auth\\controller\\AuthController.java",
            "c:\\Users\\ayush\\FYC\\backend\\src\\main\\java\\com\\example\\admin\\content\\controller\\StudentContentController.java",
            "c:\\Users\\ayush\\FYC\\backend\\src\\main\\java\\com\\example\\admin\\content\\controller\\TestController.java",
            "c:\\Users\\ayush\\FYC\\backend\\src\\main\\java\\com\\example\\admin\\content\\controller\\FileController.java",
            "c:\\Users\\ayush\\FYC\\backend\\src\\main\\java\\com\\example\\admin\\content\\controller\\ContentController.java",
            "c:\\Users\\ayush\\FYC\\backend\\src\\main\\java\\com\\example\\admin\\content\\controller\\AIController.java",
            "c:\\Users\\ayush\\FYC\\backend\\src\\main\\java\\com\\example\\admin\\analytics\\controller\\PerformanceController.java",
            "c:\\Users\\ayush\\FYC\\backend\\src\\main\\java\\com\\example\\admin\\analytics\\controller\\AnalyticsController.java"
        );

        for (String pathStr : files) {
            Path path = Paths.get(pathStr);
            if (!Files.exists(path)) {
                System.out.println("File not found: " + pathStr);
                continue;
            }

            String content = new String(Files.readAllBytes(path), "UTF-8");
            boolean modified = false;

            if (!content.contains("import org.springframework.web.bind.annotation.CrossOrigin;")) {
                content = content.replaceFirst("import ", "import org.springframework.web.bind.annotation.CrossOrigin;\nimport ");
                modified = true;
            }

            if (!content.contains("@CrossOrigin")) {
                if (content.contains("@RestController")) {
                    content = content.replace("@RestController", "@CrossOrigin(origins = \"*\")\n@RestController");
                    modified = true;
                } else if (content.contains("@Controller")) {
                    content = content.replace("@Controller", "@CrossOrigin(origins = \"*\")\n@Controller");
                    modified = true;
                }
            }

            if (modified) {
                Files.write(path, content.getBytes("UTF-8"));
                System.out.println("Updated " + pathStr);
            }
        }
    }
}

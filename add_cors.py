import os

files = [
    r"c:\Users\ayush\FYC\backend\src\main\java\com\example\admin\student\controller\UserProfileController.java",
    r"c:\Users\ayush\FYC\backend\src\main\java\com\example\admin\student\controller\TutorialController.java",
    r"c:\Users\ayush\FYC\backend\src\main\java\com\example\admin\student\controller\StudentDashboardController.java",
    r"c:\Users\ayush\FYC\backend\src\main\java\com\example\admin\student\controller\StudentRestController.java",
    r"c:\Users\ayush\FYC\backend\src\main\java\com\example\admin\student\controller\StudentController.java",
    r"c:\Users\ayush\FYC\backend\src\main\java\com\example\admin\student\controller\NotificationController.java",
    r"c:\Users\ayush\FYC\backend\src\main\java\com\example\admin\student\controller\DebugController.java",
    r"c:\Users\ayush\FYC\backend\src\main\java\com\example\admin\student\controller\NoteController.java",
    r"c:\Users\ayush\FYC\backend\src\main\java\com\example\admin\student\controller\ActivityFeedController.java",
    r"c:\Users\ayush\FYC\backend\src\main\java\com\example\admin\student\controller\ActivityController.java",
    r"c:\Users\ayush\FYC\backend\src\main\java\com\example\admin\report\controller\ReportController.java",
    r"c:\Users\ayush\FYC\backend\src\main\java\com\example\admin\gamification\controller\GamificationController.java",
    r"c:\Users\ayush\FYC\backend\src\main\java\com\example\admin\feedback\controller\FeedbackController.java",
    r"c:\Users\ayush\FYC\backend\src\main\java\com\example\admin\auth\controller\SigninController.java",
    r"c:\Users\ayush\FYC\backend\src\main\java\com\example\admin\controller\DataController.java",
    r"c:\Users\ayush\FYC\backend\src\main\java\com\example\admin\controller\LeaderboardController.java",
    r"c:\Users\ayush\FYC\backend\src\main\java\com\example\admin\controller\DashboardController.java",
    r"c:\Users\ayush\FYC\backend\src\main\java\com\example\admin\auth\controller\AuthController.java",
    r"c:\Users\ayush\FYC\backend\src\main\java\com\example\admin\content\controller\StudentContentController.java",
    r"c:\Users\ayush\FYC\backend\src\main\java\com\example\admin\content\controller\TestController.java",
    r"c:\Users\ayush\FYC\backend\src\main\java\com\example\admin\content\controller\FileController.java",
    r"c:\Users\ayush\FYC\backend\src\main\java\com\example\admin\content\controller\ContentController.java",
    r"c:\Users\ayush\FYC\backend\src\main\java\com\example\admin\content\controller\AIController.java",
    r"c:\Users\ayush\FYC\backend\src\main\java\com\example\admin\analytics\controller\PerformanceController.java",
    r"c:\Users\ayush\FYC\backend\src\main\java\com\example\admin\analytics\controller\AnalyticsController.java"
]

for path in files:
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
        
    modified = False
    if "import org.springframework.web.bind.annotation.CrossOrigin;" not in content:
        content = content.replace("import ", "import org.springframework.web.bind.annotation.CrossOrigin;\nimport ", 1)
        modified = True
        
    if "@CrossOrigin" not in content:
        content = content.replace("@RestController", "@CrossOrigin(origins = \"*\")\n@RestController")
        modified = True
        
    if modified:
        with open(path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Updated {path}")

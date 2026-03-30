import React, { createContext, useContext, useState, useEffect } from "react";
import { translations } from "../utils/translations";
import * as api from "../utils/api";


const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
    const [language, setLanguage] = useState("english");
    const [darkMode, setDarkMode] = useState(false);
    const [fontSize, setFontSize] = useState("medium");
    const [userProfile, setUserProfile] = useState(null);
    const [currentStudent, setCurrentStudent] = useState(null);
    const [dashboardData, setDashboardData] = useState({
        overallProgress: 0,
        accuracy: 0,
        speed: 0,
        tutorialCompletion: { completed: 0, total: 0, percentage: 0 },
        dailyMockScores: [],
        weeklyTestScores: [],
        subjectProgress: []
    });
    const [tutorials, setTutorials] = useState([]);
    const [notes, setNotes] = useState([]);
    const [history, setHistory] = useState([]);
    const [testHistory, setTestHistory] = useState([]);
    const [accuracySpeedDrilldown, setAccuracySpeedDrilldown] = useState({
        byDate: [],
        byWeekly: [],
        byTopic: [],
        bySubject: []
    });
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);

    const t = (key) => translations[language]?.[key] || translations.english[key];

    const applyFontSize = (size) => {
        setFontSize(size);
        const isMobile = window.innerWidth < 768;
        const base = isMobile ? 14 : 18;
        const offset = size === "small" ? -2 : size === "medium" ? 0 : 2;
        document.documentElement.style.fontSize = `${base + offset}px`;
    };

    const fetchData = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.log("No token found, skipping authenticated data fetch");
            return;
        }

        try {
            // Get logged-in user from localStorage
            const loggedInUser = (() => {
                try {
                    const student = localStorage.getItem('student');
                    if (student) return JSON.parse(student);
                    const user = localStorage.getItem('user');
                    if (user) return JSON.parse(user);
                } catch (e) {
                    console.error('Error parsing user data:', e);
                }
                return null;
            })();

            const [dashboardData, profileData, notesData, activitiesData] = await Promise.all([
                api.fetchDashboardData(),
                api.fetchUserProfile(),
                api.fetchNotes(),
                api.fetchActivities()
            ]);

            setDashboardData(dashboardData);

            // Map backend fields to frontend keys
            const mappedProfile = profileData ? {
                ...profileData,
                phone: profileData.mobile || "",
                enrolledDate: profileData.joinDate || "Not Available",
                totalStudyHours: profileData.videosWatched || 0 // or use videoTime if appropriate
            } : null;

            setUserProfile(mappedProfile);

            // Use logged-in user's name if available, otherwise use profile data or fallback
            setCurrentStudent({
                id: profileData?.id || loggedInUser?.id || 1,
                name: profileData?.name || loggedInUser?.name || "Guest User",
                accuracy: dashboardData?.accuracy || 0,
                speed: dashboardData?.speed || 0,
                overallProgress: dashboardData?.overallProgress || 0
            });
            setNotes((Array.isArray(notesData) ? notesData : []).map(note => ({
                ...note,
                date: note.uploadedAt ? note.uploadedAt.split('T')[0] : "Not Available"
            })));
            setHistory(Array.isArray(activitiesData) ? activitiesData : []);

            // Fetch videos and use them as tutorials
            const videosData = await api.fetchVideos();

            // Fetch video progress to determine completed status
            let progressMap = {};
            if (loggedInUser?.email) {
                try {
                    const progressData = await api.fetchVideoProgress(loggedInUser.email);
                    progressData.forEach(p => {
                        progressMap[p.videoId] = p;
                    });
                } catch (e) {
                    console.error('Error loading video progress for tutorials:', e);
                }
            }

            // Map videos to tutorials with completed status based on whether video is fully watched
            const mappedTutorials = (Array.isArray(videosData) ? videosData : []).map(video => ({
                id: video.id,
                name: video.title,
                subject: video.subject,
                // Mark as completed if the video has been fully watched (completed = true in progress)
                completed: progressMap[video.id]?.completed || false
            }));
            setTutorials(mappedTutorials);

            // Populate drilldown data from real dashboard metrics
            setAccuracySpeedDrilldown({
                byDate: Array.isArray(dashboardData.dailyMockScores) ? dashboardData.dailyMockScores.map(d => ({
                    date: d.date,
                    day: d.date, // Map date to day for LineChart
                    exam: "Mock Test",
                    accuracy: d.score,
                    speed: dashboardData.speed || 0
                })) : [],
                byWeekly: Array.isArray(dashboardData.weeklyTestScores) ? dashboardData.weeklyTestScores.map(w => ({
                    week: w.week,
                    accuracy: w.score,
                    speed: dashboardData.speed || 0
                })) : [],
                bySubject: Array.isArray(dashboardData.subjectProgress) ? dashboardData.subjectProgress.map((s, idx) => {
                    const colors = ['#f97316', '#fb923c', '#fdba74', '#fed7aa', '#ffedd5'];
                    return {
                        subject: s.subject,
                        name: s.subject, // Map subject to name for BarChart
                        value: s.progress, // Map progress to value
                        accuracy: s.progress,
                        speed: dashboardData.speed || 0,
                        color: colors[idx % colors.length]
                    };
                }) : [],
                byTopic: []
            });

            // Also ensure dashboardData itself has these mapped fields if components use them directly
            setDashboardData({
                ...dashboardData,
                dailyMockScores: Array.isArray(dashboardData.dailyMockScores) ? dashboardData.dailyMockScores.map(d => ({ ...d, day: d.date })) : [],
                subjectProgress: Array.isArray(dashboardData.subjectProgress) ? dashboardData.subjectProgress.map((s, idx) => {
                    const colors = ['#f97316', '#fb923c', '#fdba74', '#fed7aa', '#ffedd5'];
                    return {
                        ...s,
                        name: s.subject,
                        value: s.progress,
                        color: colors[idx % colors.length]
                    };
                }) : []
            });

            // Fetch full test history for detailed analytics
            if (loggedInUser?.email) {
                try {
                    const fullTestHistory = await api.fetchTestHistory(loggedInUser.email);
                    setTestHistory(fullTestHistory);
                } catch (e) {
                    console.error('Error fetching full test history:', e);
                }
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Simplified Dark Mode effect (Students only)
    useEffect(() => {
        localStorage.setItem('adminDarkMode', JSON.stringify(darkMode));
    }, [darkMode]);

    const addActivity = async (action, item) => {
        // Ensure values are not undefined or null
        const safeAction = action || "Activity";
        const safeItem = item || "General Update";

        const newActivity = {
            title: safeItem,          // Map item to title (Main Text)
            description: safeAction,  // Map action to description (Top Label)
            date: new Date().toISOString().split('T')[0],
            studentEmail: currentStudent?.email, // Add student email
            type: 'system'
        };

        try {
            const savedActivity = await api.addActivity(newActivity);
            setHistory(prev => [savedActivity, ...prev]);
        } catch (error) {
            console.error('Error adding activity:', error);
        }
    };

    const logout = () => {
        // Clear all auth and user related items from localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('student');
        localStorage.removeItem('user');
        localStorage.removeItem('adminName');
        localStorage.removeItem('adminEmail');
        localStorage.removeItem('userRole');

        // Reset state
        setUserProfile(null);
        setCurrentStudent(null);
        setDashboardData({
            overallProgress: 0,
            accuracy: 0,
            speed: 0,
            tutorialCompletion: { completed: 0, total: 0, percentage: 0 },
            dailyMockScores: [],
            weeklyTestScores: [],
            subjectProgress: []
        });
        setTutorials([]);
        setNotes([]);
        setHistory([]);
        setDarkMode(false);

        // Redirection should be handled by the calling component (navigate('/'))
    };

    const value = {
        language, setLanguage,
        darkMode, setDarkMode,
        fontSize, setFontSize,
        userProfile, setUserProfile,
        currentStudent, setCurrentStudent,
        dashboardData, setDashboardData,
        tutorials, setTutorials,
        notes, setNotes,
        history, setHistory,
        testHistory, setTestHistory,
        notificationsEnabled, setNotificationsEnabled,
        t,
        applyFontSize,
        addActivity,
        logout, // Add logout to context value
        refreshData: fetchData,
        accuracySpeedDrilldown // Also provided in context
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

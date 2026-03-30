import React, { useEffect } from "react";
import { useAppContext } from "../../context/AppContext";
import Dashboard from "../../components/Student/Dashboard";
import { getStudentCategory } from "../../utils/helpers";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const {
        darkMode,
        dashboardData,
        currentStudent,
        accuracySpeedDrilldown,
        testHistory,
        t,
        addActivity,
        refreshData
    } = useAppContext();

    useEffect(() => {
        refreshData();
    }, []);

    const navigate = useNavigate();

    const cardBg = darkMode ? "bg-slate-900/40 backdrop-blur-md" : "bg-white";
    const borderColor = darkMode ? "border-slate-800/60" : "border-orange-200";

    if (!dashboardData || !currentStudent) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            </div>
        );
    }

    return (
        <Dashboard
            mockDashboardData={dashboardData}
            accuracySpeedDrilldown={accuracySpeedDrilldown}
            currentStudent={currentStudent}
            getStudentCategory={getStudentCategory}
            setShowAccuracyDetail={() => navigate("/student/accuracy")}
            setShowTutorialDetail={() => navigate("/student/tutorials")}
            setShowLearningProgress={() => navigate("/student/progress")}
            testHistory={testHistory}
            darkMode={darkMode}
            cardBg={cardBg}
            borderColor={borderColor}
            t={t}
            addActivity={addActivity}
        />
    );
};

export default Home;

import React from "react";
import { useAppContext } from "../../context/AppContext";
import LearningProgress from "../../components/Student/LearningProgress";
import { useNavigate } from "react-router-dom";

const ProgressPage = () => {
    const {
        dashboardData,
        darkMode,
        t
    } = useAppContext();

    const navigate = useNavigate();

    const cardBg = darkMode ? "bg-slate-900/40 backdrop-blur-md" : "bg-white";
    const borderColor = darkMode ? "border-slate-800/60" : "border-orange-200";

    return (
        <LearningProgress
            mockDashboardData={dashboardData}
            onBack={() => navigate(-1)}
            darkMode={darkMode}
            cardBg={cardBg}
            borderColor={borderColor}
            t={t}
        />
    );
};

export default ProgressPage;

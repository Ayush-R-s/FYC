import React, { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import AccuracyDetail from "../../components/Student/AccuracyDetail";
import { useNavigate } from "react-router-dom";

const AccuracyPage = () => {
    const {
        accuracySpeedDrilldown,
        darkMode,
        t,
        addActivity
    } = useAppContext();

    const navigate = useNavigate();
    const [selectedSubjectFilter, setSelectedSubjectFilter] = useState("all");

    const cardBg = darkMode ? "bg-slate-900/40 backdrop-blur-md" : "bg-white";
    const borderColor = darkMode ? "border-slate-800/60" : "border-orange-200";

    return (
        <AccuracyDetail
            accuracySpeedDrilldown={accuracySpeedDrilldown}
            selectedSubjectFilter={selectedSubjectFilter}
            setSelectedSubjectFilter={setSelectedSubjectFilter}
            onBack={() => navigate(-1)}
            darkMode={darkMode}
            cardBg={cardBg}
            borderColor={borderColor}
            t={t}
            addActivity={addActivity}
        />
    );
};

export default AccuracyPage;

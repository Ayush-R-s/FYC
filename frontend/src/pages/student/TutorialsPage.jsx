import React, { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import TutorialDetail from "../../components/Student/TutorialDetail";
import { useNavigate } from "react-router-dom";

const TutorialsPage = () => {
    const {
        tutorials,
        darkMode,
        t,
        addActivity
    } = useAppContext();

    const navigate = useNavigate();
    const [selectedSubjectFilter, setSelectedSubjectFilter] = useState("all");

    const cardBg = darkMode ? "bg-slate-900/40 backdrop-blur-md" : "bg-white";
    const borderColor = darkMode ? "border-slate-800/60" : "border-orange-200";

    return (
        <TutorialDetail
            tutorialData={tutorials}
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

export default TutorialsPage;

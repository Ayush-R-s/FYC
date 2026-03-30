import React, { useState, useEffect } from "react";
import { useAppContext } from "../../context/AppContext";
import Settings from "../../components/Student/Settings";
import { fetchActivityFeed } from "../../utils/api";

const SettingsPage = () => {
    const {
        userProfile,
        language,
        setLanguage,
        fontSize,
        applyFontSize,
        darkMode,
        t
    } = useAppContext();

    const [editedProfile, setEditedProfile] = useState(userProfile || { name: "", phone: "", enrolledDate: "" });
    const [activityFeed, setActivityFeed] = useState([]);

    useEffect(() => {
        if (userProfile) {
            setEditedProfile(userProfile);
        }
    }, [userProfile]);

    useEffect(() => {
        const loadFeed = async () => {
            try {
                const data = await fetchActivityFeed();
                setActivityFeed(data);
            } catch (err) {
                console.error("Failed to load activity feed", err);
            }
        };
        loadFeed();
    }, []);

    const cardBg = darkMode ? "bg-slate-900/40 backdrop-blur-md" : "bg-white";
    const borderColor = darkMode ? "border-slate-800/60" : "border-orange-200";

    return (
        <Settings
            userProfile={userProfile}
            editedProfile={editedProfile}
            language={language}
            setLanguage={setLanguage}
            fontSize={fontSize}
            applyFontSize={applyFontSize}
            activityHistory={activityFeed}
            darkMode={darkMode}
            cardBg={cardBg}
            borderColor={borderColor}
            t={t}
            setActiveTab={() => { }} // Not needed with routing
        />
    );
};

export default SettingsPage;

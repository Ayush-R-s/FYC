import React from "react";
import { useAppContext } from "../../context/AppContext";
import Notes from "../../components/Student/Notes";
import { useState } from "react";
import { jsPDF } from "jspdf";
import { API_BASE_URL } from "../../services/axiosInstance";

const NotesPage = () => {
    const {
        notes,
        darkMode,
        t,
        addActivity
    } = useAppContext();

    const [noteSortOption, setNoteSortOption] = useState("date");
    const [selectedSubjectFilter, setSelectedSubjectFilter] = useState(null);

    const cardBg = darkMode ? "bg-slate-900/40 backdrop-blur-md" : "bg-white";
    const borderColor = darkMode ? "border-slate-800/60" : "border-orange-200";

    const downloadNote = async (note) => {
        if (note.fileUrl) {
            try {
                // If it's a real file, download it from the backend
                // Prefix with API_BASE_URL to ensure direct loading from the server
                // Encode filenames but preserve slashes to avoid 400 errors from web server
                const encodedKey = note.fileUrl.split('/').map(segment => encodeURIComponent(segment)).join('/');
                const fileUrl = `${API_BASE_URL}/admin/content/files/${encodedKey}`;
                const link = document.createElement('a');
                link.href = fileUrl;
                link.setAttribute('download', note.fileName || 'note.pdf');
                link.setAttribute('target', '_blank'); // Open in new tab if browser handles it
                document.body.appendChild(link);
                link.click();
                link.remove();
                addActivity("Downloaded Note", note.title);
                return;
            } catch (error) {
                console.error("Error downloading file", error);
            }
        }

        // Fallback to generating PDF if no fileUrl or if it fails
        const doc = new jsPDF()
        doc.setFont("helvetica", "bold")
        doc.setFontSize(22)
        doc.setTextColor(255, 102, 0)
        doc.text(note.title, 20, 20)
        doc.setDrawColor(255, 204, 153)
        doc.line(20, 25, 190, 25)
        doc.setFont("helvetica", "normal")
        doc.setFontSize(12)
        doc.setTextColor(100, 100, 100)
        doc.text(`${t("subject")}: ${t(note.subject?.toLowerCase()) || note.subject}`, 20, 35)
        doc.text(`${t("topic")}: ${note.topic || ""}`, 20, 42)
        doc.text(`${t("date")}: ${note.date || ""}`, 20, 49)
        doc.text(`${t("pages")}: ${note.pages || ""}`, 20, 56)
        doc.setFont("helvetica", "normal")
        doc.setFontSize(11)
        doc.setTextColor(50, 50, 50)
        const splitContent = doc.splitTextToSize(note.content || "", 170)
        doc.text(splitContent, 20, 70)
        doc.save(`${note.title.replace(/\s+/g, "_")}.pdf`)

        addActivity("Downloaded Note", note.title)
    }

    return (
        <Notes
            notes={notes}
            noteSortOption={noteSortOption}
            setNoteSortOption={setNoteSortOption}
            selectedSubjectFilter={selectedSubjectFilter}
            setSelectedSubjectFilter={setSelectedSubjectFilter}
            downloadNote={downloadNote}
            darkMode={darkMode}
            cardBg={cardBg}
            borderColor={borderColor}
            t={t}
            setActiveTab={() => { }} // Not needed with routing
        />
    );
};

export default NotesPage;

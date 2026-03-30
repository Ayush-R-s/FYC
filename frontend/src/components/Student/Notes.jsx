import React, { useState } from "react"
import { Download, Eye, X, Search, Calendar, FileText, Hash, ArrowLeft } from "lucide-react"
import FileViewerModal from "../ContentManagement/modals/FileViewerModal"

const ViewNoteModal = ({ note, onClose, darkMode, cardBg, borderColor, t }) => {
  if (!note) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
      <div className={`${cardBg} w-full max-w-2xl max-h-[85vh] overflow-hidden rounded-2xl border ${borderColor} shadow-xl flex flex-col animate-in zoom-in-95 duration-300`}>
        {/* Header */}
        <div className={`p-6 border-b ${darkMode ? "border-slate-800 bg-slate-900/80 backdrop-blur-md" : "border-orange-100 bg-orange-50/30"} flex items-start justify-between`}>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 bg-orange-500 text-white rounded-lg text-[9px] font-black uppercase tracking-widest">
                {note.subject}
              </span>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{note.date}</span>
            </div>
            <h2 className={`text-2xl font-black tracking-tight ${darkMode ? "text-slate-50" : "text-gray-900"}`}>{note.title}</h2>
            <p className="text-orange-500 font-bold text-[10px] uppercase tracking-widest mt-1">#{note.topic}</p>
          </div>
          <button onClick={onClose} className={`p-2 rounded-lg transition-colors ${darkMode ? "hover:bg-slate-800 text-slate-500 hover:text-slate-200" : "hover:bg-gray-100 text-gray-400"}`}>
            <X size={20} />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          <div className={`p-4 rounded-xl border ${darkMode ? "bg-slate-900/50 border-slate-800" : "bg-orange-50/50 border-orange-100"} flex items-center gap-4 text-xs font-bold`}>
            <div className="flex items-center gap-2">
              <FileText size={14} className="text-orange-500" />
              <span className={darkMode ? "text-slate-400" : "text-gray-600"}>{note.pages || 0} {t("pages")}</span>
            </div>
            <div className={`w-px h-3 ${darkMode ? "bg-slate-800" : "bg-gray-200"}`}></div>
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-orange-500" />
              <span className={darkMode ? "text-slate-400" : "text-gray-600"}>{t("released")}: {note.date}</span>
            </div>
          </div>

          <div className={`leading-relaxed whitespace-pre-wrap text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
            {note.content}
          </div>
        </div>

        {/* Footer */}
        <div className={`p-6 border-t ${darkMode ? "border-slate-800 bg-slate-900/80 backdrop-blur-md" : "border-gray-50 bg-gray-50/50"} flex items-center justify-end gap-3`}>
          <button onClick={onClose} className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-colors ${darkMode ? "text-slate-500 hover:text-slate-200" : "text-gray-500 hover:text-orange-600"}`}>
            {t("close")}
          </button>
        </div>
      </div>
    </div>
  )
}

const Notes = ({
  notes,
  noteSortOption,
  setNoteSortOption,
  selectedSubjectFilter,
  setSelectedSubjectFilter,
  downloadNote,
  darkMode,
  cardBg,
  borderColor,
  t,
  setActiveTab
}) => {
  const [selectedNote, setSelectedNote] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")

  const sortNotes = (notesToSort) => {
    return [...notesToSort].sort((a, b) => {
      if (noteSortOption === "date") return new Date(b.date) - new Date(a.date)
      return (a[noteSortOption] || "").localeCompare(b[noteSortOption] || "")
    })
  }

  const filteredNotes = notes.filter(note => {
    const matchesSubject = !selectedSubjectFilter || note.subject === selectedSubjectFilter
    const q = searchQuery.toLowerCase()
    return matchesSubject && ((note.title || "").toLowerCase().includes(q) || (note.content || "").toLowerCase().includes(q))
  })

  const sortedNotes = sortNotes(filteredNotes)
  const subjects = ["Physics", "Chemistry", "Zoology", "Botany"]

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 pt-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`p-2.5 rounded-xl transition-all ${darkMode
              ? "bg-slate-900 text-slate-400 hover:text-slate-100 border border-slate-800"
              : "bg-white text-orange-600 hover:bg-orange-50 border border-orange-100"
              } shadow-sm active:scale-95`}
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className={`text-3xl font-black tracking-tight ${darkMode ? "text-slate-50 drop-shadow-sm" : "text-gray-900"}`}>{t("viewNotes")}</h2>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">{t("resourceRepository")}</p>
          </div>
        </div>

        <div className="relative group w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" size={16} />
          <input
            type="text"
            placeholder={t("searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-2.5 rounded-xl border-2 ${borderColor} outline-none focus:border-orange-500 transition-all ${cardBg} ${darkMode ? "text-white" : "text-gray-800"} text-sm font-bold`}
          />
        </div>
      </div>

      <div className={`flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 ${darkMode ? "bg-slate-900/40" : "bg-gray-50/50"} p-1.5 rounded-2xl border ${borderColor}`}>
        <div className="flex gap-1 overflow-x-auto w-full lg:w-auto invisible-scrollbar">
          <button
            onClick={() => setSelectedSubjectFilter(null)}
            className={`px-5 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${selectedSubjectFilter === null
              ? (darkMode ? "bg-slate-800 text-orange-400 shadow-lg" : "bg-white text-orange-600 shadow-sm")
              : (darkMode ? "text-slate-500 hover:text-slate-300" : "text-gray-400 hover:text-orange-500")
              }`}
          >
            {t("all") || "All Resources"}
          </button>
          {subjects.map((s) => (
            <button
              key={s}
              onClick={() => setSelectedSubjectFilter(s)}
              className={`px-5 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${selectedSubjectFilter === s
                ? (darkMode ? "bg-slate-800 text-orange-400 shadow-lg" : "bg-white text-orange-600 shadow-sm")
                : (darkMode ? "text-slate-500 hover:text-slate-300" : "text-gray-400 hover:text-orange-500")
                }`}
            >
              {t(s.toLowerCase()) || s}
            </button>
          ))}
        </div>

        <div className={`flex items-center gap-2 px-3 py-1 ${darkMode ? "bg-slate-950/50 border-slate-800" : "bg-white/50 border-orange-100/50"} rounded-xl border w-full lg:w-auto`}>
          <span className="text-[9px] font-black uppercase text-gray-400 tracking-widest">{t("sortLabel")}:</span>
          <div className="flex gap-1">
            {["date", "topic", "subject"].map((opt) => (
              <button
                key={opt}
                onClick={() => setNoteSortOption(opt)}
                className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${noteSortOption === opt
                  ? (darkMode ? "bg-orange-500/10 text-orange-400" : "bg-orange-100 text-orange-700")
                  : (darkMode ? "text-slate-500 hover:text-slate-300" : "text-gray-400 hover:text-orange-500")
                  }`}
              >
                {t(opt) || opt}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedNotes.length > 0 ? (
          sortedNotes.map((note) => (
            <div
              key={note.id}
              className={`${cardBg} p-6 rounded-2xl border ${borderColor} shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col relative overflow-hidden`}
            >
              <div className="flex justify-between items-start mb-4">
                <span className={`px-2.5 py-1 ${darkMode ? "bg-orange-500/10 text-orange-400 border border-orange-500/20" : "bg-orange-50 text-orange-600 border border-orange-100"} rounded-lg text-[9px] font-black uppercase tracking-widest`}>
                  {note.subject}
                </span>
                <div className="flex items-center gap-1 text-[9px] text-gray-400 font-bold uppercase">
                  <Calendar size={12} />
                  {note.date}
                </div>
              </div>

              <h3 className={`text-xl font-black mb-1 group-hover:text-orange-500 transition-colors line-clamp-1 tracking-tight ${darkMode ? "text-slate-50" : "text-gray-900"}`}>{note.title}</h3>
              <p className="text-[9px] font-black text-orange-500 uppercase tracking-widest mb-4 inline-block">#{note.topic}</p>

              <p className={`leading-relaxed mb-6 line-clamp-2 text-xs font-medium flex-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{note.content}</p>

              <div className={`pt-4 border-t ${darkMode ? "border-slate-800" : "border-gray-50"} flex items-center justify-between`}>
                <div className="flex items-center gap-1 text-[9px] text-gray-400 font-black uppercase tracking-widest">
                  <FileText size={14} className="text-orange-400" />
                  {note.pages || 0} {t("pages")}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedNote(note)}
                    className={`p-2.5 ${darkMode ? "bg-slate-900 text-slate-500 hover:text-slate-200" : "bg-gray-50 text-gray-400"} rounded-xl hover:bg-orange-50 hover:text-orange-500 transition-all`}
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={() => downloadNote(note)}
                    className="p-2.5 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-all shadow-sm active:scale-95 flex items-center gap-2 px-4"
                  >
                    <Download size={16} />
                    <span className="text-[9px] font-black uppercase tracking-widest">{t("save")}</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4 text-gray-200">
              <Search size={32} />
            </div>
            <p className="text-lg font-black text-gray-400 uppercase tracking-widest">{t("noNotes")}</p>
          </div>
        )}
      </div>

      {selectedNote && selectedNote.fileUrl ? (
        <FileViewerModal
          file={{
            ...selectedNote,
            fileName: selectedNote.fileUrl
          }}
          darkMode={darkMode}
          onClose={() => setSelectedNote(null)}
        />
      ) : selectedNote ? (
        <ViewNoteModal
          note={selectedNote}
          onClose={() => setSelectedNote(null)}
          darkMode={darkMode}
          cardBg={cardBg}
          borderColor={borderColor}
          t={t}
        />
      ) : null}
    </div>
  )
}

export default Notes;
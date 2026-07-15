import React, { useState, useEffect } from "react"
import api from "../../services/axiosInstance"
import {
  UploadCloud,
  FileText,
  Loader2,
  Search,
  CheckCircle2,
  AlertCircle,
  Edit2,
  ChevronLeft,
  ChevronRight,
  Database,
  Info,
  X
} from "lucide-react"

export default function JestQuestionsPage() {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("")
  const [subjectFilter, setSubjectFilter] = useState("All")

  // Selection
  const [selectedQuestions, setSelectedQuestions] = useState([])

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 20

  // Edit Modal State
  const [editingQuestion, setEditingQuestion] = useState(null)

  // Drag and drop state
  const [dragActive, setDragActive] = useState(false)

  // Fetch initial questions count or existing questions from database
  const [dbQuestionsCount, setDbQuestionsCount] = useState(0)

  useEffect(() => {
    fetchDbQuestionsCount()
  }, [])

  const fetchDbQuestionsCount = async () => {
    try {
      const res = await api.get("/admin/iit-jee-questions")
      setDbQuestionsCount(res.data.length)
    } catch (err) {
      console.error("Failed to fetch database questions count", err)
    }
  }

  // Handle Drag & Drop Events
  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.type === "application/pdf") {
        await parseUploadedFile(file)
      } else {
        setError("Only PDF files are supported.")
      }
    }
  }

  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      await parseUploadedFile(file)
    }
  }

  const parseUploadedFile = async (file) => {
    setLoading(true)
    setError("")
    setSuccess("")
    setSelectedQuestions([])

    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await api.post("/admin/iit-jee-questions/parse", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      })
      setQuestions(res.data)
      setSelectedQuestions(res.data) // Auto-select all by default
      setSuccess(`Successfully parsed ${res.data.length} questions from the uploaded PDF!`)
      setCurrentPage(1)
    } catch (err) {
      setError(err.response?.data?.message || "Failed to parse the uploaded file. Please try again.")
    } finally {
      setLoading(false)
    }
  }


  const handleImportSelected = async () => {
    if (selectedQuestions.length === 0) return

    setIsSaving(true)
    setError("")
    setSuccess("")

    try {
      await api.post("/admin/iit-jee-questions/bulk-save", selectedQuestions)
      setSuccess(`Successfully imported ${selectedQuestions.length} questions into the database!`)
      setQuestions([])
      setSelectedQuestions([])
      fetchDbQuestionsCount()
    } catch (err) {
      setError(err.response?.data?.message || "Failed to import selected questions.")
    } finally {
      setIsSaving(false)
    }
  }

  // Checkbox toggle
  const toggleSelectQuestion = (q) => {
    if (selectedQuestions.some(item => item.questionNumber === q.questionNumber)) {
      setSelectedQuestions(selectedQuestions.filter(item => item.questionNumber !== q.questionNumber))
    } else {
      setSelectedQuestions([...selectedQuestions, q])
    }
  }

  const toggleSelectAll = (filteredList) => {
    const allFilteredSelected = filteredList.every(q =>
      selectedQuestions.some(item => item.questionNumber === q.questionNumber)
    )

    if (allFilteredSelected) {
      // Remove all filtered questions from selected
      const filteredNumbers = filteredList.map(q => q.questionNumber)
      setSelectedQuestions(selectedQuestions.filter(item => !filteredNumbers.includes(item.questionNumber)))
    } else {
      // Add all missing filtered questions
      const toAdd = filteredList.filter(q =>
        !selectedQuestions.some(item => item.questionNumber === q.questionNumber)
      )
      setSelectedQuestions([...selectedQuestions, ...toAdd])
    }
  }

  // Filter & Search Logic
  const filteredQuestions = questions.filter(q => {
    const matchesSearch =
      q.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.optionA.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.optionB.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.optionC.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.optionD.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesSubject =
      subjectFilter === "All" ||
      q.subject.toLowerCase() === subjectFilter.toLowerCase()

    return matchesSearch && matchesSubject
  })

  // Pagination Logic
  const totalPages = Math.ceil(filteredQuestions.length / pageSize)
  const paginatedQuestions = filteredQuestions.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  // Edit Question Modal actions
  const openEditModal = (q) => {
    setEditingQuestion({ ...q })
  }

  const saveEditedQuestion = () => {
    const updated = questions.map(q =>
      q.questionNumber === editingQuestion.questionNumber ? editingQuestion : q
    )
    setQuestions(updated)

    // Also update in selected list if selected
    if (selectedQuestions.some(item => item.questionNumber === editingQuestion.questionNumber)) {
      setSelectedQuestions(selectedQuestions.map(item =>
        item.questionNumber === editingQuestion.questionNumber ? editingQuestion : item
      ))
    }

    setEditingQuestion(null)
    setSuccess(`Question #${editingQuestion.questionNumber} updated locally!`)
  }

  // Subject Badge Style helper
  const getSubjectColor = (subject) => {
    switch (subject.toLowerCase()) {
      case "physics":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "chemistry":
        return "bg-emerald-50 text-emerald-700 border-emerald-200"
      case "biology":
        return "bg-rose-50 text-rose-700 border-rose-200"
      default:
        return "bg-slate-50 text-slate-700 border-slate-200"
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Title Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 p-6 rounded-2xl shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>📚</span> IIT JEE & Jest Question Portal
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Separate upload structure to parse standard objective questions and save them into a new dedicated table.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-slate-800/80 backdrop-blur border border-slate-700 px-4 py-2 rounded-xl text-center">
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Database Total</p>
            <p className="text-xl font-black text-orange-500">{dbQuestionsCount} Questions</p>
          </div>
        </div>
      </div>

      {/* Alert boxes */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-sm">Error Encountered</p>
            <p className="text-xs mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
          <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-sm">Action Successful</p>
            <p className="text-xs mt-0.5">{success}</p>
          </div>
        </div>
      )}

      {/* Portal Actions Cards */}
      <div className="w-full">

        {/* Upload card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
          <div>
            <h3 className="font-black text-slate-800 text-base">Parse Custom PDF File</h3>
            <p className="text-xs text-slate-500 mt-1">Drag and drop or select any PDF file matching the standard MCQ formatting.</p>
          </div>

          <div
            className={`mt-4 border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-all ${dragActive ? "border-orange-500 bg-orange-50/50" : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
              }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <UploadCloud className={`w-10 h-10 ${dragActive ? "text-orange-500 animate-bounce" : "text-slate-400"}`} />
            <p className="text-xs font-semibold text-slate-700 mt-3">Drag & drop your PDF file here, or</p>
            <label className="mt-2 cursor-pointer bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2 px-4 rounded-lg transition shadow-sm">
              Browse Files
              <input type="file" accept="application/pdf" className="hidden" onChange={handleFileChange} />
            </label>
            <p className="text-[10px] text-slate-400 mt-2">PDF files up to 50MB supported</p>
          </div>
        </div>
      </div>

      {/* Main questions viewer (only shows when questions list is loaded) */}
      {questions.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">

          {/* Header section with search, tabs, & selection stats */}
          <div className="p-4 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-50/50">
            {/* Filter Tabs */}
            <div className="flex gap-1 bg-slate-200/60 p-1 rounded-xl w-fit">
              {["All", "Physics", "Chemistry", "Biology"].map(tab => (
                <button
                  key={tab}
                  onClick={() => { setSubjectFilter(tab); setCurrentPage(1); }}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${subjectFilter === tab
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-950"
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Search Input & Action button */}
            <div className="flex flex-col sm:flex-row gap-3 flex-1 lg:max-w-xl">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search in questions text or options..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-xs bg-white focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>

              <button
                onClick={handleImportSelected}
                disabled={selectedQuestions.length === 0 || isSaving}
                className="bg-orange-500 hover:bg-orange-600 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-xs py-2 px-5 rounded-xl flex items-center justify-center gap-2 transition duration-200 shrink-0 shadow-sm"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Database className="w-3.5 h-3.5" />
                    Import Selected ({selectedQuestions.length})
                  </>
                )}
              </button>
            </div>
          </div>

          {/* List display */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs text-slate-600">
              <thead>
                <tr className="bg-slate-100/50 border-b border-slate-100 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4 w-12 text-center">
                    <input
                      type="checkbox"
                      className="rounded border-slate-300 text-orange-600 focus:ring-orange-500 w-4 h-4 cursor-pointer"
                      checked={
                        filteredQuestions.length > 0 &&
                        filteredQuestions.every(q => selectedQuestions.some(item => item.questionNumber === q.questionNumber))
                      }
                      onChange={() => toggleSelectAll(filteredQuestions)}
                    />
                  </th>
                  <th className="py-3 px-4 w-20">Number</th>
                  <th className="py-3 px-4 w-24">Subject</th>
                  <th className="py-3 px-4">Question Description</th>
                  <th className="py-3 px-4 w-24 text-center">Answer</th>
                  <th className="py-3 px-4 w-20 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedQuestions.map((q) => {
                  const isSelected = selectedQuestions.some(item => item.questionNumber === q.questionNumber)
                  const hasOptions = q.optionA || q.optionB || q.optionC || q.optionD

                  return (
                    <tr
                      key={q.questionNumber}
                      className={`hover:bg-slate-50/50 transition-colors ${isSelected ? "bg-orange-50/20" : ""
                        }`}
                    >
                      <td className="py-3.5 px-4 text-center">
                        <input
                          type="checkbox"
                          className="rounded border-slate-300 text-orange-600 focus:ring-orange-500 w-4 h-4 cursor-pointer"
                          checked={isSelected}
                          onChange={() => toggleSelectQuestion(q)}
                        />
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-800">#{q.questionNumber}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-full border text-[10px] font-black uppercase ${getSubjectColor(q.subject)}`}>
                          {q.subject}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 max-w-xl">
                        <p className="font-semibold text-slate-800 leading-relaxed break-words">{q.text}</p>

                        {hasOptions ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 pl-2 border-l-2 border-slate-100">
                            {q.optionA && (
                              <div className="flex gap-1.5 py-0.5">
                                <span className="font-bold text-slate-400">A:</span>
                                <span className="text-slate-600 break-words">{q.optionA}</span>
                              </div>
                            )}
                            {q.optionB && (
                              <div className="flex gap-1.5 py-0.5">
                                <span className="font-bold text-slate-400">B:</span>
                                <span className="text-slate-600 break-words">{q.optionB}</span>
                              </div>
                            )}
                            {q.optionC && (
                              <div className="flex gap-1.5 py-0.5">
                                <span className="font-bold text-slate-400">C:</span>
                                <span className="text-slate-600 break-words">{q.optionC}</span>
                              </div>
                            )}
                            {q.optionD && (
                              <div className="flex gap-1.5 py-0.5">
                                <span className="font-bold text-slate-400">D:</span>
                                <span className="text-slate-600 break-words">{q.optionD}</span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] text-amber-600 mt-2 bg-amber-50 px-2 py-0.5 border border-amber-100 rounded-md">
                            <Info className="w-3 h-3" /> Unstructured line block — saved as question text.
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="px-2.5 py-1 bg-slate-900 text-white rounded-lg font-black tracking-wider text-[10px] uppercase shadow-sm">
                          {q.correctOption}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => openEditModal(q)}
                          className="p-2 hover:bg-slate-100 text-slate-500 hover:text-slate-800 rounded-lg transition"
                          title="Edit Question details"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
              <span className="text-slate-500 text-xs">
                Showing <span className="font-bold text-slate-700">{(currentPage - 1) * pageSize + 1}</span> to{" "}
                <span className="font-bold text-slate-700">
                  {Math.min(currentPage * pageSize, filteredQuestions.length)}
                </span>{" "}
                of <span className="font-bold text-slate-700">{filteredQuestions.length}</span> parsed questions
              </span>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 border border-slate-200 rounded-lg bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <span className="text-xs text-slate-600 font-medium px-3">
                  Page <span className="font-bold">{currentPage}</span> of <span className="font-bold">{totalPages}</span>
                </span>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 border border-slate-200 rounded-lg bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Edit Question Modal */}
      {editingQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-black text-slate-800 text-base">
                Edit Question Details (Local Block #{editingQuestion.questionNumber})
              </h3>
              <button
                onClick={() => setEditingQuestion(null)}
                className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-black tracking-wider text-slate-400 mb-1">Subject</label>
                  <select
                    value={editingQuestion.subject}
                    onChange={(e) => setEditingQuestion({ ...editingQuestion, subject: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-orange-500"
                  >
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Biology">Biology</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-black tracking-wider text-slate-400 mb-1">Correct Answer</label>
                  <input
                    type="text"
                    value={editingQuestion.correctOption}
                    onChange={(e) => setEditingQuestion({ ...editingQuestion, correctOption: e.target.value })}
                    placeholder="e.g. A or B,C"
                    className="w-full p-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-black tracking-wider text-slate-400 mb-1">Question Stem</label>
                <textarea
                  rows="4"
                  value={editingQuestion.text}
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, text: e.target.value })}
                  className="w-full p-3 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-orange-500 leading-relaxed font-sans"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-black tracking-wider text-slate-400 mb-1">Option A</label>
                  <input
                    type="text"
                    value={editingQuestion.optionA}
                    onChange={(e) => setEditingQuestion({ ...editingQuestion, optionA: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-black tracking-wider text-slate-400 mb-1">Option B</label>
                  <input
                    type="text"
                    value={editingQuestion.optionB}
                    onChange={(e) => setEditingQuestion({ ...editingQuestion, optionB: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-black tracking-wider text-slate-400 mb-1">Option C</label>
                  <input
                    type="text"
                    value={editingQuestion.optionC}
                    onChange={(e) => setEditingQuestion({ ...editingQuestion, optionC: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-black tracking-wider text-slate-400 mb-1">Option D</label>
                  <input
                    type="text"
                    value={editingQuestion.optionD}
                    onChange={(e) => setEditingQuestion({ ...editingQuestion, optionD: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-2 bg-slate-50">
              <button
                onClick={() => setEditingQuestion(null)}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-600 font-bold text-xs rounded-xl transition"
              >
                Cancel
              </button>
              <button
                onClick={saveEditedQuestion}
                className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl transition shadow-sm"
              >
                Save Updates
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

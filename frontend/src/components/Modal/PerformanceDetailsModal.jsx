import { useState, useEffect } from "react"
import { getStudentById } from "../../services/studentService"
import { PieChart } from "../Charts"
import {
    User,
    BarChart3,
    BookOpen,
    ShieldCheck,
    Calendar,
    Mail,
    Phone,
    School,
    Clock,
    CheckCircle2,
    Search,
    History
} from 'lucide-react';

export default function PerformanceDetailsModal({
    student,
    isOpen,
    onClose,
    studentsData
}) {
    const [detailedStudent, setDetailedStudent] = useState(null);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');

    const activeStudent = detailedStudent ? { ...student, ...detailedStudent } : student;

    useEffect(() => {
        if (isOpen && student && (!student.subjects || student.subjects.length === 0)) {
            const fetchDetails = async () => {
                setLoading(true);
                try {
                    const data = await getStudentById(student.studentId || student.id);
                    setDetailedStudent(data);
                } catch (err) {
                    console.error("Failed to fetch student details in modal", err);
                } finally {
                    setLoading(false);
                }
            };
            fetchDetails();
        } else {
            setDetailedStudent(null);
        }
    }, [isOpen, student?.id, student?.studentId]);

    if (!isOpen || !student) return null

    // Theme Constants - Rich Aesthetics
    const glassEffect = "backdrop-blur-md bg-white/80 border border-white/20 shadow-xl"
    const textPrimary = "text-slate-900"
    const textSecondary = "text-slate-500"
    const accentGradient = "bg-gradient-to-r from-blue-600 to-indigo-600"
    const cardStyle = "bg-white rounded-2xl border border-slate-100 shadow-sm transition-all hover:shadow-md hover:border-slate-200"

    // Calculate chart data from student subjects - Test Distribution by Subject
    const chartData = (activeStudent.subjects || []).map(s => {
        const total = (s.passed || 0) + (s.failed || 0)
        return {
            subject: s.subject || s.name || "Unknown",
            passRate: total, // Use total tests for slice size
            attendancePercentile: s.passRate // Use actual pass rate for the "Attendance" tooltip slot (as a trick)
        }
    })

    // Filter to find rank
    const classStudents = studentsData || []
    const sortedStudents = [...classStudents].sort((a, b) => (b.passRate || 0) - (a.passRate || 0))
    const rank = sortedStudents.findIndex(s => s.id === activeStudent.id) + 1
    const percentile = Math.round(((classStudents.length - rank) / classStudents.length) * 100) || 0;

    const tabs = [
        { id: 'overview', name: 'Overview', icon: <User className="w-4 h-4" /> },
        { id: 'performance', name: 'Performance', icon: <BarChart3 className="w-4 h-4" /> },
        { id: 'content', name: 'Content & Activity', icon: <BookOpen className="w-4 h-4" /> },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-slate-950/40 backdrop-blur-md transition-all duration-300">
            <div
                className={`${glassEffect} w-full max-w-6xl h-full sm:h-auto max-h-[100dvh] sm:max-h-[90vh] rounded-none sm:rounded-[2rem] overflow-hidden sm:overflow-visible flex flex-col animate-in zoom-in-95 duration-200 shadow-2xl shadow-blue-900/10 relative`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button - Moved out of header for better visibility and fixed positioning */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-[60] p-2.5 rounded-xl bg-white/80 hover:bg-red-50 text-slate-500 hover:text-red-500 transition-all active:scale-95 shadow-lg border border-slate-100 backdrop-blur-md sm:-top-3 sm:-right-3 sm:bg-white"
                    aria-label="Close"
                >
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Header Section */}
                <div className="p-4 sm:p-8 border-b border-slate-100 bg-white/40 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sm:gap-6 relative">
                    {/* Background Glow */}
                    <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-100/50 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-indigo-100/50 rounded-full blur-3xl pointer-events-none" />

                    <div className="flex items-center gap-4 sm:gap-6 relative z-10 w-full sm:w-auto">
                        <div className="relative group shrink-0">
                            <div className={`w-14 h-14 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-xl sm:text-3xl font-black ${accentGradient} text-white shadow-2xl shadow-blue-500/30 transform transition-transform group-hover:scale-105 duration-300`}>
                                {student?.name?.charAt(0) || "?"}
                            </div>
                            <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-green-500 border-4 border-white shadow-sm" />
                        </div>
                        <div className="flex-1 min-w-0 pr-10 md:pr-0">
                            <div className="flex items-center flex-wrap gap-2 mb-1">
                                <h2 className={`text-xl sm:text-3xl font-black tracking-tight ${textPrimary} truncate`}>{student?.name || "Unknown Student"}</h2>
                                <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-blue-50 text-blue-600 rounded-full text-[8px] sm:text-[10px] font-bold tracking-widest uppercase shrink-0">
                                    {student?.status || "ACTIVE"}
                                </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-x-4 sm:gap-x-6 gap-y-1 sm:gap-y-2 text-xs sm:text-sm font-medium overflow-hidden">
                                <span className={`flex items-center gap-1.5 sm:gap-2 ${textSecondary} truncate`}>
                                    <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-500 shrink-0" />
                                    <span className="truncate">{student?.email}</span>
                                </span>
                                <span className={`flex items-center gap-1.5 sm:gap-2 ${textSecondary} shrink-0`}>
                                    <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-500" />
                                    {student?.mobile}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="px-4 sm:px-8 bg-white/60 border-b border-slate-100 overflow-x-auto no-scrollbar">
                    <div className="flex gap-4 sm:gap-8 min-w-max">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 py-3 sm:py-4 text-xs sm:text-sm font-bold border-b-2 transition-all relative ${activeTab === tab.id
                                    ? "text-blue-600 border-blue-600"
                                    : "text-slate-400 border-transparent hover:text-slate-600"
                                    }`}
                            >
                                {tab.icon}
                                {tab.name}
                                {activeTab === tab.id && (
                                    <div className="absolute -bottom-0.5 left-0 w-full h-0.5 bg-blue-600 blur-[1px]" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-50/30">
                    {/* OVERVIEW TAB */}
                    {activeTab === 'overview' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {/* Key Stats Grid */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                                <div className={`${cardStyle} p-6 bg-gradient-to-br from-emerald-500 to-teal-600 text-white relative overflow-hidden group`}>
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-500">
                                        <CheckCircle2 className="w-16 h-16" />
                                    </div>
                                    <p className="text-emerald-100 text-xs font-bold uppercase tracking-wider mb-2">Overall Pass Rate</p>
                                    <p className="text-4xl font-black mb-1">{activeStudent.passRate}%</p>
                                    <div className="flex items-center gap-2 text-emerald-100 text-xs font-medium">
                                        <div className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
                                            <div className="h-full bg-white shadow-[0_0_10px_white]" style={{ width: `${activeStudent.passRate}%` }} />
                                        </div>
                                        <span className="hidden sm:inline">Excellent</span>
                                    </div>
                                </div>

                                <div className={`${cardStyle} p-6 bg-gradient-to-br from-blue-500 to-indigo-600 text-white relative overflow-hidden group`}>
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-500">
                                        <History className="w-16 h-16" />
                                    </div>
                                    <p className="text-blue-100 text-xs font-bold uppercase tracking-wider mb-2">Tests Attempted</p>
                                    <p className="text-4xl font-black mb-1">{activeStudent.testsAttempted || 0}</p>
                                    <p className="text-blue-100 text-xs font-medium italic">Across {activeStudent.subjects?.length || 0} subjects</p>
                                </div>

                                <div className={`${cardStyle} p-6 bg-gradient-to-br from-purple-500 to-pink-600 text-white relative overflow-hidden group`}>
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-500">
                                        <Clock className="w-16 h-16" />
                                    </div>
                                    <p className="text-purple-100 text-xs font-bold uppercase tracking-wider mb-2">Total Study Time</p>
                                    <p className="text-4xl font-black mb-1">{activeStudent.videoTime || "0h 0m"}</p>
                                    <p className="text-purple-100 text-xs font-medium">Learning consistency is high</p>
                                </div>

                                <div className={`${cardStyle} p-6 bg-gradient-to-br from-orange-500 to-amber-600 text-white relative overflow-hidden group`}>
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-500">
                                        <Calendar className="w-16 h-16" />
                                    </div>
                                    <p className="text-orange-100 text-xs font-bold uppercase tracking-wider mb-2">Class Rank</p>
                                    <p className="text-4xl font-black mb-1">#{rank}</p>
                                    <p className="text-orange-100 text-xs font-medium">Top {100 - percentile}% of the batch</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Profile Details */}
                                <div className={`${cardStyle} p-8 bg-white`}>
                                    <h3 className="text-lg font-black mb-6 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                                            <User className="w-4 h-4 text-blue-600" />
                                        </div>
                                        Personal Profile
                                    </h3>
                                    <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                                        <div>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Full Name</p>
                                            <p className="font-bold text-slate-800">{activeStudent.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Student ID</p>
                                            <p className="font-mono font-bold text-indigo-600">{activeStudent.studentId || activeStudent.id}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Date of Birth</p>
                                            <p className="font-bold text-slate-800">{activeStudent.dob || "Not Provided"}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Phone Number</p>
                                            <p className="font-bold text-slate-800">{activeStudent.mobile}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Address</p>
                                            <p className="font-medium text-slate-800">{activeStudent.address || "Not Provided"}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Guardian Info */}
                                <div className={`${cardStyle} p-8 bg-indigo-50/30 border-indigo-100`}>
                                    <h3 className="text-lg font-black mb-6 flex items-center gap-3 text-indigo-900">
                                        <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                                            <ShieldCheck className="w-4 h-4 text-indigo-600" />
                                        </div>
                                        Guardian Details
                                    </h3>
                                    {activeStudent.guardianName ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 sm:gap-y-6">
                                            <div>
                                                <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest mb-1">Name</p>
                                                <p className="font-bold text-indigo-900">{activeStudent.guardianName}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest mb-1">Relation</p>
                                                <p className="font-bold text-indigo-900">{activeStudent.guardianRelation}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest mb-1">Mobile</p>
                                                <p className="font-bold text-indigo-900">{activeStudent.guardianMobile}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest mb-1">Email</p>
                                                <p className="font-bold text-indigo-900">{activeStudent.guardianEmail || "N/A"}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-40 text-center text-slate-400">
                                            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                                                <ShieldCheck className="w-6 h-6" />
                                            </div>
                                            <p className="text-sm italic">No guardian information recorded</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* PERFORMANCE TAB */}
                    {activeTab === 'performance' && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="lg:col-span-2 space-y-6">
                                {/* Subject Table */}
                                <div className={`${cardStyle} overflow-hidden`}>
                                    <div className="p-6 border-b border-slate-100 bg-white/50">
                                        <h3 className="font-black text-slate-800">Learning Analytics by Subject</h3>
                                    </div>
                                    <div className="p-0">
                                        {/* Desktop Table View */}
                                        <div className="hidden md:block">
                                            <table className="w-full">
                                                <thead className="bg-slate-50 border-b border-slate-100">
                                                    <tr className="text-left">
                                                        <th className="px-6 py-4 text-xs font-black uppercase text-slate-500">Subject</th>
                                                        <th className="px-6 py-4 text-center text-xs font-black uppercase text-slate-500">Performance</th>
                                                        <th className="px-6 py-4 text-right text-xs font-black uppercase text-slate-500">Total Exams</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100">
                                                    {(activeStudent.subjects || []).map((sub, i) => {
                                                        const total = (sub.passed || 0) + (sub.failed || 0);
                                                        const rate = total > 0 ? Math.round((sub.passed / total) * 100) : 0;
                                                        const subName = sub.subject || sub.name || "Unknown";
                                                        return (
                                                            <tr key={i} className="hover:bg-slate-50 transition-colors group">
                                                                <td className="px-6 py-4">
                                                                    <div className="flex items-center gap-4">
                                                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${subName === 'Physics' ? 'bg-blue-100 text-blue-600' :
                                                                            subName === 'Chemistry' ? 'bg-indigo-100 text-indigo-600' :
                                                                                'bg-rose-100 text-rose-600'
                                                                            }`}>
                                                                            {subName[0]}
                                                                        </div>
                                                                        <span className="font-bold text-slate-700">{subName}</span>
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4">
                                                                    <div className="flex items-center gap-4">
                                                                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                                                            <div
                                                                                className={`h-full rounded-full ${rate > 80 ? 'bg-emerald-500' :
                                                                                    rate > 50 ? 'bg-blue-500' : 'bg-rose-500'
                                                                                    }`}
                                                                                style={{ width: `${rate}%` }}
                                                                            />
                                                                        </div>
                                                                        <span className={`text-sm font-black min-w-[3rem] text-right ${rate > 80 ? 'text-emerald-600' :
                                                                            rate > 50 ? 'text-blue-600' : 'text-rose-600'
                                                                            }`}>{rate}%</span>
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 text-right">
                                                                    <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-black">{total}</span>
                                                                </td>
                                                            </tr>
                                                        )
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* Mobile Card View */}
                                        <div className="md:hidden divide-y divide-slate-100">
                                            {(activeStudent.subjects || []).map((sub, i) => {
                                                const total = (sub.passed || 0) + (sub.failed || 0);
                                                const rate = total > 0 ? Math.round((sub.passed / total) * 100) : 0;
                                                const subName = sub.subject || sub.name || "Unknown";
                                                return (
                                                    <div key={i} className="p-4 space-y-3">
                                                        <div className="flex justify-between items-center">
                                                            <div className="flex items-center gap-3">
                                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs ${subName === 'Physics' ? 'bg-blue-100 text-blue-600' :
                                                                    subName === 'Chemistry' ? 'bg-indigo-100 text-indigo-600' :
                                                                        'bg-rose-100 text-rose-600'
                                                                    }`}>
                                                                    {subName[0]}
                                                                </div>
                                                                <span className="font-bold text-slate-700 text-sm">{subName}</span>
                                                            </div>
                                                            <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-black">{total} Exams</span>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                                                <div
                                                                    className={`h-full rounded-full ${rate > 80 ? 'bg-emerald-500' :
                                                                        rate > 50 ? 'bg-blue-500' : 'bg-rose-500'
                                                                        }`}
                                                                    style={{ width: `${rate}%` }}
                                                                />
                                                            </div>
                                                            <span className={`text-xs font-black ${rate > 80 ? 'text-emerald-600' :
                                                                rate > 50 ? 'text-blue-600' : 'text-rose-600'
                                                                }`}>{rate}%</span>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>

                                {/* History */}
                                <div className={`${cardStyle} overflow-hidden`}>
                                    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                                        <h3 className="font-black text-slate-800">Exam History</h3>
                                    </div>
                                    <div className="p-0">
                                        {/* Desktop History View */}
                                        <div className="hidden md:block">
                                            <table className="w-full text-sm">
                                                <thead className="bg-slate-50/80 border-b border-slate-100">
                                                    <tr className="text-left">
                                                        <th className="px-6 py-4 text-xs font-black uppercase text-slate-500">Test</th>
                                                        <th className="px-6 py-4 text-center text-xs font-black uppercase text-slate-500">Score</th>
                                                        <th className="px-6 py-4 text-center text-xs font-black uppercase text-slate-500">Result</th>
                                                        <th className="px-6 py-4 text-right text-xs font-black uppercase text-slate-500">Date</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100">
                                                    {(activeStudent.detailedTestHistory || []).map((test, i) => (
                                                        <tr key={i} className="hover:bg-blue-50/30 transition-colors">
                                                            <td className="px-6 py-4">
                                                                <div className="font-bold text-slate-800">{test.test}</div>
                                                                <div className="text-[10px] text-slate-400 font-bold uppercase">{test.subject} • {test.testCategory}</div>
                                                            </td>
                                                            <td className="px-6 py-4 text-center font-black text-slate-700">{test.score}%</td>
                                                            <td className="px-6 py-4 text-center">
                                                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${test.status === 'Passed' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                                                                    }`}>
                                                                    {test.status}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 text-right text-xs font-bold text-slate-400">{test.date}</td>
                                                        </tr>
                                                    ))}
                                                    {(!activeStudent.detailedTestHistory || activeStudent.detailedTestHistory.length === 0) && (
                                                        <tr>
                                                            <td colSpan="4" className="px-6 py-8 text-center text-slate-400 italic">
                                                                {loading ? "Loading exam history..." : "No exam records found"}
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* Mobile History View */}
                                        <div className="md:hidden divide-y divide-slate-100">
                                            {(activeStudent.detailedTestHistory || []).map((test, i) => (
                                                <div key={i} className="p-4 space-y-3">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <div className="font-bold text-slate-800 text-sm">{test.test}</div>
                                                            <div className="text-[10px] text-slate-400 font-bold uppercase">{test.subject}</div>
                                                        </div>
                                                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tight ${test.status === 'Passed' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                                                            }`}>
                                                            {test.status}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between items-center text-xs">
                                                        <span className="text-slate-500 font-medium">{test.date}</span>
                                                        <span className="font-black text-slate-700">Score: {test.score}%</span>
                                                    </div>
                                                </div>
                                            ))}
                                            {(!activeStudent.detailedTestHistory || activeStudent.detailedTestHistory.length === 0) && (
                                                <div className="px-6 py-8 text-center text-slate-400 italic text-sm">
                                                    {loading ? "Loading exam history..." : "No exam records found"}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className={`${cardStyle} p-8 bg-white text-center`}>
                                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Score Distribution</h4>
                                    <div className="h-64 relative flex items-center justify-center">
                                        <PieChart data={chartData} />
                                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                            <span className="text-4xl font-black text-slate-800 leading-none">{activeStudent.testsAttempted || 0}</span>
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Exams</span>
                                        </div>
                                    </div>
                                    <div className="mt-8 grid grid-cols-2 gap-3">
                                        {chartData.map((d, i) => (
                                            <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                                                <div className={`w-3 h-3 rounded-full ${i === 0 ? 'bg-[#F1FAEE]' : i === 1 ? 'bg-[#A8DADC]' : 'bg-[#457B9D]'
                                                    }`} />
                                                <span className="text-xs font-bold text-slate-600">{d.subject}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="p-8 rounded-[2rem] bg-slate-900 text-white relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                                        <BarChart3 className="w-40 h-40" />
                                    </div>
                                    <p className="text-slate-400 font-black text-xs uppercase tracking-widest mb-6">Class standing</p>
                                    <div className="flex items-baseline gap-2 mb-8">
                                        <span className="text-6xl font-black italic">Rank #{rank}</span>
                                    </div>
                                    <div className="space-y-6">
                                        <div>
                                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2 text-slate-400">
                                                <span>Batch Percentile</span>
                                                <span className="text-blue-400">{percentile}%</span>
                                            </div>
                                            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                                <div className="h-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]" style={{ width: `${percentile}%` }} />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                                                <p className="text-[8px] font-black uppercase tracking-widest text-slate-500 mb-1">Grade</p>
                                                <p className="text-2xl font-black text-emerald-400">
                                                    {student.passRate >= 90 ? "A+" : student.passRate >= 80 ? "A" : "B"}
                                                </p>
                                            </div>
                                            <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                                                <p className="text-[8px] font-black uppercase tracking-widest text-slate-500 mb-1">Consistency</p>
                                                <p className="text-2xl font-black text-blue-400">HIGH</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* CONTENT & ACTIVITY TAB */}
                    {activeTab === 'content' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-left-4 duration-500">
                            <div className="space-y-8">
                                <div className={`${cardStyle} p-8`}>
                                    <h3 className="text-lg font-black mb-6 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                                            <BookOpen className="w-4 h-4 text-emerald-600" />
                                        </div>
                                        Learning Content Progress
                                    </h3>
                                    <div className="space-y-6">
                                        {activeStudent.tutorialProgress ? Object.entries(activeStudent.tutorialProgress).map(([key, progress], i) => {
                                            const name = key.charAt(0).toUpperCase() + key.slice(1);
                                            const percent = Math.round((progress.completed / progress.total) * 100) || 0;
                                            return (
                                                <div key={i} className="group">
                                                    <div className="flex justify-between items-center mb-3">
                                                        <span className="font-bold text-slate-700 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{name} Tutorial</span>
                                                        <span className="px-2 py-0.5 rounded-lg bg-blue-50 text-blue-600 text-[10px] font-black">{percent}% Completion</span>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                                                            <div
                                                                className={`h-full bg-gradient-to-r ${percent === 100 ? 'from-emerald-400 to-emerald-600' : 'from-blue-400 to-blue-600'
                                                                    }`}
                                                                style={{ width: `${percent}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-xs font-bold text-slate-400">{progress.completed}/{progress.total} videos</span>
                                                    </div>
                                                </div>
                                            )
                                        }) : (
                                            <p className="text-center text-slate-400 italic py-8">No tutorial data available</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className={`${cardStyle} p-8 bg-white flex flex-col`}>
                                <h3 className="text-lg font-black mb-6 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                                        <History className="w-4 h-4 text-orange-600" />
                                    </div>
                                    Activity Stream
                                </h3>
                                <div className="space-y-6 flex-1 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                    {activeStudent.activityLog && activeStudent.activityLog.length > 0 ? activeStudent.activityLog.map((log, i) => (
                                        <div key={i} className="flex gap-4 group">
                                            <div className="flex flex-col items-center">
                                                <div className={`w-3 h-3 rounded-full mt-1 ${log.action?.toLowerCase().includes('complete') ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' :
                                                    log.action?.toLowerCase().includes('started') ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.4)]' : 'bg-slate-300'
                                                    }`} />
                                                <div className="w-px flex-1 bg-slate-100 my-1 min-h-[2rem]" />
                                            </div>
                                            <div className="pb-4">
                                                <p className="text-sm font-bold text-slate-700 leading-tight group-hover:text-blue-600 transition-colors uppercase tracking-tight">{log.action}</p>
                                                <p className="text-[10px] font-bold text-slate-400 mt-1 italic flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {log.time}
                                                </p>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="flex flex-col items-center justify-center h-full text-slate-400 opacity-50">
                                            <Search className="w-8 h-8 mb-2" />
                                            <p className="text-sm font-medium">No recent activities found</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Section - Empty for clean aesthetics */}
                <div className="px-8 py-3 border-t border-slate-100 bg-white/60 flex justify-end items-center h-[60px]">
                </div>
            </div>
        </div>
    )
}

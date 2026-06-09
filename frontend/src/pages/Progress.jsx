import { useDashboard } from '../hooks/useDashboard';

import { StudentCard } from '../components/progress/StudentCard';
import PerformanceDetailsModal from '../components/Modal/PerformanceDetailsModal';
import { exportStudentsToCSV } from '../utils/exportUtils';
import { Icon } from '../components/Common/Icon';
import { ICONS } from '../utils/constants';

export default function Dashboard() {
    const {
        filteredStudents,
        searchTerm,
        setSearchTerm,
        viewMode,
        setViewMode,
        stats,
        selectedStudent,
        setSelectedStudent,
        dateRange,
        setDateRange,
        tests
    } = useDashboard();

    const handleExport = () => {
        exportStudentsToCSV(filteredStudents, viewMode, tests);
    };

    return (
        <>
            {/* Search & Export Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center
                     justify-between gap-4 bg-white p-4 rounded-xl
                     ring-1 ring-orange-100 mb-6">
                <div className="w-full sm:w-auto">
                    <div className="relative">
                        <Icon
                            path={ICONS.search}
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                        />
                        <input
                            type="text"
                            placeholder="Search students by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300
                        rounded-lg focus:outline-none focus:ring-2
                        focus:ring-orange-500 focus:border-transparent"
                        />
                    </div>
                </div>

                <button
                    onClick={handleExport}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-500
                    hover:bg-orange-600 text-white rounded-lg
                    transition-colors shadow-sm w-full sm:w-auto
                    justify-center"
                >
                    <Icon path={ICONS.download} />
                    <span>Export Performance Report</span>
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[
                    {
                        title: 'Avg Daily Score',
                        value: `${stats.avgScore}%`,
                        icon: ICONS.trend,
                        subtitle: `Across ${stats.totalStudents} students`
                    },
                    {
                        title: 'Tutorial Completion',
                        value: `${stats.tutorialCompletion}%`,
                        icon: ICONS.book,
                        progress: stats.tutorialCompletion,
                        subtitle: 'Overall progress'
                    },
                    {
                        title: 'Active Students',
                        value: stats.activeStudents,
                        icon: ICONS.activity,
                        status: 'active',
                        subtitle: 'Active today'
                    },
                    {
                        title: 'Total Enrolled',
                        value: stats.totalStudents,
                        icon: ICONS.activity,
                        subtitle: 'Registered students'
                    }
                ].map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-xl ring-1 ring-orange-100">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-600 text-sm">{stat.title}</span>
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center
                              ${index === 1 ? 'bg-orange-100' :
                                    index === 2 ? 'bg-green-100' : 'bg-orange-100'}`}>
                                <Icon path={stat.icon} className={`w-4 h-4 ${index === 2 ? 'text-green-600' : 'text-orange-600'}`} />
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                        {stat.progress !== undefined && (
                            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                                <div
                                    className="bg-orange-500 h-2 rounded-full"
                                    style={{ width: `${stat.progress}%` }}
                                ></div>
                            </div>
                        )}
                        <div className="text-xs text-gray-500">{stat.subtitle}</div>
                    </div>
                ))}
            </div>

            {/* View Mode Toggle */}
            <div className="bg-white p-4 rounded-xl ring-1 ring-orange-100 mb-6">
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setViewMode('daily')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${viewMode === 'daily'
                            ? 'bg-orange-500 text-white'
                            : 'text-gray-700 hover:bg-orange-50'
                            }`}
                    >
                        Daily Scores
                    </button>
                    <button
                        onClick={() => setViewMode('weekly')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${viewMode === 'weekly'
                            ? 'bg-orange-500 text-white'
                            : 'text-gray-700 hover:bg-orange-50'
                            }`}
                    >
                        Weekly Scores
                    </button>
                </div>
            </div>

            {/* Students List */}
            <div className="bg-white rounded-xl ring-1 ring-orange-100 overflow-hidden">
                {/* Desktop Table View */}
                <div className="hidden md:block">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-orange-100">
                            <thead className="bg-orange-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Score</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Trend</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tutorial Progress</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Last Active</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-orange-100">
                                {filteredStudents.map((student) => (
                                    <StudentCard
                                        key={student.id}
                                        student={student}
                                        viewMode={viewMode}
                                        onViewDetails={setSelectedStudent}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden divide-y divide-orange-50">
                    {filteredStudents.map((student) => {
                        const scores = viewMode === 'daily' ? student.dailyScores : student.weeklyScores;
                        const currentScore = scores[scores.length - 1];
                        const tutorialStats = Object.values(student.tutorialProgress);
                        const totalLessons = tutorialStats.reduce((sum, t) => sum + t.total, 0);
                        const completedLessons = tutorialStats.reduce((sum, t) => sum + t.completed, 0);
                        const tutorialCompletion = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

                        return (
                            <div key={student.id} className="p-4 space-y-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="font-bold text-gray-900">{student.name}</div>
                                        <div className="text-xs text-gray-500">{student.email}</div>
                                    </div>
                                    <span className={`text-xl font-black ${currentScore >= 90 ? 'text-green-600' :
                                        currentScore >= 75 ? 'text-orange-500' : 'text-red-600'
                                        }`}>
                                        {currentScore}%
                                    </span>
                                </div>
                                <div className="space-y-1.5">
                                    <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                        <span>Tutorial Progress</span>
                                        <span>{tutorialCompletion}%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden border border-gray-50">
                                        <div
                                            className="bg-orange-500 h-full rounded-full transition-all duration-500"
                                            style={{ width: `${tutorialCompletion}%` }}
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-between items-center pt-2">
                                    <span className="text-[10px] font-medium text-gray-400 italic">Active: {student.lastActive}</span>
                                    <button
                                        onClick={() => setSelectedStudent(student)}
                                        className="px-3 py-1.5 text-xs font-bold text-orange-600 bg-orange-50 hover:bg-orange-600 hover:text-white rounded-lg transition-all border border-orange-100 active:scale-95"
                                    >
                                        View Analytics
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {filteredStudents.length === 0 && (
                    <div className="p-10 text-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Icon path={ICONS.search} className="w-8 h-8 text-gray-300" />
                        </div>
                        <p className="text-gray-500 font-medium italic">No students match your search criteria</p>
                    </div>
                )}
            </div>

            {/* Unified Student Dashboard (PerformanceDetailsModal) */}
            <PerformanceDetailsModal
                student={selectedStudent}
                isOpen={!!selectedStudent}
                onClose={() => setSelectedStudent(null)}
                studentsData={filteredStudents}
                onUpdateSuccess={(updated) => {
                    setSelectedStudent(prev => prev ? { ...prev, ...updated } : prev);
                }}
            />
        </>
    );
}
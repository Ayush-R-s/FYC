import { Icon } from './Common/Icon';
import { ICONS } from '../utils/constants';
import { ProgressTrends } from './progress/ProgressTrends';
import { ActivityLog } from './progress/ActivityLog';

export const StudentDrawer = ({ student, onClose, viewMode, tests }) => {
    // Calculate tutorial completion stats
    const tutorialStats = Object.entries(student.tutorialProgress).map(([id, progress]) => ({
        id,
        name: id.charAt(0).toUpperCase() + id.slice(1),
        completed: progress.completed,
        total: progress.total,
        percentage: Math.round((progress.completed / progress.total) * 100),
        status: progress.completed === progress.total ? 'completed' :
            progress.completed > 0 ? 'in-progress' : 'not-started'
    }));

    // Calculate test scores
    const testResults = Object.entries(student.testScores).map(([testId, score]) => {
        const test = tests.find(t => t.id === testId);
        return {
            id: testId,
            name: test ? test.name : testId,
            type: test ? test.type : 'unknown',
            score,
            status: score >= 90 ? 'excellent' :
                score >= 75 ? 'good' :
                    score >= 50 ? 'average' : 'poor'
        };
    });

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-gray-900/50" onClick={onClose} />

            {/* Drawer */}
            <div className="absolute right-0 top-0 h-full w-full max-w-2xl bg-white shadow-xl flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-orange-100">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">{student.name}</h2>
                        <p className="text-gray-500">{student.email}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
                        <Icon path={ICONS.close} className="w-6 h-6" />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {/* Performance Trends */}
                    <div className="bg-orange-50 p-6 rounded-xl">
                        <h3 className="font-semibold text-gray-900 mb-4">Performance Trends</h3>
                        <ProgressTrends student={student} viewMode={viewMode} />
                    </div>

                    {/* Tutorial Progress */}
                    <div className="bg-white p-6 rounded-xl ring-1 ring-orange-100">
                        <h3 className="font-semibold text-gray-900 mb-4">Tutorial Completion</h3>
                        <div className="space-y-4">
                            {tutorialStats.map((tutorial) => (
                                <div key={tutorial.id} className="pb-4 border-b border-orange-100 last:border-0">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-medium text-gray-800">{tutorial.name}</span>
                                        <span className={`text-sm font-medium ${tutorial.status === 'completed' ? 'text-green-600' :
                                            tutorial.status === 'in-progress' ? 'text-orange-500' : 'text-gray-400'
                                            }`}>
                                            {tutorial.percentage}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full ${tutorial.status === 'completed' ? 'bg-green-500' :
                                                tutorial.status === 'in-progress' ? 'bg-orange-500' : 'bg-gray-300'
                                                }`}
                                            style={{ width: `${tutorial.percentage}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Test Results */}
                    <div className="bg-white p-6 rounded-xl ring-1 ring-orange-100">
                        <h3 className="font-semibold text-gray-900 mb-4">Test Results</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="border-b border-orange-100">
                                    <tr className="text-left text-gray-600 text-sm">
                                        <th className="px-4 py-2">Test Name</th>
                                        <th className="px-4 py-2">Type</th>
                                        <th className="px-4 py-2">Score</th>
                                        <th className="px-4 py-2">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {testResults.map((test) => (
                                        <tr key={test.id} className="border-b border-orange-50 last:border-0">
                                            <td className="px-4 py-3 font-medium text-gray-800">{test.name}</td>
                                            <td className="px-4 py-3 capitalize text-gray-600">{test.type}</td>
                                            <td className="px-4 py-3 font-bold">
                                                <span className={`${test.status === 'excellent' ? 'text-green-600' :
                                                    test.status === 'good' ? 'text-orange-500' :
                                                        test.status === 'average' ? 'text-yellow-500' : 'text-red-500'
                                                    }`}>
                                                    {test.score}%
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${test.status === 'excellent' ? 'bg-green-100 text-green-800' :
                                                    test.status === 'good' ? 'bg-orange-100 text-orange-800' :
                                                        test.status === 'average' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {test.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Activity Log */}
                    <ActivityLog activities={student.activityLog} />
                </div>

                {/* Export Button */}
                <div className="p-6 border-t border-orange-100 bg-gray-50">
                    <button
                        onClick={() => exportSingleStudent(student, tests)}
                        className="w-full flex items-center justify-center gap-2
                      px-4 py-3 bg-orange-500 hover:bg-orange-600
                      text-white rounded-lg transition-colors"
                    >
                        <Icon path={ICONS.download} />
                        Export Student Report
                    </button>
                </div>
            </div>
        </div>
    );
};

// Helper function for export
const exportSingleStudent = (student, tests) => {
    const headers = [
        'Student Name', 'Email', 'Test Name', 'Score', 'Tutorial', 'Completion %',
        'Activity', 'Timestamp'
    ];

    // Flatten test scores
    const testRows = Object.entries(student.testScores).map(([testId, score]) => {
        const test = tests.find(t => t.id === testId);
        return [
            student.name,
            student.email,
            test ? test.name : testId,
            score,
            '', '', '', ''
        ];
    });

    // Flatten tutorial progress
    const tutorialRows = Object.entries(student.tutorialProgress).map(([tutorialId, progress]) => {
        return [
            student.name,
            student.email,
            '',
            '',
            tutorialId.charAt(0).toUpperCase() + tutorialId.slice(1),
            `${Math.round((progress.completed / progress.total) * 100)}%`,
            '', ''
        ];
    });

    // Flatten activity log
    const activityRows = student.activityLog.map(activity => [
        student.name,
        student.email,
        '', '', '', '',
        activity.action,
        activity.time
    ]);

    // Combine all data
    const rows = [
        ...testRows,
        ...tutorialRows,
        ...activityRows
    ];

    // Convert to CSV
    const csv = [
        headers.join(','),
        ...rows.map(row => row.map(field => `"${field}"`).join(','))
    ].join('\n');

    // Download
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${student.name.replace(' ', '_')}_progress_report.csv`;
    a.click();
    URL.revokeObjectURL(url);
};

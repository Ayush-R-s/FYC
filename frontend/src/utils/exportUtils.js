/**
 * Utility to export student performance data to CSV
 * @param {Array} students List of student objects
 * @param {String} viewMode 'daily' or 'weekly'
 * @param {Array} tests List of all tests for metadata lookup
 */
export const exportStudentsToCSV = (students, viewMode, tests = []) => {
    if (!students || students.length === 0) {
        alert('No data available to export');
        return;
    }

    const headers = [
        'Student ID',
        'Student Name',
        'Email',
        'Current Score (%)',
        'Tutorial Progress (%)',
        'Last Active',
        'Test Scores Details'
    ];

    const rows = students.map(student => {
        // Calculate average score based on viewMode
        const scores = viewMode === 'daily' ? (student.dailyScores || []) : (student.weeklyScores || []);
        const currentScore = scores.length > 0
            ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
            : 0;

        // Calculate tunnel progress
        let tutorialProgress = 0;
        if (student.tutorialProgress) {
            const subjects = Object.values(student.tutorialProgress);
            if (subjects.length > 0) {
                const totalProgress = subjects.reduce(
                    (sum, p) => sum + (p.completed / (p.total || 1)) * 100,
                    0
                );
                tutorialProgress = Math.round(totalProgress / subjects.length);
            }
        }

        // Format test scores as a string
        const testDetails = Object.entries(student.testScores || {})
            .map(([id, score]) => {
                const test = tests.find(t => t.id === id);
                return `${test ? test.name : id}: ${score}%`;
            })
            .join(' | ');

        return [
            student.id,
            student.name,
            student.email,
            `${currentScore}%`,
            `${tutorialProgress}%`,
            student.lastActive,
            testDetails
        ];
    });

    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `student_performance_${viewMode}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

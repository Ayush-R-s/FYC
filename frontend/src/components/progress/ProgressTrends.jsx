export const ProgressTrends = ({ student, viewMode }) => {
    const scores = viewMode === 'daily' ? student.dailyScores : student.weeklyScores;
    const labels = viewMode === 'daily'
        ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        : ['Week 1', 'Week 2', 'Week 3', 'Week 4'];

    const maxScore = Math.max(...scores, 100);
    const minScore = Math.min(...scores, 0);

    return (
        <div className="space-y-6">
            {/* Score Trend Chart */}
            <div>
                <h4 className="text-sm font-medium text-gray-600 mb-2">
                    {viewMode === 'daily' ? 'Daily' : 'Weekly'} Test Scores
                </h4>
                <div className="flex items-end h-40 gap-1">
                    {scores.map((score, index) => (
                        <div key={index} className="flex flex-col items-center flex-1 group">
                            <div
                                className="w-full bg-orange-200 rounded-t-lg transition-colors group-hover:bg-orange-300"
                                style={{
                                    height: `${(score / maxScore) * 100}%`,
                                    minHeight: '8px'
                                }}
                            >
                                <div className="w-full h-2 bg-orange-500 rounded-t-lg"></div>
                            </div>
                            <span className="text-xs text-gray-500 mt-1">
                                {labels[index]}
                            </span>
                        </div>
                    ))}
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{minScore}%</span>
                    <span>{maxScore}%</span>
                </div>
            </div>

            {/* Tutorial Progress Trend */}
            <div>
                <h4 className="text-sm font-medium text-gray-600 mb-2">
                    Tutorial Completion Over Time
                </h4>
                <div className="space-y-3">
                    {Object.entries(student.tutorialProgress).map(([id, progress]) => (
                        <div key={id} className="flex items-center gap-3">
                            <div className="w-24 text-xs text-gray-600 capitalize">
                                {id}
                            </div>
                            <div className="flex-1 h-2 bg-gray-200 rounded-full">
                                <div
                                    className="h-2 bg-orange-500 rounded-full"
                                    style={{ width: `${progress.total > 0 ? (progress.completed / progress.total) * 100 : 0}%` }}
                                ></div>
                            </div>
                            <span className="text-xs font-medium text-gray-700 w-12 text-right">
                                {progress.completed}/{progress.total}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
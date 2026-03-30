import { Sparkline } from '../Common/Sparkline';

export const StudentCard = ({ student, viewMode, onViewDetails }) => {
    const scores = viewMode === 'daily' ? student.dailyScores : student.weeklyScores;
    const currentScore = scores[scores.length - 1];

    // Calculate overall tutorial completion
    const tutorialStats = Object.values(student.tutorialProgress);
    const totalLessons = tutorialStats.reduce((sum, t) => sum + t.total, 0);
    const completedLessons = tutorialStats.reduce((sum, t) => sum + t.completed, 0);
    const tutorialCompletion = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    return (
        <tr className="hover:bg-orange-50 transition-colors">
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="font-medium text-gray-900">{student.name}</div>
                <div className="text-sm text-gray-500">{student.email}</div>
            </td>

            <td className="px-6 py-4 whitespace-nowrap">
                <span className={`text-2xl font-bold ${currentScore >= 90 ? 'text-green-600' :
                    currentScore >= 75 ? 'text-orange-500' : 'text-red-600'
                    }`}>
                    {currentScore}%
                </span>
            </td>

            <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                <Sparkline data={scores} className="h-16" />
            </td>

            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-3">
                    <div className="flex-1 max-w-32">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                                className="bg-orange-500 h-2.5 rounded-full"
                                style={{ width: `${tutorialCompletion}%` }}
                            />
                        </div>
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                        {tutorialCompletion}%
                    </span>
                </div>
            </td>

            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                {student.lastActive}
            </td>

            <td className="px-6 py-4 whitespace-nowrap text-right">
                <button
                    onClick={() => onViewDetails(student)}
                    className="px-4 py-2 text-sm font-medium text-orange-600
                    hover:text-white hover:bg-orange-500 rounded-lg
                    transition-colors border border-orange-200
                    hover:border-orange-500"
                >
                    View Details
                </button>
            </td>
        </tr>
    );
};
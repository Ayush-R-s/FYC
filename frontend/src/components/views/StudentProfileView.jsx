import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import KPICard from '../Charts/KPICard';
import ChartCard from '../Charts/ChartCard';
import { apiService } from '../../services/apiService';

const StudentProfileView = ({ setCurrentView, selectedStudent, allStudents = [] }) => {
  const darkMode = false;
  const [tutorials, setTutorials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ cohortAvg: '--', percentile: '--' });

  const cardColor = 'bg-white';
  const textColor = 'text-gray-800';
  const textSecondary = 'text-gray-600';

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedStudent?.id || !selectedStudent?.email) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const [videos, progress] = await Promise.all([
          apiService.getVideos(),
          apiService.getVideoProgress(selectedStudent.email)
        ]);

        // Create a map for quick progress lookup
        const progressMap = {};
        progress.forEach(p => {
          progressMap[p.videoId] = p;
        });

        // Merge progress with videos
        const mergedTutorials = videos.map(video => {
          const p = progressMap[video.id] || {};
          return {
            name: video.title,
            subject: video.subject,
            progress: p.progress || 0,
            completed: p.completed || false,
            completedDate: p.completedDate || null // Adjust if backend provides this
          };
        });

        setTutorials(mergedTutorials);

        // Calculate Cohort Stats
        if (allStudents.length > 0) {
          const scores = allStudents.map(s => s.avgScore || 0);
          const avg = scores.reduce((a, b) => a + b, 0) / scores.length;

          // Percentile Rank: (count of scores < selected score) / total * 100
          const currentScore = selectedStudent.avgScore || 0;
          const belowCount = scores.filter(s => s < currentScore).length;
          const tiesCount = scores.filter(s => s === currentScore).length;
          // Standard percentile rank definition: (B + 0.5E) / n * 100
          const percentileVal = ((belowCount + (0.5 * tiesCount)) / scores.length) * 100;
          const topPercent = Math.round(100 - percentileVal);

          setStats({
            cohortAvg: Math.round(avg * 10) / 10,
            percentile: `Top ${topPercent}%`
          });
        }
      } catch (error) {
        console.error("Error fetching student profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedStudent?.id, selectedStudent?.email, allStudents]);

  if (!selectedStudent) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className={`text-lg ${textColor} mb-4`}>No student selected</div>
        <button
          onClick={() => setCurrentView('completion')}
          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-semibold"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className={`text-lg ${textColor}`}>Loading student profile...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-4">
        <button onClick={() => { setCurrentView('completion'); }} className="flex items-center gap-2 text-orange-600 hover:text-orange-800">
          <ArrowLeft size={20} />
          Back
        </button>
        <h2 className={`text-2xl font-bold ${textColor}`}>{selectedStudent.name}</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Completion Rate" value={`${selectedStudent.completionRate || 0}%`} darkMode={darkMode} />
        <KPICard title="Avg Score" value={Math.round((selectedStudent.avgScore || 0) * 10) / 10} darkMode={darkMode} />
        <div className={`${cardColor} p-4 sm:p-6 rounded-lg shadow-md border-l-4 border-orange-500`}>
          <p className={`${textSecondary} text-xs sm:text-sm font-semibold mb-2`}>Email</p>
          <p className={`text-sm font-medium ${darkMode ? 'text-orange-300' : 'text-orange-600'} truncate`}>{selectedStudent.email || 'N/A'}</p>
        </div>
        <KPICard title="Status" value="Active" darkMode={darkMode} />
      </div>

      <ChartCard title="Tutorial Progress" darkMode={darkMode}>
        {tutorials.length > 0 ? (
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {tutorials.map((tutorial, idx) => (
              <div key={idx} className="border-b border-gray-200 last:border-0 pb-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className={`font-medium ${textColor}`}>{tutorial.name}</span>
                    <p className={`text-xs ${textSecondary}`}>{tutorial.subject}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${tutorial.completed ? 'bg-green-100 text-green-800' : tutorial.progress > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                    {tutorial.completed ? '✓ Completed' : `${Math.round(tutorial.progress)}%`}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className={`h-2 rounded-full ${tutorial.completed ? 'bg-green-500' : 'bg-orange-500'}`} style={{ width: `${tutorial.progress || (tutorial.completed ? 100 : 0)}%` }} />
                </div>
                {tutorial.completedDate && <p className={`text-xs ${textSecondary} mt-1`}>Completed on {tutorial.completedDate}</p>}
              </div>
            ))}
          </div>
        ) : (
          <div className={`text-center py-12 ${textSecondary}`}>No tutorial progress data available</div>
        )}
      </ChartCard>

      <ChartCard title="Cohort Comparison" darkMode={darkMode}>
        <div className="mb-4">
          <p className={`text-sm ${textSecondary} mb-2`}>
            <strong>Percentile Rank:</strong> Shows how the student performs relative to the entire student body based on average score.
          </p>
          <p className={`text-sm ${textSecondary}`}>
            <strong>Cohort Average:</strong> The average score of all students tracked in analytics.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-orange-50 border border-orange-100 rounded-lg">
            <p className="text-2xl font-bold text-orange-600">{Math.round((selectedStudent.avgScore || 0) * 10) / 10}</p>
            <p className={`text-sm ${textSecondary}`}>Student Avg</p>
          </div>
          <div className="text-center p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-2xl font-bold text-gray-600">{stats.cohortAvg}</p>
            <p className={`text-sm ${textSecondary}`}>Cohort Avg</p>
          </div>
          <div className="text-center p-4 bg-green-50 border border-green-100 rounded-lg">
            <p className="text-2xl font-bold text-green-600">{stats.percentile}</p>
            <p className={`text-sm ${textSecondary}`}>Percentile Rank</p>
          </div>
        </div>
      </ChartCard>
    </div>
  );
};

export default StudentProfileView;
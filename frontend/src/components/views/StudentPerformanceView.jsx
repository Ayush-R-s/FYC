import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import ChartCard from '../Charts/ChartCard';
import { apiService } from '../../services/apiService';

const StudentPerformanceView = ({ setCurrentView, selectedStudent }) => {
  const darkMode = false;
  const [testHistory, setTestHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const textColor = 'text-gray-800';
  const textSecondary = 'text-gray-600';

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedStudent?.id) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const historyData = await apiService.getStudentTestHistory(selectedStudent.id);
        setTestHistory(historyData);
      } catch (error) {
        console.error("Error fetching test history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedStudent?.id]);

  if (!selectedStudent) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className={`text-lg ${textColor} mb-4`}>No student selected</div>
        <button
          onClick={() => setCurrentView('performance')}
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
        <div className={`text-lg ${textColor}`}>Loading test performance...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={() => {
            setCurrentView('performance');
          }}
          className="flex items-center gap-2 text-orange-600 hover:text-orange-800"
        >
          <ArrowLeft size={20} />
          Back
        </button>
        <h2 className={`text-2xl font-bold ${textColor}`}>{selectedStudent.name} - Test Performance</h2>
      </div>

      <ChartCard title="Individual Test History" darkMode={darkMode}>
        {testHistory.length > 0 ? (
          <div className="space-y-6">
            {testHistory.map((test, idx) => (
              <div key={idx} className="border-b border-gray-200 pb-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className={`font-semibold text-lg ${textColor}`}>{test.test}</h4>
                    <p className={`text-sm ${textSecondary}`}>{test.date} • {test.attempts} attempt{test.attempts > 1 ? 's' : ''}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-3xl font-bold ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>{test.score}</p>
                    <p className={`text-xs ${textSecondary}`}>out of 100</p>
                  </div>
                </div>
                {test.topicScores && Object.keys(test.topicScores).length > 0 && (
                  <div>
                    <p className={`text-sm font-semibold mb-2 ${textColor}`}>Topic-wise Breakdown</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {Object.entries(test.topicScores).map(([topic, score], idx) => (
                        <div key={idx} className="bg-gray-50 p-3 rounded-lg">
                          <p className={`text-xs ${textSecondary} mb-1 truncate`}>{topic}</p>
                          <p className={`text-lg font-bold ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>{score}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className={`text-center py-12 ${textSecondary}`}>No test history available</div>
        )}
      </ChartCard>

      <ChartCard title="Performance vs Cohort Average" darkMode={darkMode}>
        <div className="mb-4">
          <p className={`text-sm ${textSecondary} mb-2`}>
            Comparison of student performance against the cohort average
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <p className="text-2xl font-bold text-orange-600">{selectedStudent.avgScore || 0}</p>
            <p className={`text-sm ${textSecondary}`}>Student Avg</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-600">{selectedStudent.cohortAvg || '--'}</p>
            <p className={`text-sm ${textSecondary}`}>Cohort Avg</p>
          </div>
        </div>
      </ChartCard>
    </div>
  );
};

export default StudentPerformanceView;
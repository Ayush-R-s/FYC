import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import ChartCard from '../Charts/ChartCard';
import { apiService } from '../../services/apiService';
import { analyticsService } from '../../services/analyticsService';

import { getAllStudents } from '../../services/studentService';

const PerformanceDrilldownView = ({ setCurrentView, setSelectedStudent, initialStudents, initialAnalyticsStudents }) => {
  const darkMode = false;
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(!(initialStudents && initialAnalyticsStudents));

  const textColor = 'text-gray-800';
  const textSecondary = 'text-gray-600';

  useEffect(() => {
    const processData = (masterStudents, analyticsData) => {
      // Create a map of analytics data for quick lookup
      const analyticsMap = new Map((analyticsData || []).map(s => [s.id, s]));

      // Merge master list with analytics, defaulting missing values to 0
      const mergedStudents = (Array.isArray(masterStudents) ? masterStudents : []).map(student => {
        const stats = analyticsMap.get(student.id) || {};
        return {
          ...student,
          avgScore: stats.avgScore || 0,
          completionRate: stats.completionRate || 0
        };
      });
      setStudents(mergedStudents);
    };

    if (initialStudents && initialAnalyticsStudents) {
      processData(initialStudents, initialAnalyticsStudents);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch both master student list and analytics data
        const [masterStudents, analyticsData] = await Promise.all([
          getAllStudents(),
          analyticsService.getStudents()
        ]);

        processData(masterStudents, analyticsData);
      } catch (error) {
        console.error("Error fetching students:", error);
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [initialStudents, initialAnalyticsStudents]);

  const handleViewDetails = (student) => {
    setSelectedStudent(student);
    setCurrentView('student-performance');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className={`text-lg ${textColor}`}>Loading performance data...</div>
      </div>
    );
  }

  // Sort students by average score (highest first)
  const sortedStudents = [...students].sort((a, b) => (b.avgScore || 0) - (a.avgScore || 0));
  const topPerformer = sortedStudents[0];
  const classAverage = students.length > 0
    ? Math.round(students.reduce((sum, s) => sum + (s.avgScore || 0), 0) / students.length)
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={() => {
            setCurrentView('overview');
          }}
          className="flex items-center gap-2 text-orange-600 hover:text-orange-800"
        >
          <ArrowLeft size={20} />
          Back
        </button>
        <h2 className={`text-2xl font-bold ${textColor}`}>Test Performance Analysis</h2>
      </div>

      <ChartCard title="Student Performance Ranking" darkMode={darkMode}>
        <div className="mb-4">
          <p className={`text-sm ${textSecondary}`}>
            Students ranked by their average test scores. Click "View Details" to see individual performance breakdown.
          </p>
        </div>

        {sortedStudents.length > 0 ? (
          <div className="overflow-x-auto">
            <table className={`w-full text-sm`}>
              <thead>
                <tr className="border-b border-gray-200">
                  <th className={`text-left p-3 font-semibold ${textColor}`}>Rank</th>
                  <th className={`text-left p-3 font-semibold ${textColor}`}>Student</th>
                  <th className={`text-left p-3 font-semibold ${textColor}`}>Avg Score</th>
                  <th className={`text-left p-3 font-semibold ${textColor}`}>Completion Rate</th>
                  <th className={`text-left p-3 font-semibold ${textColor}`}>Action</th>
                </tr>
              </thead>
              <tbody>
                {sortedStudents.map((student, idx) => (
                  <tr key={student.id} className="border-b hover:bg-gray-50">
                    <td className={`p-3 font-semibold ${textColor}`}>
                      <div className="flex items-center">
                        <span className={`w-8 h-8 flex items-center justify-center rounded-full ${idx === 0 ? 'bg-yellow-100 text-yellow-800' :
                          idx === 1 ? 'bg-gray-100 text-gray-800' :
                            idx === 2 ? 'bg-orange-100 text-orange-800' :
                              'bg-blue-100 text-blue-800'
                          }`}>
                          #{idx + 1}
                        </span>
                      </div>
                    </td>
                    <td className={`p-3 ${textColor}`}>
                      <div>
                        <div className="font-medium">{student.name}</div>
                        <div className={`text-xs ${textSecondary}`}>{student.email}</div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-3">
                          <div
                            className={`h-3 rounded-full ${(student.avgScore || 0) >= 90 ? 'bg-green-500' :
                              (student.avgScore || 0) >= 80 ? 'bg-blue-500' :
                                (student.avgScore || 0) >= 70 ? 'bg-orange-500' :
                                  'bg-red-500'
                              }`}
                            style={{ width: `${student.avgScore || 0}%` }}
                          />
                        </div>
                        <span className={`font-semibold ${(student.avgScore || 0) >= 90 ? 'text-green-600' :
                          (student.avgScore || 0) >= 80 ? 'text-blue-600' :
                            (student.avgScore || 0) >= 70 ? 'text-orange-600' :
                              'text-red-600'
                          }`}>
                          {student.avgScore || 0}
                        </span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${student.completionRate || 0}%` }} />
                        </div>
                        <span className={`text-sm ${textColor}`}>{student.completionRate || 0}%</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => handleViewDetails(student)}
                        className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-semibold transition-colors"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className={`text-center py-12 ${textSecondary}`}>No student data available</div>
        )}
      </ChartCard>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ChartCard title="Top Performer" darkMode={darkMode}>
          <div className="text-center py-6">
            {topPerformer ? (
              <>
                <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 text-yellow-800 rounded-full flex items-center justify-center text-2xl font-bold">
                  #1
                </div>
                <h4 className={`text-xl font-bold ${textColor} mb-1`}>{topPerformer.name}</h4>
                <p className={`text-sm ${textSecondary} mb-3`}>Avg Score: {topPerformer.avgScore || 0}</p>
                <button
                  onClick={() => handleViewDetails(topPerformer)}
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-semibold"
                >
                  View Profile
                </button>
              </>
            ) : (
              <p className={textSecondary}>No data available</p>
            )}
          </div>
        </ChartCard>

        <ChartCard title="Class Average" darkMode={darkMode}>
          <div className="text-center py-6">
            <div className="text-5xl font-bold text-orange-500 mb-2">
              {classAverage}
            </div>
            <p className={`text-sm ${textSecondary}`}>Class Average Score</p>
            <div className="mt-4 text-left">
              <p className={`text-xs ${textSecondary}`}>Students: {students.length}</p>
            </div>
          </div>
        </ChartCard>

        <ChartCard title="Performance Distribution" darkMode={darkMode}>
          <div className="space-y-3">
            {[
              { range: '90-100', count: students.filter(s => (s.avgScore || 0) >= 90).length, color: 'bg-green-500' },
              { range: '80-89', count: students.filter(s => (s.avgScore || 0) >= 80 && (s.avgScore || 0) < 90).length, color: 'bg-blue-500' },
              { range: '70-79', count: students.filter(s => (s.avgScore || 0) >= 70 && (s.avgScore || 0) < 80).length, color: 'bg-orange-500' },
              { range: 'Below 70', count: students.filter(s => (s.avgScore || 0) < 70).length, color: 'bg-red-500' }
            ].map((item, idx) => (
              <div key={idx}>
                <div className="flex justify-between mb-1">
                  <span className={`text-xs ${textColor}`}>{item.range}</span>
                  <span className={`text-xs ${textSecondary}`}>{item.count} students</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className={`h-2 rounded-full ${item.color}`} style={{
                    width: students.length > 0 ? `${(item.count / students.length) * 100}%` : '0%'
                  }} />
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>
    </div>
  );
};

export default PerformanceDrilldownView;
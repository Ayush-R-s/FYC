import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { ResponsiveContainer, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Bar } from 'recharts';
import ChartCard from '../Charts/ChartCard';
import { apiService } from '../../services/apiService';
import { analyticsService } from '../../services/analyticsService';
import { getAllStudents } from '../../services/studentService';
import { getCompletionDataSync } from '../../services/dataHelpers';

const CompletionDrilldownView = ({
  setCurrentView,
  setSelectedStudent,
  completionFilters,
  setCompletionFilters,
  initialStudents,
  initialAnalyticsStudents
}) => {
  const darkMode = false;
  const [students, setStudents] = useState([]);
  const [completionData, setCompletionData] = useState([]);
  const [loading, setLoading] = useState(!(initialStudents && initialAnalyticsStudents));

  const cardColor = 'bg-white';
  const textColor = 'text-gray-800';
  const textSecondary = 'text-gray-600';

  useEffect(() => {
    const processStudents = (masterStudents, analyticsStudentsResult) => {
      const analyticsMap = new Map(analyticsStudentsResult.map(s => [s.id, s]));

      const mergedStudents = (Array.isArray(masterStudents) ? masterStudents : []).map(student => {
        const analytics = analyticsMap.get(student.id) || {};
        return {
          ...student,
          completionRate: analytics.completionRate || 0,
        };
      });

      setStudents(mergedStudents);
    };

    const fetchData = async () => {
      if (!initialStudents || !initialAnalyticsStudents) setLoading(true);
      try {
        const [masterStudents, analyticsStudentsResult, completionRes] = await Promise.all([
          initialStudents ? Promise.resolve(initialStudents) : getAllStudents(),
          initialAnalyticsStudents ? Promise.resolve(initialAnalyticsStudents) : analyticsService.getStudents(),
          analyticsService.getCompletionData(completionFilters.dateRange)
        ]);

        processStudents(masterStudents, analyticsStudentsResult);
        setCompletionData(completionRes);
      } catch (error) {
        console.error("Error fetching completion drilldown data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [completionFilters.dateRange, initialStudents, initialAnalyticsStudents]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className={`text-lg ${textColor}`}>Loading completion analytics...</div>
      </div>
    );
  }

  const filteredData = getCompletionDataSync(completionData, completionFilters);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-4">
        <button onClick={() => setCurrentView('overview')} className="flex items-center gap-2 text-orange-600 hover:text-orange-800">
          <ArrowLeft size={20} />
          Back
        </button>
        <h2 className={`text-2xl font-bold ${textColor}`}>Tutorial Completion Analysis</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={`${cardColor} p-4 rounded-lg shadow`}>
          <label className={`block text-sm font-semibold mb-2 ${textColor}`}>Subject</label>
          <select
            value={completionFilters.course}
            onChange={(e) => setCompletionFilters({ ...completionFilters, course: e.target.value })}
            className={`w-full p-2 border rounded-lg text-sm ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
          >
            <option value="all">All Subjects</option>
            <option value="botany">Botany</option>
            <option value="zoology">Zoology</option>
            <option value="physics">Physics</option>
            <option value="chemistry">Chemistry</option>
          </select>
        </div>
        <div className={`${cardColor} p-4 rounded-lg shadow`}>
          <label className={`block text-sm font-semibold mb-2 ${textColor}`}>Date Range</label>
          <select
            value={completionFilters.dateRange}
            onChange={(e) => setCompletionFilters({ ...completionFilters, dateRange: e.target.value })}
            className={`w-full p-2 border rounded-lg text-sm ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
          >
            <option value="all">All Time</option>
            <option value="month">Last Month</option>
            <option value="week">Last Week</option>
          </select>
        </div>
      </div>

      <ChartCard title="Completion Rates by Subject" darkMode={darkMode}>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={filteredData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
              <XAxis
                dataKey="subject"
                stroke="#999"
                tick={{ fontSize: 12 }}
              />
              <YAxis
                stroke="#999"
                tick={{ fontSize: 12 }}
                domain={[0, 100]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #ddd',
                  fontSize: '12px'
                }}
              />
              <Legend />
              <Bar
                dataKey="completion"
                fill="#ff8c42"
                name="Completion %"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="students"
                fill="#ff6b35"
                name="Students"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <ChartCard title="Student List" darkMode={darkMode}>
        <div className="overflow-x-auto">
          <table className={`w-full text-sm`}>
            <thead>
              <tr className="border-b border-gray-200">
                <th className={`text-left p-3 font-semibold ${textColor}`}>Student</th>
                <th className={`text-left p-3 font-semibold ${textColor}`}>Completion Rate</th>
                <th className={`text-left p-3 font-semibold ${textColor}`}>Action</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id} className="border-b hover:bg-gray-50">
                  <td className={`p-3 ${textColor}`}>
                    <div>
                      <div className="font-medium">{student.name}</div>
                      <div className={`text-xs ${textSecondary} truncate max-w-[150px]`}>{student.email}</div>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${student.completionRate}%` }} />
                      </div>
                      <span className={`text-sm ${textColor}`}>{student.completionRate}%</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <button onClick={() => { setSelectedStudent(student); setCurrentView('student-profile'); }} className="text-orange-600 hover:text-orange-800 text-sm font-semibold">
                      View Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartCard>
    </div>
  );
};

export default CompletionDrilldownView;

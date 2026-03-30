import React, { useState, useEffect } from 'react';
import { ChevronRight, Trophy } from 'lucide-react';
import { ResponsiveContainer, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line, BarChart, Bar } from 'recharts';
import KPICard from '../Charts/KPICard';
import ChartCard from '../Charts/ChartCard';
import { apiService } from '../../services/apiService';
import { analyticsService } from '../../services/analyticsService';
import { getAllStudents } from '../../services/studentService';
import { useAppContext } from '../../context/AppContext';

const OverviewView = ({ setCurrentView, completionFilters, initialStats }) => {
  const darkMode = false;
  const [overallStats, setOverallStats] = useState(initialStats || null);
  const [engagementData, setEngagementData] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);
  const [completionData, setCompletionData] = useState([]);
  const [loading, setLoading] = useState(!initialStats);

  const textColor = darkMode ? 'text-gray-100' : 'text-gray-800';
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-600';

  useEffect(() => {
    const fetchData = async () => {
      // If we have initialStats and completionData hasn't changed relative to range, 
      // we still need engagement, performance and completion data because they are not global yet.
      // However, we can satisfy the overallStats from initialStats.

      if (!initialStats) setLoading(true);
      try {
        const [stats, engagement, performance, completion] = await Promise.all([
          initialStats ? Promise.resolve(initialStats) : analyticsService.getOverallStats(),
          analyticsService.getEngagementData(),
          analyticsService.getPerformanceData(),
          analyticsService.getCompletionData(completionFilters?.dateRange || 'all')
        ]);

        setOverallStats(stats);
        setEngagementData(engagement || []);
        setPerformanceData(performance || []);
        setCompletionData(completion || []);
      } catch (error) {
        console.error("Error fetching overview data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [completionFilters?.dateRange, initialStats]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className={`text-lg ${textColor}`}>Loading dashboard data...</div>
      </div>
    );
  }

  // Helper to display value or '--' when no data
  const displayValue = (value) => value !== null && value !== undefined ? value : '--';

  // Filter completion data by subject if needed
  const filteredCompletionData = completionFilters?.course && completionFilters.course !== 'all'
    ? completionData.filter(item => item.subject?.toLowerCase() === completionFilters.course)
    : completionData;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <KPICard title="Total Students" value={displayValue(overallStats?.totalStudents)} darkMode={darkMode} />
        <KPICard
          title="Active Users"
          value={displayValue(overallStats?.activeMonthly)}
          darkMode={darkMode}
        />
        <KPICard title="Avg Test Score" value={displayValue(overallStats?.avgTestScore)} subtitle="out of 100" darkMode={darkMode} />
        <KPICard
          title="Video Analytics"
          value={overallStats?.totalVideos > 0
            ? `${(overallStats.totalCompletions / (overallStats.totalStudents || 1)).toFixed(1)} / ${overallStats.totalVideos}`
            : '--'}
          onClick={() => setCurrentView('videoAnalytics')}
          subtitle="Avg videos per student"
          darkMode={darkMode}
        />
        <KPICard
          title="Leaderboard"
          value="Rankings"
          icon={<Trophy className="text-yellow-500" />}
          onClick={() => setCurrentView('leaderboard')}
          subtitle="View top performers"
          darkMode={darkMode}
        />
      </div>

      <ChartCard title="Website Engagement & Usage" darkMode={darkMode}>
        {engagementData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={engagementData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
              <XAxis dataKey="day" stroke="#999" />
              <YAxis stroke="#999" />
              <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #ddd' }} />
              <Legend />
              <Line type="monotone" dataKey="users" stroke="#4F46E5" name="Active Users" strokeWidth={2} />
              <Line type="monotone" dataKey="views" stroke="#ff6b35" name="Page Views" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className={`text-center py-12 ${textSecondary}`}>No engagement data available</div>
        )}
      </ChartCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Tutorial Completion Rates (By Subject)" darkMode={darkMode}>
          {filteredCompletionData.length > 0 ? (
            <div className="space-y-4">
              {filteredCompletionData.map((item, idx) => (
                <div key={idx}>
                  <div className="flex justify-between mb-1">
                    <span className={`text-sm font-medium ${textColor}`}>{item.subject}</span>
                    <span className={`text-sm ${textSecondary}`}>{item.completion}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${item.completion}%` }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={`text-center py-12 ${textSecondary}`}>No completion data available</div>
          )}
          <button
            onClick={() => setCurrentView('completion')}
            className="mt-4 text-orange-600 hover:text-orange-800 text-sm font-semibold flex items-center gap-1"
          >
            Drill Down <ChevronRight size={14} />
          </button>
        </ChartCard>

        <ChartCard title="Test Performance - Subject-wise" darkMode={darkMode}>
          {performanceData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
                <XAxis dataKey="subject" stroke="#999" />
                <YAxis stroke="#999" />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #ddd' }} />
                <Legend />
                <Bar dataKey="avgScore" fill="#ff8c42" name="Avg Score" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className={`text-center py-12 ${textSecondary}`}>No performance data available</div>
          )}
          <button
            onClick={() => setCurrentView('performance')}
            className="mt-4 text-orange-600 hover:text-orange-800 text-sm font-semibold flex items-center gap-1"
          >
            Drill Down <ChevronRight size={14} />
          </button>
        </ChartCard>
      </div>
    </div>
  );
};

export default OverviewView;
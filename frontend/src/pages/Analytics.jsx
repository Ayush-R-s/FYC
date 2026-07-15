import React, { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { analyticsService } from '../services/analyticsService';
import { getAllStudents } from '../services/studentService';


// Components - Direct Imports to bypass index.js issues
import OverviewView from '../components/views/OverviewView.jsx';
import CompletionDrilldownView from '../components/views/CompletionDrilldownView.jsx';
import PerformanceDrilldownView from '../components/views/PerformanceDrilldownView.jsx';
import StudentProfileView from '../components/views/StudentProfileView.jsx';
import StudentPerformanceView from '../components/views/StudentPerformanceView.jsx';
import ActiveUsersView from '../components/views/ActiveUsersView.jsx';
import VideoAnalyticsView from '../components/views/VideoAnalyticsView.jsx';
import LeaderboardView from '../components/views/LeaderboardView.jsx';

const Analytics = () => {
  const { darkMode } = useAppContext();
  const [currentView, setCurrentView] = useState('overview');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [activeUsersTab, setActiveUsersTab] = useState('all');
  const [completionFilters, setCompletionFilters] = useState({
    course: 'all',
    dateRange: 'all'
  });

  // Global Data State
  const [overallStats, setOverallStats] = useState(null);
  const [masterStudents, setMasterStudents] = useState([]);
  const [analyticsStudents, setAnalyticsStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGlobalData = async () => {
      setLoading(true);
      try {
        const [statsRes, masterRes, analyticsRes] = await Promise.all([
          analyticsService.getOverallStats(),
          getAllStudents(),
          analyticsService.getStudents()
        ]);
        setOverallStats(statsRes);
        setMasterStudents(masterRes || []);
        setAnalyticsStudents(analyticsRes || []);
      } catch (error) {
        console.error("Error fetching global analytics data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGlobalData();
  }, []);

  const bgColor = 'bg-slate-50';
  const textColor = 'text-gray-800';
  const textSecondary = 'text-gray-600';

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className={`text-lg ${textColor}`}>Loading analytics data...</div>
        </div>
      );
    }

    switch (currentView) {
      case 'completion':
        return (
          <CompletionDrilldownView
            setCurrentView={setCurrentView}
            setSelectedStudent={setSelectedStudent}
            darkMode={darkMode}
            completionFilters={completionFilters}
            setCompletionFilters={setCompletionFilters}
            initialStudents={masterStudents}
            initialAnalyticsStudents={analyticsStudents}
          />
        );
      case 'performance':
        return (
          <PerformanceDrilldownView
            setCurrentView={setCurrentView}
            setSelectedStudent={setSelectedStudent}
            darkMode={darkMode}
            initialStudents={masterStudents}
            initialAnalyticsStudents={analyticsStudents}
          />
        );
      case 'student-profile':
        return (
          <StudentProfileView
            setCurrentView={setCurrentView}
            selectedStudent={selectedStudent}
            darkMode={darkMode}
            allStudents={analyticsStudents}
          />
        );
      case 'student-performance':
        return (
          <StudentPerformanceView
            setCurrentView={setCurrentView}
            selectedStudent={selectedStudent}
            darkMode={darkMode}
          />
        );
      case 'activeUsers':
        return (
          <ActiveUsersView
            setCurrentView={setCurrentView}
            darkMode={darkMode}
            activeUsersTab={activeUsersTab}
            setActiveUsersTab={setActiveUsersTab}
            initialStats={overallStats}
          />
        );
      case 'videoAnalytics':
        return (
          <VideoAnalyticsView
            setCurrentView={setCurrentView}
            darkMode={darkMode}
            initialStats={overallStats}
          />
        );
      case 'leaderboard':
        return (
          <LeaderboardView
            setCurrentView={setCurrentView}
            darkMode={darkMode}
          />
        );
      default:
        return (
          <OverviewView
            setCurrentView={setCurrentView}
            darkMode={darkMode}
            completionFilters={completionFilters}
            initialStats={overallStats}
          />
        );
    }
  };

  return (
    <div className="bg-slate-50 transition-colors duration-300">
      <div className="w-full transition-all duration-300">
        <div className="flex justify-between items-start sm:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div>
              <h1 className={`text-2xl sm:text-4xl font-bold ${textColor}`}>Analytics & Dashboard</h1>
              <p className={`${textSecondary} mt-2 text-sm sm:text-base`}>Student Learning Analytics - Jest Preparation</p>
            </div>
          </div>
        </div>

        {renderContent()}
      </div>
    </div>
  );
};

export default Analytics;
import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import ChartCard from '../Charts/ChartCard';
import { analyticsService } from '../../services/analyticsService';

const ActiveUsersView = ({ setCurrentView, activeUsersTab, setActiveUsersTab, initialStats }) => {
  const darkMode = false;
  const [stats, setStats] = useState(initialStats || null);
  const [loading, setLoading] = useState(!initialStats);

  const cardColor = 'bg-white';
  const textColor = 'text-gray-800';
  const textSecondary = 'text-gray-600';

  useEffect(() => {
    if (initialStats) {
      setStats(initialStats);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const statsRes = await analyticsService.getOverallStats();
        setStats(statsRes);
      } catch (error) {
        console.error("Error fetching active users stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [initialStats]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className={`text-lg ${textColor}`}>Loading active users data...</div>
      </div>
    );
  }

  // Helper to display value or '--' when no data
  const displayValue = (value) => value !== null && value !== undefined ? value : '--';

  const hasData = stats !== null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-4">
        <button onClick={() => setCurrentView('overview')} className="flex items-center gap-2 text-orange-600 hover:text-orange-800">
          <ArrowLeft size={20} />
          Back
        </button>
        <h2 className={`text-2xl font-bold ${textColor}`}>Active Users</h2>
      </div>

      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setActiveUsersTab('daily')}
          className={`px-4 py-2 rounded-lg font-semibold transition ${activeUsersTab === 'daily' ? 'bg-orange-500 text-white' : `${cardColor} ${textColor} border border-orange-500`}`}
        >
          Daily ({displayValue(stats?.activeDaily)})
        </button>
        <button
          onClick={() => setActiveUsersTab('weekly')}
          className={`px-4 py-2 rounded-lg font-semibold transition ${activeUsersTab === 'weekly' ? 'bg-orange-500 text-white' : `${cardColor} ${textColor} border border-orange-500`}`}
        >
          Weekly ({displayValue(stats?.activeWeekly)})
        </button>
        <button
          onClick={() => setActiveUsersTab('monthly')}
          className={`px-4 py-2 rounded-lg font-semibold transition ${activeUsersTab === 'monthly' ? 'bg-orange-500 text-white' : `${cardColor} ${textColor} border border-orange-500`}`}
        >
          Monthly ({displayValue(stats?.activeMonthly)})
        </button>
      </div>

      <ChartCard title={`${activeUsersTab.charAt(0).toUpperCase() + activeUsersTab.slice(1)} Active Users`} darkMode={darkMode}>
        <div className="text-center py-8">
          {hasData ? (
            <>
              <p className={`text-5xl font-bold ${darkMode ? 'text-orange-400' : 'text-orange-600'} mb-2`}>
                {activeUsersTab === 'daily' ? displayValue(stats?.activeDaily) : activeUsersTab === 'weekly' ? displayValue(stats?.activeWeekly) : displayValue(stats?.activeMonthly)}
              </p>
              <p className={textSecondary}>Users Active {activeUsersTab}</p>
            </>
          ) : (
            <p className={textSecondary}>No active user data available. Connect to backend to see real data.</p>
          )}
        </div>
      </ChartCard>
    </div>
  );
};

export default ActiveUsersView;

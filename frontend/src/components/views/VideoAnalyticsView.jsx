import React, { useState, useEffect } from 'react';
import { ArrowLeft, Users, X, Info } from 'lucide-react';
import ChartCard from '../Charts/ChartCard';
import { analyticsService } from '../../services/analyticsService';

const StudentListModal = ({ isOpen, onClose, videoTitle, students }) => {
  const darkMode = false;
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl shadow-2xl overflow-hidden transition-all transform bg-white">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div>
            <h3 className="text-lg font-bold text-gray-900">{videoTitle}</h3>
            <p className="text-xs text-gray-500">Completed by {students.length} students</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="max-h-96 overflow-y-auto p-4 custom-scrollbar">
          {students.length === 0 ? (
            <div className="text-center py-8">
              <Users size={32} className="mx-auto mb-2 text-gray-300" />
              <p className="text-sm text-gray-500">No students have completed this video yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {students.map((student, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 rounded-lg border bg-gray-50 border-gray-100">
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-xs">
                    {student.name.substring(0, 1).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{student.name}</div>
                    <div className="text-xs text-gray-500">{student.email}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="p-4 border-t border-gray-100 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-lg shadow-sm transition-all">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const VideoAnalyticsView = ({ setCurrentView, initialStats }) => {
  const darkMode = false;
  const [videoData, setVideoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [studentList, setStudentList] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  const totalStudentsCount = initialStats?.totalStudents || 0;

  const textColor = 'text-gray-800';
  const textSecondary = 'text-gray-600';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await analyticsService.getVideoAnalytics();
        setVideoData(data);
      } catch (error) {
        console.error("Error fetching video analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleViewStudents = async (video) => {
    setSelectedVideo(video);
    setModalLoading(true);
    setModalOpen(true);
    try {
      const students = await analyticsService.getVideoStudents(video.id);
      setStudentList(students);
    } catch (error) {
      console.error("Error fetching video students:", error);
    } finally {
      setModalLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className={`text-lg animate-pulse ${textColor}`}>Loading video analytics...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-4">
          <button onClick={() => setCurrentView('overview')} className="p-2 rounded-lg hover:bg-orange-50 text-orange-600 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className={`text-2xl font-bold ${textColor}`}>Detailed Video Analytics</h2>
            <p className={`text-sm ${textSecondary}`}>Track student engagement across all tutorial content</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border-gray-100 p-5 rounded-xl border shadow-sm">
          <div className={`${textSecondary} text-xs uppercase font-bold tracking-wider mb-2`}>Total Videos</div>
          <div className={`${textColor} text-3xl font-black`}>{videoData.length || 0}</div>
        </div>
        <div className="bg-white border-gray-100 p-5 rounded-xl border shadow-sm">
          <div className={`${textSecondary} text-xs uppercase font-bold tracking-wider mb-2`}>Enrollment</div>
          <div className={`${textColor} text-3xl font-black flex items-baseline gap-2`}>
            {initialStats?.totalStudents || 0}
            <span className="text-sm font-normal text-gray-500">Global Students</span>
          </div>
        </div>
        <div className="bg-white border-gray-100 p-5 rounded-xl border shadow-sm">
          <div className={`${textSecondary} text-xs uppercase font-bold tracking-wider mb-2`}>Completion Summary</div>
          <div className="flex items-center gap-3">
            <div className={`${textColor} text-3xl font-black`}>
              {initialStats?.totalVideos > 0
                ? `${(initialStats.totalCompletions / (initialStats.totalStudents || 1)).toFixed(1)}`
                : '0'}
            </div>
            <div className="text-xs text-gray-500 leading-tight">
              Avg videos watched<br />per student
            </div>
          </div>
        </div>
      </div>

      <ChartCard title="Video Engagement Details" darkMode={darkMode}>
        <div className="overflow-x-auto">
          <table className={`w-full text-sm`}>
            <thead>
              <tr className="border-b border-gray-200">
                <th className={`text-left p-4 font-bold tracking-wider ${textSecondary}`}>VIDEO INFORMATION</th>
                <th className={`text-left p-4 font-bold tracking-wider ${textSecondary}`}>DURATION</th>
                <th className={`text-left p-4 font-bold tracking-wider ${textSecondary}`}>COMPLETION RATE</th>
                <th className={`text-left p-4 font-bold tracking-wider ${textSecondary}`}>AVG WATCH</th>
                <th className={`text-right p-4 font-bold tracking-wider ${textSecondary}`}>ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {videoData.map((video) => (
                <tr key={video.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className={`font-bold ${textColor} mb-1`}>{video.title}</span>
                      <span className="text-xs font-medium bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full w-fit">
                        {video.subject}
                      </span>
                    </div>
                  </td>
                  <td className={`p-4 ${textColor} font-medium tracking-tight`}>{video.duration || '--'}</td>
                  <td className="p-4">
                    <div className="flex flex-col gap-2 min-w-[140px]">
                      <div className="flex justify-between items-center text-xs">
                        <span className={`${textSecondary}`}>{video.completed} / {totalStudentsCount}</span>
                        <span className={`font-bold ${textColor}`}>
                          {totalStudentsCount > 0 ? ((video.completed / totalStudentsCount) * 100).toFixed(0) : 0}%
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-orange-500 rounded-full transition-all duration-500"
                          style={{ width: `${totalStudentsCount > 0 ? (video.completed / totalStudentsCount) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className={`p-1 rounded-md ${video.avgWatchTime > 50 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        <Info size={12} />
                      </span>
                      <span className={`font-bold ${textColor}`}>{video.avgWatchTime}%</span>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleViewStudents(video)}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold bg-gray-100 text-gray-700 hover:bg-orange-600 hover:text-white transition-all shadow-sm"
                    >
                      <Users size={14} />
                      View Students
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartCard>

      <StudentListModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        videoTitle={selectedVideo?.title}
        students={studentList}
        darkMode={darkMode}
      />
    </div>
  );
};

export default VideoAnalyticsView;

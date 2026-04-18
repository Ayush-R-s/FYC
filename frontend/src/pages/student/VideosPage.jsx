import React, { useState, useEffect, useCallback, useMemo } from 'react';
import VideoGrid from '../../components/Student/VideoGrid';
import SubjectPlaylist from '../../components/Student/SubjectPlaylist';
import * as api from '../../utils/api';
import VideoPlayerModal from '../../components/Student/VideoPlayerModal';

import { useAppContext } from '../../context/AppContext';

const VideosPage = () => {
    const { darkMode, t } = useAppContext();
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedVideoData, setSelectedVideoData] = useState(null); // { video, index, playlist }
    const [selectedSubject, setSelectedSubject] = useState('All');
    const [selectedClass, setSelectedClass] = useState('11'); // New Class filter
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDate, setSelectedDate] = useState('');

    // Function to load videos with their progress
    const loadVideosWithProgress = useCallback(async () => {
        try {
            const data = await api.fetchVideos();
            const student = JSON.parse(localStorage.getItem('student'));

            if (student && student.email) {
                try {
                    const progressData = await api.fetchVideoProgress(student.email);
                    // Create a map for quick lookup
                    const progressMap = {};
                    progressData.forEach(p => {
                        progressMap[p.videoId] = p;
                    });

                    // Merge progress with videos
                    const videosWithProgress = data.map(video => ({
                        ...video,
                        progress: progressMap[video.id]?.progress || 0,
                        completed: progressMap[video.id]?.completed || false,
                        currentTimeSeconds: progressMap[video.id]?.currentTimeSeconds || 0
                    }));

                    setVideos(videosWithProgress);
                } catch (e) {
                    console.error('Error loading progress:', e);
                    setVideos(data);
                }
            } else {
                setVideos(data);
            }
        } catch (error) {
            console.error('Error loading videos:', error);
        }
    }, []);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await loadVideosWithProgress();
            setLoading(false);
        };
        loadData();
    }, [loadVideosWithProgress]);

    // Callback to refresh progress after video closes
    const handleProgressUpdate = useCallback(() => {
        loadVideosWithProgress();
    }, [loadVideosWithProgress]);

    // Handle video play - pass the video with current progress data and playlist context
    const handlePlay = (video, index, playlist) => {
        setSelectedVideoData({ video, index, playlist });
    };

    // Handle video close - refresh progress
    const handleCloseVideo = () => {
        setSelectedVideoData(null);
    };

    // Grouping logic for Playlists - Now includes Class Filtering
    const categorizedVideos = useMemo(() => {
        const categories = {
            Physics: [],
            Chemistry: [],
            Biology: []
        };

        // Filter by selected class first
        const filteredByClass = videos.filter(v => 
            v.category === selectedClass || 
            (!v.category && selectedClass === '11') // Default to 11 if category missing
        );

        filteredByClass.forEach(video => {
            const sub = video.subject?.toLowerCase();
            if (sub === 'physics') {
                categories.Physics.push(video);
            } else if (sub === 'chemistry') {
                categories.Chemistry.push(video);
            } else if (sub === 'biology' || sub === 'zoology' || sub === 'botany') {
                categories.Biology.push(video);
            }
        });

        return categories;
    }, [videos, selectedClass]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div>
                    <h1 className={`text-3xl font-extrabold tracking-tight mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {t("tutorialVideos") || "Tutorial Videos"}
                    </h1>
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Master your subjects with our comprehensive video library
                    </p>
                </div>

                <div className="flex bg-slate-200/50 dark:bg-slate-800/50 p-1.5 rounded-2xl w-fit border border-inherit shadow-inner">
                    <button
                        onClick={() => setSelectedClass("11")}
                        className={`px-8 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${selectedClass === "11" ? "bg-white dark:bg-slate-700 text-orange-500 shadow-xl scale-100" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 scale-95"}`}
                    >
                        Class 11th
                    </button>
                    <button
                        onClick={() => setSelectedClass("12")}
                        className={`px-8 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${selectedClass === "12" ? "bg-white dark:bg-slate-700 text-orange-500 shadow-xl scale-100" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 scale-95"}`}
                    >
                        Class 12th
                    </button>
                </div>
            </div>

            {selectedSubject === 'All' && !searchQuery && !selectedDate ? (
                // Show Playlist View by Default
                <div className="space-y-2">
                    <VideoGrid
                        darkMode={darkMode}
                        selectedSubject={selectedSubject}
                        setSelectedSubject={setSelectedSubject}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        selectedDate={selectedDate}
                        setSelectedDate={setSelectedDate}
                        videos={[]} // Empty array because we manage display here
                        onPlay={handlePlay}
                        t={t}
                        hideTitle={true}
                    />
                    
                    <SubjectPlaylist 
                        subject="Physics" 
                        videos={categorizedVideos.Physics} 
                        darkMode={darkMode} 
                        onPlay={handlePlay} 
                        t={t} 
                    />
                    <SubjectPlaylist 
                        subject="Chemistry" 
                        videos={categorizedVideos.Chemistry} 
                        darkMode={darkMode} 
                        onPlay={handlePlay} 
                        t={t} 
                    />
                    <SubjectPlaylist 
                        subject="Biology" 
                        videos={categorizedVideos.Biology} 
                        darkMode={darkMode} 
                        onPlay={handlePlay} 
                        t={t} 
                    />

                    {categorizedVideos.Physics.length === 0 && categorizedVideos.Chemistry.length === 0 && categorizedVideos.Biology.length === 0 && (
                        <div className="text-center py-20 bg-slate-50/50 dark:bg-slate-900/30 rounded-3xl border border-dashed border-inherit">
                            <p className={`text-lg italic ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>No videos found for Class {selectedClass} in this view.</p>
                        </div>
                    )}
                </div>
            ) : (
                // Show Filtered Grid View
                <VideoGrid
                    darkMode={darkMode}
                    selectedSubject={selectedSubject}
                    setSelectedSubject={setSelectedSubject}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                    videos={videos.filter(v => v.category === selectedClass || (!v.category && selectedClass === '11'))}
                    onPlay={handlePlay}
                    t={t}
                />
            )}


            {selectedVideoData && (
                <VideoPlayerModal
                    video={selectedVideoData.video}
                    playlist={selectedVideoData.playlist}
                    initialIndex={selectedVideoData.index}
                    onClose={handleCloseVideo}
                    darkMode={darkMode}
                    onProgressUpdate={handleProgressUpdate}
                />
            )}
        </div>
    );
};

export default VideosPage;


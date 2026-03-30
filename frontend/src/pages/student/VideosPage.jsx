import React, { useState, useEffect, useCallback } from 'react';
import VideoGrid from '../../components/Student/VideoGrid';
import * as api from '../../utils/api';
import VideoPlayerModal from '../../components/Student/VideoPlayerModal';

import { useAppContext } from '../../context/AppContext';

const VideosPage = () => {
    const { darkMode, t } = useAppContext();
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [selectedSubject, setSelectedSubject] = useState('All');
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

    // Handle video play - pass the video with current progress data
    const handlePlay = (video) => {
        setSelectedVideo(video);
    };

    // Handle video close - refresh progress
    const handleCloseVideo = () => {
        setSelectedVideo(null);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <>
            <VideoGrid
                darkMode={darkMode}
                selectedSubject={selectedSubject}
                setSelectedSubject={setSelectedSubject}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                videos={videos}
                onPlay={handlePlay}
                t={t}
            />
            {selectedVideo && (
                <VideoPlayerModal
                    video={selectedVideo}
                    onClose={handleCloseVideo}
                    darkMode={darkMode}
                    onProgressUpdate={handleProgressUpdate}
                />
            )}
        </>
    );
};

export default VideosPage;

import React, { useEffect, useRef, useCallback, useState } from 'react';
import { X, ChevronLeft, ChevronRight, Play, CheckCircle } from 'lucide-react';
import { API_BASE_URL } from '../../services/axiosInstance';

import * as api from '../../utils/api';

const VideoPlayerModal = ({ video: initialVideo, playlist = [], initialIndex = 0, onClose, darkMode, onProgressUpdate }) => {
    const videoRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [currentVideo, setCurrentVideo] = useState(initialVideo);
    const hasSetStartTime = useRef(false);

    // Update current video when index changes
    useEffect(() => {
        if (playlist.length > 0 && playlist[currentIndex]) {
            setCurrentVideo(playlist[currentIndex]);
            hasSetStartTime.current = false; // Reset start time for new video
        }
    }, [currentIndex, playlist]);

    // Save progress function
    const saveCurrentProgress = useCallback(async (videoToSave) => {
        const v = videoToSave || currentVideo;
        if (videoRef.current && v) {
            const current = videoRef.current.currentTime;
            const total = videoRef.current.duration;
            if (total > 0) {
                const progress = (current / total) * 100;
                const student = JSON.parse(localStorage.getItem('student'));
                if (student && student.email) {
                    try {
                        await api.saveVideoProgress({
                            email: student.email,
                            videoId: v.id,
                            progress: Math.round(progress),
                            completed: progress > 90,
                            currentTimeSeconds: current
                        });
                        // Notify parent to refresh progress if needed
                        if (onProgressUpdate) {
                            onProgressUpdate();
                        }
                    } catch (e) { console.error(e) }
                }
            }
        }
    }, [currentVideo, onProgressUpdate]);

    // Auto-play next video
    const playNext = useCallback(() => {
        if (currentIndex < playlist.length - 1) {
            saveCurrentProgress(currentVideo);
            setCurrentIndex(prev => prev + 1);
        }
    }, [currentIndex, playlist.length, currentVideo, saveCurrentProgress]);

    const playPrevious = useCallback(() => {
        if (currentIndex > 0) {
            saveCurrentProgress(currentVideo);
            setCurrentIndex(prev => prev - 1);
        }
    }, [currentIndex, currentVideo, saveCurrentProgress]);

    const playAtIndex = (index) => {
        saveCurrentProgress(currentVideo);
        setCurrentIndex(index);
    };

    // Periodic save while playing
    useEffect(() => {
        const saveProgress = async () => {
            if (videoRef.current && !videoRef.current.paused) {
                await saveCurrentProgress();
            }
        };
        const interval = setInterval(saveProgress, 5000);
        return () => clearInterval(interval);
    }, [saveCurrentProgress]);

    // Handle end of video
    useEffect(() => {
        const videoElement = videoRef.current;
        if (!videoElement) return;

        const handleEnded = () => {
            playNext();
        };

        videoElement.addEventListener('ended', handleEnded);
        return () => {
            videoElement.removeEventListener('ended', handleEnded);
        };
    }, [playNext]);

    // Set start time when video metadata loads (for resume)
    useEffect(() => {
        const videoElement = videoRef.current;
        if (!videoElement) return;

        const handleLoadedMetadata = () => {
            // Resume from saved position if available
            if (!hasSetStartTime.current && currentVideo.currentTimeSeconds && currentVideo.currentTimeSeconds > 0) {
                videoElement.currentTime = currentVideo.currentTimeSeconds;
                hasSetStartTime.current = true;
            }
        };

        videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
        return () => {
            videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
        };
    }, [currentVideo]);

    useEffect(() => {
        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    // Handle close - save progress before closing
    const handleClose = async () => {
        await saveCurrentProgress();
        onClose();
    };

    if (!currentVideo) return null;

    // Use absolute backend URL
    const videoKey = currentVideo.filePath || ""
    const encodedPath = videoKey.split('/').map(segment => encodeURIComponent(segment)).join('/')
    const videoSrc = `${API_BASE_URL}/admin/content/files/${encodedPath}`;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm transition-all duration-300">
            <div className={`relative w-full max-w-7xl h-[90vh] mx-4 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row ${darkMode ? 'bg-gray-950 border border-gray-800' : 'bg-white'}`}>

                {/* Main Player Section */}
                <div className="flex-1 flex flex-col min-w-0">
                    {/* Header */}
                    <div className={`flex justify-between items-center p-4 border-b ${darkMode ? 'border-gray-800 bg-gray-900/50' : 'border-gray-100 bg-gray-50/50'}`}>
                        <div className="min-w-0">
                            <h3 className={`font-bold text-lg truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>{currentVideo.title}</h3>
                            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                {currentVideo.subject} • {currentVideo.instructor || 'Instructor'} • Video {currentIndex + 1} of {playlist.length}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleClose}
                                className={`p-2 rounded-xl transition-all ${darkMode ? 'hover:bg-gray-800 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'}`}
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Video Area */}
                    <div className="relative flex-1 bg-black overflow-hidden flex flex-col">
                        <div className="flex-1 relative">
                            <video
                                ref={videoRef}
                                src={videoSrc}
                                controls
                                autoPlay
                                className="w-full h-full object-contain"
                                controlsList="nodownload"
                            >
                                Your browser does not support the video tag.
                            </video>
                        </div>

                        {/* Navigation Overlay / Controls Bar */}
                        <div className="absolute inset-x-0 bottom-16 flex justify-between px-4 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={playPrevious}
                                disabled={currentIndex === 0}
                                className={`p-4 rounded-full bg-black/50 text-white pointer-events-auto transition-all hover:bg-orange-500 disabled:opacity-30 disabled:hover:bg-black/50`}
                            >
                                <ChevronLeft size={32} />
                            </button>
                            <button
                                onClick={playNext}
                                disabled={currentIndex === playlist.length - 1}
                                className={`p-4 rounded-full bg-black/50 text-white pointer-events-auto transition-all hover:bg-orange-500 disabled:opacity-30 disabled:hover:bg-black/50`}
                            >
                                <ChevronRight size={32} />
                            </button>
                        </div>
                    </div>

                    {/* Meta/Description Below Video */}
                    <div className={`p-6 overflow-y-auto max-h-48 border-t ${darkMode ? 'border-gray-800' : 'border-gray-100'}`}>
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex gap-4">
                                <button
                                    onClick={playPrevious}
                                    disabled={currentIndex === 0}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${darkMode ? 'border-gray-700 hover:bg-gray-800 text-gray-300' : 'border-gray-200 hover:bg-gray-50 text-gray-700'} disabled:opacity-50`}
                                >
                                    <ChevronLeft size={18} /> Prev
                                </button>
                                <button
                                    onClick={playNext}
                                    disabled={currentIndex === playlist.length - 1}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold transition-all disabled:opacity-50`}
                                >
                                    Next <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                        {currentVideo.description && (
                            <div>
                                <h4 className={`text-sm font-bold mb-2 uppercase tracking-wider ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>About this video</h4>
                                <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                    {currentVideo.description}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Playlist Sidebar */}
                <div className={`w-full md:w-80 flex flex-col border-l h-full ${darkMode ? 'bg-gray-900/50 border-gray-800' : 'bg-gray-50 border-gray-100'}`}>
                    <div className="p-4 border-b border-inherit">
                        <h4 className={`font-bold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            Playlist <span className="text-xs px-2 py-0.5 bg-orange-500 text-white rounded-full">{playlist.length}</span>
                        </h4>
                    </div>
                    <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-orange-500">
                        {playlist.map((item, index) => (
                            <button
                                key={item.id}
                                onClick={() => playAtIndex(index)}
                                className={`w-full p-3 flex gap-3 text-left transition-all border-b group ${
                                    index === currentIndex 
                                    ? (darkMode ? 'bg-orange-500/10 border-orange-500/20' : 'bg-orange-50 border-orange-200') 
                                    : (darkMode ? 'border-gray-800/50 hover:bg-gray-800/50' : 'border-gray-200/50 hover:bg-white')
                                }`}
                            >
                                <div className="relative flex-shrink-0 w-24 aspect-video bg-black rounded-lg overflow-hidden border border-inherit">
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Play size={20} className="text-white bg-orange-500 rounded-full p-1" />
                                    </div>
                                    {index === currentIndex && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-orange-500/40">
                                            <div className="flex gap-1 items-end h-6">
                                                <div className="w-1 bg-white animate-pulse" style={{height: '40%'}}></div>
                                                <div className="w-1 bg-white animate-pulse" style={{height: '80%', animationDelay: '0.2s'}}></div>
                                                <div className="w-1 bg-white animate-pulse" style={{height: '60%', animationDelay: '0.4s'}}></div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="min-w-0 flex-1 py-1">
                                    <h5 className={`text-xs font-bold truncate mb-1 ${
                                        index === currentIndex 
                                        ? (darkMode ? 'text-orange-400' : 'text-orange-700') 
                                        : (darkMode ? 'text-gray-300' : 'text-gray-700')
                                    }`}>
                                        {index + 1}. {item.title}
                                    </h5>
                                    <div className="flex items-center gap-2">
                                        <p className={`text-[10px] ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{item.duration || '00:00'}</p>
                                        {item.completed && <CheckCircle size={10} className="text-green-500" />}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoPlayerModal;


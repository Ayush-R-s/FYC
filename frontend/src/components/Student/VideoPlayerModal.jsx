import React, { useEffect, useRef, useCallback } from 'react';
import { X, Maximize, Minimize } from 'lucide-react';
import { API_BASE_URL } from '../../services/axiosInstance';

import * as api from '../../utils/api';

const VideoPlayerModal = ({ video, onClose, darkMode, onProgressUpdate }) => {
    const videoRef = useRef(null);
    const [isFullscreen, setIsFullscreen] = React.useState(false);
    const hasSetStartTime = useRef(false);

    // Save progress function
    const saveCurrentProgress = useCallback(async () => {
        if (videoRef.current) {
            const current = videoRef.current.currentTime;
            const total = videoRef.current.duration;
            if (total > 0) {
                const progress = (current / total) * 100;
                const student = JSON.parse(localStorage.getItem('student'));
                if (student && student.email) {
                    try {
                        await api.saveVideoProgress({
                            email: student.email,
                            videoId: video.id,
                            progress: Math.round(progress),
                            completed: progress > 90,
                            currentTimeSeconds: current
                        });
                        // Notify parent to refresh progress
                        if (onProgressUpdate) {
                            onProgressUpdate();
                        }
                    } catch (e) { console.error(e) }
                }
            }
        }
    }, [video.id, onProgressUpdate]);

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

    // Set start time when video metadata loads (for resume)
    useEffect(() => {
        const videoElement = videoRef.current;
        if (!videoElement) return;

        const handleLoadedMetadata = () => {
            // Resume from saved position if available
            if (!hasSetStartTime.current && video.currentTimeSeconds && video.currentTimeSeconds > 0) {
                videoElement.currentTime = video.currentTimeSeconds;
                hasSetStartTime.current = true;
            }
        };

        videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
        return () => {
            videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
        };
    }, [video.currentTimeSeconds]);

    useEffect(() => {
        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => {
            document.body.style.overflow = 'unset';
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, []);

    const handleFullscreenChange = () => {
        setIsFullscreen(!!document.fullscreenElement);
    };

    // Handle close - save progress before closing
    const handleClose = async () => {
        await saveCurrentProgress();
        onClose();
    };

    if (!video) return null;

    // Use absolute backend URL to ensure correct resource resolution
    const videoKey = video.filePath || ""
    const encodedPath = videoKey.split('/').map(segment => encodeURIComponent(segment)).join('/')
    const videoSrc = `${API_BASE_URL}/admin/content/files/${encodedPath}`;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 transition-opacity duration-300">
            <div className={`relative w-full max-w-5xl mx-4 rounded-xl overflow-hidden shadow-2xl ${darkMode ? 'bg-gray-900 border border-gray-700' : 'bg-white'}`}>

                {/* Header */}
                <div className={`flex justify-between items-center p-4 border-b ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
                    <div>
                        <h3 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>{video.title}</h3>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {video.subject} • {video.instructor || 'Instructor'}
                        </p>
                    </div>
                    <button
                        onClick={handleClose}
                        className={`p-2 rounded-full transition-colors ${darkMode ? 'hover:bg-gray-700 text-gray-400 hover:text-white' : 'hover:bg-gray-200 text-gray-600 hover:text-gray-900'}`}
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Video Player */}
                <div className="relative bg-black aspect-video group">
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

                {/* Footer / Description */}
                {(video.description) && (
                    <div className={`p-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        <h4 className="font-semibold mb-2">Description</h4>
                        <p className="text-sm leading-relaxed">{video.description}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VideoPlayerModal;

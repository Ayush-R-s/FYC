import React from 'react';
import { Play } from 'lucide-react';
import { getSubjectColor } from '../../utils/helpers';

const VideoCard = ({ video, darkMode, onPlay }) => {
    const progress = video.progress || 0;
    return (
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow`}>
            <div className="relative bg-black h-24 sm:h-28 flex items-center justify-center">
                <Play className="w-8 h-8 text-white" />
                <span className="absolute bottom-1 right-1 bg-black bg-opacity-70 text-white text-xs px-1.5 py-0.5 rounded">
                    {video.duration}
                </span>
                {video.completed && (
                    <span className="absolute top-1 right-1 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                        ✓
                    </span>
                )}
            </div>
            <div className="p-2 sm:p-3">
                <div className={`inline-block ${getSubjectColor(video.subject)} px-2 py-0.5 rounded text-xs font-medium mb-1`}>
                    {video.subject.slice(0, 3)}
                </div>
                <h3 className={`font-bold text-xs sm:text-sm mb-1 line-clamp-2 ${darkMode ? 'text-white' : ''}`}>{video.title}</h3>
                <p className={`text-xs mb-1 line-clamp-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{video.instructor ? video.instructor.split(' ')[0] : 'Instructor'}</p>
                <p className={`text-xs mb-2 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>{video.date || (video.createdAt ? new Date(video.createdAt).toLocaleDateString() : '')}</p>
                <div className="mb-2">
                    <div className={`flex justify-between text-xs mb-1 ${darkMode ? 'text-gray-300' : ''}`}>
                        <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{progress}%</span>
                    </div>
                    <div className={`w-full rounded-full h-1 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                        <div
                            className="h-1 bg-orange-500 rounded-full transition-all"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
                <button
                    onClick={() => {
                        if (video.filePath && onPlay) {
                            onPlay(video);
                        } else {
                            // Fallback if no filePath or onPlay handler
                            alert('Video file not found or player not initialized');
                        }
                    }}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-1 px-2 rounded text-xs transition-colors"
                >
                    {progress === 100 ? 'Replay' : progress === 0 ? 'Play' : 'Resume'}
                </button>
            </div>
        </div>
    );
};

export default VideoCard;
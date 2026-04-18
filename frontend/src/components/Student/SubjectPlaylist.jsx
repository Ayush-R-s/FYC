import React, { useState } from 'react';
import VideoCard from './VideoCard';
import { PlayCircle, ChevronDown, ChevronRight } from 'lucide-react';

const SubjectPlaylist = ({ subject, videos, darkMode, onPlay, t }) => {
    const [isExpanded, setIsExpanded] = useState(true);

    if (videos.length === 0) return null;

    const handlePlayAll = (e) => {
        e.stopPropagation(); // Don't trigger expand/collapse
        onPlay(videos[0], 0, videos);
    };

    return (
        <div className={`mb-6 rounded-2xl transition-all duration-300 ${darkMode ? 'bg-gray-800/20 border border-gray-700/30' : 'bg-white shadow-sm border border-gray-100'}`}>
            <div 
                onClick={() => setIsExpanded(!isExpanded)}
                className={`flex items-center justify-between p-6 cursor-pointer group select-none ${isExpanded ? 'border-b border-inherit' : ''}`}
            >
                <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-xl transition-all ${isExpanded ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-400'}`}>
                        {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    </div>
                    <div>
                        <h2 className={`text-xl font-bold transition-colors ${darkMode ? 'group-hover:text-orange-400' : 'group-hover:text-orange-600'}`}>
                            {t(subject.toLowerCase()) || subject} Playlist
                        </h2>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {videos.length} {videos.length === 1 ? 'Video' : 'Videos'} available
                        </p>
                    </div>
                </div>
                
                <button
                    onClick={handlePlayAll}
                    className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-black uppercase tracking-widest text-[10px] transition-all hover:scale-105 active:scale-95 shadow-lg shadow-orange-500/20"
                >
                    <PlayCircle size={18} />
                    <span>Play All</span>
                </button>
            </div>

            {isExpanded && (
                <div className="p-6 pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {videos.map((video, index) => (
                            <VideoCard 
                                key={video.id} 
                                video={video} 
                                darkMode={darkMode} 
                                onPlay={() => onPlay(video, index, videos)} 
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SubjectPlaylist;


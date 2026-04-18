import React from 'react';
import { Play } from 'lucide-react';
import VideoCard from './VideoCard';
import SearchFilters from './SearchFilters';

const VideoGrid = ({
    darkMode,
    selectedSubject,
    setSelectedSubject,
    searchQuery,
    setSearchQuery,
    selectedDate,
    setSelectedDate,
    videos,
    onPlay,
    t,
    hideTitle = false
}) => {
    const filteredVideos = videos.filter(video => {
        const matchesSubject = selectedSubject === 'All' || video.subject === selectedSubject;
        const matchesSearch = video.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (video.instructor?.toLowerCase().includes(searchQuery.toLowerCase()) || false);
        const matchesDate = !selectedDate || video.date === selectedDate;
        return matchesSubject && matchesSearch && matchesDate;
    });

    return (
        <div className="space-y-6">
            {!hideTitle && (
                <h2 className={`text-2xl sm:text-3xl font-bold ${darkMode ? 'text-white' : ''}`}>{t("tutorialVideos")}</h2>
            )}

            <SearchFilters
                darkMode={darkMode}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedSubject={selectedSubject}
                setSelectedSubject={setSelectedSubject}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                t={t}
            />

            {filteredVideos.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                    {filteredVideos.map((video, index) => (
                        <VideoCard 
                            key={video.id} 
                            video={video} 
                            darkMode={darkMode} 
                            onPlay={() => onPlay(video, index, filteredVideos)} 
                        />
                    ))}
                </div>
            )}

            {filteredVideos.length === 0 && videos.length > 0 && (
                <div className="text-center py-12">
                    <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{t("noVideosFound")}</p>
                </div>
            )}
        </div>
    );
};


export default VideoGrid;
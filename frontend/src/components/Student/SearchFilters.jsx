import React from 'react';
import { Search } from 'lucide-react';

const SearchFilters = ({
    darkMode,
    searchQuery,
    setSearchQuery,
    selectedSubject,
    setSelectedSubject,
    selectedDate,
    setSelectedDate,
    t
}) => {
    return (
        <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    placeholder={t("searchVideos") || "Search videos..."}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm ${darkMode
                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                        : 'bg-white border-gray-300 text-black'
                        }`}
                />
            </div>
            <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className={`px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm ${darkMode
                    ? 'bg-gray-800 border-gray-700 text-white'
                    : 'bg-white border-gray-300 text-black'
                    }`}
            >
                <option value="All">{t("all") || "All Subjects"}</option>
                <option value="Physics">{t("physics") || "Physics"}</option>
                <option value="Chemistry">{t("chemistry") || "Chemistry"}</option>
                <option value="Biology">{t("biology") || "Biology"}</option>

            </select>
            <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className={`px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm ${darkMode
                    ? 'bg-gray-800 border-gray-700 text-white'
                    : 'bg-white border-gray-300 text-black'
                    }`}
            />
        </div>
    );
};

export default SearchFilters;
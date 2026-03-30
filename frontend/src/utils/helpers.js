// Helper functions for common tasks

export const getCurrentUser = () => {
    try {
        const student = localStorage.getItem('student');
        if (student) return JSON.parse(student);
        const user = localStorage.getItem('user');
        if (user) return JSON.parse(user);
        return null;
    } catch (error) {
        console.error('Error parsing user data:', error);
        return null;
    }
};

export const getSubjectColor = (subject) => {
    if (!subject) return 'bg-gray-100 text-gray-800';

    const lowerSubject = subject.toLowerCase();

    if (lowerSubject.includes('math')) return 'bg-blue-100 text-blue-800';
    if (lowerSubject.includes('physics')) return 'bg-purple-100 text-purple-800';
    if (lowerSubject.includes('chem')) return 'bg-green-100 text-green-800';
    if (lowerSubject.includes('bio')) return 'bg-pink-100 text-pink-800';
    if (lowerSubject.includes('english')) return 'bg-yellow-100 text-yellow-800';

    // Default fallback
    return 'bg-orange-100 text-orange-800';
};

export const isVideoCompleted = (videos, videoId) => {
    if (!videos || !videoId) return false;
    const video = videos.find(v => String(v.id) === String(videoId));
    return video ? video.completed : false;
};

export const isTestUnlocked = (videos, test) => {
    if (!test.videos || test.videos.length === 0) return true;
    return test.videos.every(vid => isVideoCompleted(videos, vid.id));
};

export const getStudentCategory = (progress) => {
    if (progress >= 90) {
        return {
            label: "Ready to Crack",
            color: "text-green-600",
            bgColor: "bg-green-100"
        };
    } else if (progress >= 75) {
        return {
            label: "Advanced",
            color: "text-blue-600",
            bgColor: "bg-blue-100"
        };
    } else if (progress >= 50) {
        return {
            label: "Intermediate",
            color: "text-orange-600",
            bgColor: "bg-orange-100"
        };
    } else {
        return {
            label: "Beginner",
            color: "text-red-600",
            bgColor: "bg-red-100"
        };
    }
};

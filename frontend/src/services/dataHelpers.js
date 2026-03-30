export const getCompletionDataSync = (data, filters) => {
    if (!data || !Array.isArray(data)) return [];

    let filtered = [...data];

    // Filter by Subject (Course)
    if (filters.course && filters.course !== 'all') {
        filtered = filtered.filter(item =>
            item.subject && item.subject.toLowerCase() === filters.course.toLowerCase()
        );
    }

    return filtered;
};

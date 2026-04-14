import { useState, useMemo, useEffect } from 'react';
import axios from '../services/axiosInstance';

export const useDashboard = () => {
    const [viewMode, setViewMode] = useState('daily');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [dateRange, setDateRange] = useState('7d');
    const [data, setData] = useState({ students: [], tutorials: [], tests: [] });

    useEffect(() => {
        axios.get('/data')
            .then(res => {
                setData(res.data);
            })
            .catch(err => console.error('Failed to fetch dashboard data:', err));
    }, []);

    const { students } = data;

    const filteredStudents = useMemo(() => {
        return students.filter(s =>
            s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [students, searchTerm]);

    const stats = useMemo(() => {
        const scores = filteredStudents.flatMap(s =>
            viewMode === 'daily' ? s.dailyScores : s.weeklyScores
        );

        const avgScore = scores.length > 0
            ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
            : 0;

        const tutorialCompletion = filteredStudents.reduce((acc, student) => {
            const tutorialKeys = Object.keys(student.tutorialProgress || {});
            if (tutorialKeys.length === 0) return acc;

            const studentTotal = Object.values(student.tutorialProgress).reduce(
                (sum, progress) => sum + (progress.total > 0 ? (progress.completed / progress.total) * 100 : 0),
                0
            );
            return acc + (studentTotal / tutorialKeys.length);
        }, 0) / (filteredStudents.length || 1);

        return {
            avgScore,
            tutorialCompletion: Math.round(tutorialCompletion),
            activeStudents: filteredStudents.filter(s =>
                s.lastActive.includes('mins') || s.lastActive.includes('hour')
            ).length,
            totalStudents: filteredStudents.length
        };
    }, [filteredStudents, viewMode]);

    return {
        filteredStudents,
        searchTerm,
        setSearchTerm,
        viewMode,
        setViewMode,
        stats,
        selectedStudent,
        setSelectedStudent,
        dateRange,
        setDateRange,
        tests: data.tests // Return tests for exportUtils
    };
};

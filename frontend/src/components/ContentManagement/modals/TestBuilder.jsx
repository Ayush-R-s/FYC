import React, { useState } from 'react';
import { Plus, X, Trash, Sparkles, ChevronDown, CheckSquare, Square, ArrowLeft } from 'lucide-react';
import AIQuestionGenerator from './AIQuestionGenerator';
import { createTest, updateTestApi, getAllVideosApi } from '../../../services/contentPortalApi';

const TestBuilder = ({ onClose, darkMode, onPublish, editingTestData = null }) => {
    const [testTitle, setTestTitle] = useState(editingTestData?.title || '');
    const [subject, setSubject] = useState(editingTestData?.subject || 'physics');
    const [topic, setTopicName] = useState(editingTestData?.topic || '');
    const [testCategory, setTestCategory] = useState(editingTestData?.category || 'MOCK');
    const [totalTime, setTotalTime] = useState(editingTestData?.duration ? parseInt(editingTestData.duration) : 60);
    const [marksPerQuestion, setMarksPerQuestionState] = useState(4);
    const [questions, setQuestions] = useState(() => {
        const initialQuestions = editingTestData?.questions || editingTestData?.questions_data || [{ id: 1, text: '', answers: ['', '', '', ''], correctAnswers: [], points: 4, subject: editingTestData?.subject || 'physics', topic: editingTestData?.topic || '' }];
        return initialQuestions.map(q => ({
            ...q,
            points: 4,
            subject: q.subject || editingTestData?.subject || 'physics',
            topic: q.topic || editingTestData?.topic || ''
        }));
    });

    // Video selection state
    const [availableVideos, setAvailableVideos] = useState([]);
    const [selectedVideoIds, setSelectedVideoIds] = useState(editingTestData?.videos?.map(v => v.id) || []);

    const [showAIGenerator, setShowAIGenerator] = useState(false);
    const [pointsEditor, setPointsEditor] = useState(null);
    const [isVideoDropdownOpen, setIsVideoDropdownOpen] = useState(false);

    // Filter videos by subject
    const filteredVideos = React.useMemo(() => {
        if (subject === 'all') return availableVideos;
        return availableVideos.filter(v => v.subject?.toLowerCase() === subject?.toLowerCase());
    }, [availableVideos, subject]);

    // Clear selected videos that don't match the new subject
    React.useEffect(() => {
        const validVideoIds = filteredVideos.map(v => v.id);
        setSelectedVideoIds(prev => prev.filter(id => validVideoIds.includes(id)));
    }, [subject, filteredVideos]);

    React.useEffect(() => {
        const fetchVideos = async () => {
            try {
                const videos = await getAllVideosApi();
                setAvailableVideos(videos);
            } catch (error) {
                console.error('Error fetching videos:', error);
            }
        };
        fetchVideos();
    }, []);


    const addQuestion = () => {
        setQuestions([...questions, {
            id: Date.now(),
            text: '',
            answers: ['', '', '', ''],
            correctAnswers: [],
            points: marksPerQuestion,
            subject: subject === 'all' ? 'physics' : subject,
            topic: topic
        }]);
    };

    const updateQuestion = (id, field, value) => {
        setQuestions(questions.map(q => q.id === id ? { ...q, [field]: value } : q));
    };

    const updateAnswer = (qId, aIdx, value) => {
        setQuestions(questions.map(q => q.id === qId ? { ...q, answers: q.answers.map((a, i) => i === aIdx ? value : a) } : q));
    };

    const toggleCorrectAnswer = (qId, aIdx) => {
        setQuestions(questions.map(q => {
            if (q.id === qId) {
                const correctAnswers = q.correctAnswers || [];
                if (correctAnswers.includes(aIdx)) {
                    return { ...q, correctAnswers: correctAnswers.filter(i => i !== aIdx) };
                } else {
                    return { ...q, correctAnswers: [...correctAnswers, aIdx] };
                }
            }
            return q;
        }));
    };

    const updateMarksPerQuestion = (value) => {
        const marks = Math.max(1, parseInt(value) || 1);
        setMarksPerQuestionState(marks);
        setQuestions(questions.map(q => ({ ...q, points: marks })));
    };

    const deleteQuestion = (id) => {
        if (questions.length > 1) setQuestions(questions.filter(q => q.id !== id));
    };

    const handleAIGenerateQuestions = (generatedQuestions) => {
        const updatedGeneratedQuestions = generatedQuestions.map(q => ({
            ...q,
            correctAnswers: q.correctAnswers || []
        }));
        setQuestions([...questions, ...updatedGeneratedQuestions]);
    };

    const handlePublish = async () => {
        if (!testTitle || questions.length === 0) {
            alert('Please enter a test title and add at least one question');
            return;
        }

        try {
            const testData = {
                title: testTitle,
                subject,
                topic: topic,
                category: testCategory,
                duration: `${totalTime} min`,
                marksPerQuestion: marksPerQuestion,
                questions: questions,
                videoIds: selectedVideoIds
            };

            // Call the appropriate API based on whether we are editing or creating
            let savedTest;
            if (editingTestData && editingTestData.id) {
                savedTest = await updateTestApi(editingTestData.id, testData);
            } else {
                savedTest = await createTest(testData);
            }

            if (editingTestData) {
                onPublish({
                    ...savedTest,
                    attempts: editingTestData.attempts || 0,
                    avgScore: editingTestData.avgScore || 0,
                }, true);
            } else {
                onPublish({
                    ...savedTest,
                    attempts: 0,
                    avgScore: 0,
                });
            }

            alert(editingTestData ? 'Test updated!' : 'Test published!');
            onClose();
        } catch (error) {
            console.error('Error publishing test:', error);
            const serverMsg = error.response?.data?.message || error.message;
            alert(`Failed to publish test: ${serverMsg}. Please check console for details.`);
        }
    };


    const totalPoints = questions.length * marksPerQuestion;

    return (
        <div className={`fixed inset-0 z-[100] flex flex-col ${darkMode ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
            {/* Full Screen Header */}
            <div className={`flex-none px-4 sm:px-6 border-b flex items-center justify-between sticky top-0 z-10 transition-all ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
                <div className="flex items-center gap-2 sm:gap-4 flex-1 py-3 sm:py-0 h-16 sm:h-auto">
                    <button
                        onClick={onClose}
                        className={`p-2 rounded-full transition-colors ${darkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}
                        title="Go Back"
                    >
                        <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                    <div className="h-6 w-px bg-gray-300 dark:bg-gray-700 mx-1 sm:mx-2" />
                    <input
                        type="text"
                        placeholder="Test Title..."
                        value={testTitle}
                        onChange={(e) => setTestTitle(e.target.value)}
                        className={`text-base sm:text-xl font-bold bg-transparent border-none focus:outline-none flex-1 min-w-0 ${darkMode ? 'text-white placeholder-gray-600' : 'text-gray-900 placeholder-gray-400'}`}
                    />
                </div>

                <div className="flex items-center gap-2 sm:gap-3 ml-2 sm:ml-4">
                    <button
                        onClick={onClose}
                        className={`hidden sm:block px-4 py-2 rounded-lg font-semibold transition-all ${darkMode ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handlePublish}
                        disabled={!testTitle}
                        className="px-3 sm:px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-400 text-white rounded-lg text-sm sm:text-base font-bold shadow-lg shadow-orange-500/20 disabled:shadow-none transition-all flex items-center gap-1.5 sm:gap-2 whitespace-nowrap"
                    >
                        {editingTestData ? 'Update' : 'Publish'}
                    </button>
                </div>
            </div>

            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
                {/* Left Sidebar - Configuration & Stats */}
                <div className={`w-full lg:w-80 border-b lg:border-b-0 lg:border-r flex flex-col flex-none ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
                    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 max-h-[40vh] lg:max-h-full">
                        <section>
                            <h3 className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Test Configuration</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className={`block text-[11px] sm:text-xs font-semibold mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Subject</label>
                                    <select value={subject} onChange={(e) => setSubject(e.target.value)} className={`w-full px-3 py-2 border rounded-lg text-sm transition-all focus:ring-2 focus:ring-orange-500 outline-none ${darkMode ? 'border-gray-700 bg-gray-800 text-white' : 'border-gray-300 bg-gray-50'}`}>
                                        <option value="all">All Subjects</option>
                                        <option value="physics">Physics</option>
                                        <option value="chemistry">Chemistry</option>
                                        <option value="biology">Biology</option>
                                        <option value="botany">Botany</option>
                                        <option value="zoology">Zoology</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={`block text-[11px] sm:text-xs font-semibold mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Topic Name</label>
                                    <input type="text" placeholder="e.g., Thermodynamics" value={topic} onChange={(e) => setTopicName(e.target.value)} className={`w-full px-3 py-2 border rounded-lg text-sm transition-all focus:ring-2 focus:ring-orange-500 outline-none ${darkMode ? 'border-gray-700 bg-gray-800 text-white' : 'border-gray-300 bg-gray-50'}`} />
                                </div>
                                <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-1">
                                    <div>
                                        <label className={`block text-[11px] sm:text-xs font-semibold mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Total Time</label>
                                        <input
                                            type="number"
                                            value={totalTime}
                                            onChange={(e) => setTotalTime(e.target.value)}
                                            className={`w-full px-3 py-2 border rounded-lg text-sm transition-all focus:ring-2 focus:ring-orange-500 outline-none ${darkMode ? 'border-gray-700 bg-gray-800 text-white' : 'border-gray-300 bg-gray-50'}`}
                                        />
                                    </div>
                                    <div>
                                        <label className={`block text-[11px] sm:text-xs font-semibold mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Category</label>
                                        <select value={testCategory} onChange={(e) => setTestCategory(e.target.value)} className={`w-full px-3 py-2 border rounded-lg text-sm transition-all focus:ring-2 focus:ring-orange-500 outline-none ${darkMode ? 'border-gray-700 bg-gray-800 text-white' : 'border-gray-300 bg-gray-50'}`}>
                                            <option value="MOCK">Mock</option>
                                            <option value="WEEKLY">Weekly</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="hidden lg:block">
                                    <label className={`block text-xs font-semibold mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Marks per Question</label>
                                    <input
                                        type="number"
                                        readOnly
                                        value={4}
                                        className={`w-full px-3 py-2 border rounded-lg text-sm cursor-not-allowed opacity-75 ${darkMode ? 'border-gray-700 bg-gray-800 text-gray-400' : 'border-gray-300 bg-gray-200'}`}
                                    />
                                </div>
                            </div>
                        </section>

                        <div className={`h-px ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} hidden lg:block`} />

                        <section className="hidden lg:block">
                            <h3 className={`text-xs font-bold uppercase tracking-wider mb-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Connected Content</h3>
                            {/* Video Selection Section */}
                            <div className="relative">
                                <label className={`block text-xs font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Associated Videos</label>
                                <div
                                    onClick={() => setIsVideoDropdownOpen(!isVideoDropdownOpen)}
                                    className={`w-full p-2.5 border rounded-lg cursor-pointer flex items-center justify-between transition-all ${darkMode ? 'border-gray-700 bg-gray-800 text-white hover:bg-gray-700' : 'border-gray-300 bg-white hover:bg-gray-50'}`}
                                >
                                    <span className={`text-xs truncate max-w-[180px] ${selectedVideoIds.length === 0 ? 'text-gray-400' : ''}`}>
                                        {selectedVideoIds.length === 0
                                            ? (subject === 'all' ? 'Select videos from all subjects...' : `Select ${subject} videos...`)
                                            : `${selectedVideoIds.length} video(s) selected`}
                                    </span>
                                    <ChevronDown className={`w-4 h-4 transition-transform ${isVideoDropdownOpen ? 'rotate-180' : ''}`} />
                                </div>

                                {isVideoDropdownOpen && (
                                    <>
                                        <div className="fixed inset-0 z-10" onClick={() => setIsVideoDropdownOpen(false)} />
                                        <div className={`absolute z-20 w-full mt-1 border rounded-xl shadow-2xl max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}`}>
                                            {filteredVideos.map(video => {
                                                const isSelected = selectedVideoIds.includes(video.id);
                                                return (
                                                    <div
                                                        key={video.id}
                                                        onClick={() => {
                                                            if (isSelected) {
                                                                setSelectedVideoIds(selectedVideoIds.filter(id => id !== video.id));
                                                            } else {
                                                                setSelectedVideoIds([...selectedVideoIds, video.id]);
                                                            }
                                                        }}
                                                        className={`p-3 flex items-center gap-3 cursor-pointer transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}
                                                    >
                                                        {isSelected ? (
                                                            <CheckSquare className="w-4 h-4 text-orange-500" />
                                                        ) : (
                                                            <Square className={`w-4 h-4 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} />
                                                        )}
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className={`text-xs font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{video.title}</span>
                                                            <span className={`text-[10px] font-bold uppercase tracking-wider ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                                                {video.subject}
                                                            </span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                            {filteredVideos.length === 0 && (
                                                <div className="p-4 text-center">
                                                    <p className="text-xs text-gray-400 italic">No videos for {subject}</p>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}

                                {selectedVideoIds.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 mt-3">
                                        {availableVideos.filter(v => selectedVideoIds.includes(v.id)).map(video => (
                                            <div key={video.id} className={`flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold ${darkMode ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' : 'bg-orange-50 text-orange-700 border border-orange-100'}`}>
                                                <span className="truncate max-w-[120px]">{video.title}</span>
                                                <button onClick={() => setSelectedVideoIds(selectedVideoIds.filter(id => id !== video.id))}>
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </section>

                        <div className={`h-px ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} hidden lg:block`} />

                        <section className="bg-orange-500/5 rounded-xl p-3 sm:p-4 border border-orange-500/10">
                            <h3 className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-2 sm:mb-3 ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>Stats</h3>
                            <div className="grid grid-cols-2 gap-2 sm:gap-3">
                                <div className={`p-2 sm:p-3 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
                                    <p className={`text-[9px] sm:text-[10px] font-bold uppercase ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Ques</p>
                                    <p className="text-base sm:text-xl font-black">{questions.length}</p>
                                </div>
                                <div className={`p-2 sm:p-3 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
                                    <p className={`text-[9px] sm:text-[10px] font-bold uppercase ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Points</p>
                                    <p className="text-base sm:text-xl font-black text-orange-500">{totalPoints}</p>
                                </div>
                            </div>
                        </section>
                    </div>

                    <div className={`p-4 sm:p-6 border-t ${darkMode ? 'border-gray-800' : 'border-gray-100'}`}>
                        <button onClick={addQuestion} className="w-full flex items-center justify-center gap-2 py-2.5 sm:py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-sm sm:text-base font-bold shadow-lg shadow-orange-500/20 transition-all group active:scale-95">
                            <Plus className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-90 transition-transform" />
                            Add New Question
                        </button>
                    </div>
                </div>

                {/* Main Content - Questions List */}
                <div className={`flex-1 overflow-y-auto p-4 sm:p-8 relative ${darkMode ? 'bg-gray-950' : 'bg-gray-50'}`}>
                    <div className="max-w-4xl mx-auto space-y-4 sm:y-8 pb-12">
                        {questions.length === 0 ? (
                            <div className={`text-center py-20 border-2 border-dashed rounded-3xl ${darkMode ? 'border-gray-800 text-gray-700' : 'border-orange-200 text-orange-300'}`}>
                                <CheckSquare className="w-16 h-16 mx-auto mb-4 opacity-20" />
                                <p className="text-lg font-medium">No questions added yet.</p>
                                <p className="text-sm mt-1">Start by clicking the "Add New Question" button in the sidebar.</p>
                            </div>
                        ) : (
                            questions.map((q, idx) => (
                                <div key={q.id} className={`group rounded-2xl sm:rounded-3xl p-4 sm:p-8 transition-all ${darkMode ? 'bg-gray-900 border border-gray-800 hover:border-orange-500/30' : 'bg-white shadow-lg sm:shadow-xl hover:shadow-2xl border border-transparent hover:border-orange-200'}`}>
                                    <div className="flex items-center justify-between mb-4 sm:mb-8">
                                        <div className="flex items-center gap-2 sm:gap-4">
                                            <div className="bg-gradient-to-br from-orange-400 to-orange-600 text-white rounded-xl sm:rounded-2xl w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center font-black text-sm sm:text-lg shadow-lg shadow-orange-500/30">
                                                {idx + 1}
                                            </div>
                                            <div>
                                                <h4 className={`text-sm sm:text-base font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Question {idx + 1}</h4>
                                                <p className={`text-[10px] sm:text-xs font-semibold ${darkMode ? 'text-orange-500/70' : 'text-orange-600/60'}`}>MCQ • {marksPerQuestion} Points</p>
                                            </div>
                                        </div>
                                        <button onClick={() => deleteQuestion(q.id)} className={`p-2 rounded-lg transition-colors ${darkMode ? 'text-gray-500 hover:bg-red-500/10 hover:text-red-400' : 'text-gray-400 hover:bg-red-50 hover:text-red-500'}`}>
                                            <Trash className="w-4 h-4 sm:w-5 sm:h-5" />
                                        </button>
                                    </div>

                                    <div className="space-y-4 sm:space-y-6">
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                                            <div>
                                                <label className={`block text-[10px] font-bold uppercase tracking-widest mb-1.5 sm:mb-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Question Text</label>
                                                <textarea
                                                    value={q.text}
                                                    onChange={(e) => updateQuestion(q.id, 'text', e.target.value)}
                                                    placeholder="Type your question here..."
                                                    className={`w-full p-3 sm:p-5 border-2 rounded-xl sm:rounded-2xl focus:outline-none transition-all resize-none text-sm sm:text-lg leading-relaxed ${darkMode ? 'bg-gray-800 border-gray-700 text-white focus:border-orange-500' : 'bg-gray-50 border-gray-100 focus:bg-white focus:border-orange-500'}`}
                                                    rows="3"
                                                />
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 sm:gap-4">
                                                <div>
                                                    <label className={`block text-[10px] font-bold uppercase tracking-widest mb-1.5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Subject</label>
                                                    <select
                                                        value={q.subject}
                                                        onChange={(e) => updateQuestion(q.id, 'subject', e.target.value)}
                                                        className={`w-full px-3 py-2 sm:py-3 border-2 rounded-lg sm:rounded-xl text-xs sm:text-sm transition-all focus:ring-4 focus:ring-orange-500/10 outline-none ${darkMode ? 'border-gray-700 bg-gray-800 text-white focus:border-orange-500' : 'border-gray-100 bg-gray-50 focus:bg-white focus:border-orange-500'}`}
                                                    >
                                                        <option value="physics">Physics</option>
                                                        <option value="chemistry">Chemistry</option>
                                                        <option value="biology">Biology</option>
                                                        <option value="botany">Botany</option>
                                                        <option value="zoology">Zoology</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className={`block text-[10px] font-bold uppercase tracking-widest mb-1.5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Topic</label>
                                                    <input
                                                        type="text"
                                                        value={q.topic}
                                                        onChange={(e) => updateQuestion(q.id, 'topic', e.target.value)}
                                                        placeholder="Optics"
                                                        className={`w-full px-3 py-2 sm:py-3 border-2 rounded-lg sm:rounded-xl text-xs sm:text-sm transition-all focus:ring-4 focus:ring-orange-500/10 outline-none ${darkMode ? 'border-gray-700 bg-gray-800 text-white focus:border-orange-500' : 'border-gray-100 bg-gray-50 focus:bg-white focus:border-orange-500'}`}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                            {q.answers.map((ans, aIdx) => {
                                                const isCorrect = (q.correctAnswers || []).includes(aIdx);
                                                return (
                                                    <div key={aIdx} className={`relative group/ans rounded-xl sm:rounded-2xl border-2 transition-all p-3 sm:p-4 ${isCorrect
                                                        ? (darkMode ? 'bg-orange-500/10 border-orange-500/50' : 'bg-orange-50 border-orange-500/30')
                                                        : (darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100')
                                                        }`}>
                                                        <div className="flex items-center gap-2 sm:gap-3">
                                                            <button
                                                                onClick={() => toggleCorrectAnswer(q.id, aIdx)}
                                                                className={`flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all ${isCorrect
                                                                    ? 'bg-orange-500 text-white scale-105 sm:scale-110 shadow-lg shadow-orange-500/30'
                                                                    : (darkMode ? 'bg-gray-700 text-gray-500 hover:bg-gray-600' : 'bg-white text-gray-300 hover:text-gray-400 shadow-sm')
                                                                    }`}
                                                            >
                                                                {isCorrect ? '✓' : String.fromCharCode(65 + aIdx)}
                                                            </button>
                                                            <input
                                                                type="text"
                                                                value={ans}
                                                                onChange={(e) => updateAnswer(q.id, aIdx, e.target.value)}
                                                                placeholder={`Opt ${String.fromCharCode(65 + aIdx)}`}
                                                                className={`flex-1 bg-transparent focus:outline-none font-semibold text-xs sm:text-sm ${darkMode ? 'text-white' : 'text-gray-800'}`}
                                                            />
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        <div className={`p-2 sm:p-4 rounded-lg sm:rounded-xl flex items-center gap-2 sm:gap-3 ${darkMode ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' : 'bg-orange-50 text-orange-700'}`}>
                                            <CheckSquare className="w-3 h-3 sm:w-4 sm:h-4" />
                                            <span className="text-[9px] sm:text-xs font-bold uppercase tracking-wide">
                                                Key: {(q.correctAnswers || []).length > 0 ? (q.correctAnswers || []).map(i => String.fromCharCode(65 + i)).join(', ') : 'None'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                </div>
            </div>

            {showAIGenerator && (
                <AIQuestionGenerator
                    onClose={() => setShowAIGenerator(false)}
                    darkMode={darkMode}
                    onGenerateQuestions={handleAIGenerateQuestions}
                />
            )}
        </div>
    );
};

export default TestBuilder;

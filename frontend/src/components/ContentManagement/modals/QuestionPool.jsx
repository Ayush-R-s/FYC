import React, { useState, useEffect } from 'react';
import { Plus, X, Trash, Save, Search, Filter, ArrowLeft, CheckSquare, Square, Upload, Sparkles } from 'lucide-react';
import { getAllPoolQuestions, addQuestionToPool, updateQuestionInPool, deleteQuestionFromPool, importQuestionsFromPDF, bulkAddQuestionsToPool } from '../../../services/contentPortalApi';

const QuestionPool = ({ onClose, darkMode }) => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterSubject, setFilterSubject] = useState('all');
    const [filterChapter, setFilterChapter] = useState('');
    const [filterTopic, setFilterTopic] = useState('');
    const [editingQuestion, setEditingQuestion] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [importFile, setImportFile] = useState(null);
    const [importSubject, setImportSubject] = useState('physics');
    const [importChapter, setImportChapter] = useState('');
    const [importTopic, setImportTopic] = useState('');
    const [isImporting, setIsImporting] = useState(false);
    const [reviewQuestions, setReviewQuestions] = useState([]);
    const [isReviewMode, setIsReviewMode] = useState(false);
    const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        try {
            setLoading(true);
            const data = await getAllPoolQuestions();
            setQuestions(data);
        } catch (error) {
            console.error('Error fetching questions:', error);
            alert('Failed to load questions from pool.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddOrUpdate = async () => {
        if (!editingQuestion.text || editingQuestion.answers.some(a => !a)) {
            alert('Please fill in question text and all options.');
            return;
        }
        if (editingQuestion.correctAnswers.length === 0) {
            alert('Please select at least one correct answer.');
            return;
        }

        try {
            setIsSaving(true);
            if (editingQuestion?.id) {
                await updateQuestionInPool(editingQuestion.id, editingQuestion);
            } else {
                await addQuestionToPool(editingQuestion);
            }
            await fetchQuestions();
            setEditingQuestion(null);
        } catch (error) {
            console.error('Error saving question:', error);
            const errorMsg = error.response?.data?.message || error.message || 'Unknown error';
            alert(`Failed to save question: ${errorMsg}`);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this question?')) return;
        try {
            await deleteQuestionFromPool(id);
            setQuestions(questions.filter(q => q && q.id !== id));
        } catch (error) {
            console.error('Error deleting question:', error);
            alert('Failed to delete question.');
        }
    };

    const startEditing = (q) => {
        setEditingQuestion(q ? { ...q } : {
            text: '',
            answers: ['', '', '', ''],
            correctAnswers: [],
            subject: 'physics',
            chapter: '',
            topic: '',
            points: 4
        });
    };

    const filteredQuestions = questions.filter(q => {
        if (!q) return false;
        const matchesSearch = q.text?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSubject = filterSubject === 'all' || q.subject?.toLowerCase() === filterSubject.toLowerCase();
        const matchesChapter = !filterChapter || q.chapter?.toLowerCase().includes(filterChapter.toLowerCase());
        const matchesTopic = !filterTopic || q.topic?.toLowerCase().includes(filterTopic.toLowerCase());
        return matchesSearch && matchesSubject && matchesChapter && matchesTopic;
    });

    return (
        <>
            <div className={`fixed inset-0 z-[101] flex flex-col ${darkMode ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
            {/* Header */}
            <div className={`flex-none px-6 h-16 border-b flex items-center justify-between sticky top-0 z-10 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
                <div className="flex items-center gap-4">
                    <button onClick={onClose} className={`p-2 rounded-full transition-colors ${darkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}>
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h2 className="text-xl font-bold">Question Bank Pool</h2>
                </div>
                {!editingQuestion && !isReviewMode && (
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <button 
                                onClick={() => setIsAddMenuOpen(!isAddMenuOpen)}
                                className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg font-bold shadow-lg shadow-orange-500/20 flex items-center gap-2 group transition-all transform active:scale-95"
                            >
                                <Plus className={`w-5 h-5 transition-transform duration-300 ${isAddMenuOpen ? 'rotate-45' : ''}`} /> Add Questions
                            </button>
                            
                            {isAddMenuOpen && (
                                <>
                                    <div className="fixed inset-0 z-[105]" onClick={() => setIsAddMenuOpen(false)} />
                                    <div className={`absolute right-0 mt-3 w-60 rounded-2xl shadow-2xl z-[110] overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300 border-2 ${darkMode ? 'bg-gray-800 border-gray-700 shadow-orange-500/5' : 'bg-white border-orange-50 shadow-xl'}`}>
                                        <button 
                                            onClick={() => { setIsAddMenuOpen(false); startEditing(); }}
                                            className={`w-full px-5 py-4 flex items-center gap-4 text-sm font-bold transition-all ${darkMode ? 'hover:bg-gray-700 text-gray-200' : 'hover:bg-orange-50 text-gray-700 border-b border-gray-50'}`}
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                                                <Square className="w-4 h-4 text-orange-500" />
                                            </div>
                                            <div className="text-left">
                                                <div className="font-bold">Manual Entry</div>
                                                <div className="text-[10px] opacity-50 font-medium">Add questions one by one</div>
                                            </div>
                                        </button>
                                        <button 
                                            onClick={() => { setIsAddMenuOpen(false); setIsImportModalOpen(true); }}
                                            className={`w-full px-5 py-4 flex items-center gap-4 text-sm font-bold transition-all ${darkMode ? 'hover:bg-gray-700 text-gray-200' : 'hover:bg-purple-50 text-gray-700'}`}
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                                                <Sparkles className="w-4 h-4 text-purple-500" />
                                            </div>
                                            <div className="text-left">
                                                <div className="font-bold">Import from PDF</div>
                                                <div className="text-[10px] opacity-50 font-medium">Auto-extract from document</div>
                                            </div>
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}
                {isReviewMode && (
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => { setIsReviewMode(false); setReviewQuestions([]); }}
                            className="px-4 py-2 text-gray-500 font-bold hover:text-gray-700"
                        >
                            Discard All
                        </button>
                        <button 
                            onClick={async () => {
                                try {
                                    setIsSaving(true);
                                    await bulkAddQuestionsToPool(reviewQuestions);
                                    alert(`Successfully added ${reviewQuestions.length} questions to pool!`);
                                    setIsReviewMode(false);
                                    setReviewQuestions([]);
                                    fetchQuestions();
                                } catch (err) {
                                    const errorMsg = err.response?.data?.message || err.message || 'Unknown error';
                                    alert(`Failed to bulk save questions: ${errorMsg}`);
                                } finally {
                                    setIsSaving(false);
                                }
                            }}
                            className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-bold shadow-lg shadow-orange-500/20 flex items-center gap-2"
                        >
                            <Save size={18} /> Finish & Add to Bank
                        </button>
                    </div>
                )}
            </div>

            {isReviewMode ? (
                /* Review Mode */
                <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-purple-500/5">
                    <div className="max-w-5xl mx-auto space-y-6">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-2xl font-black italic tracking-tight text-orange-600 dark:text-orange-400">Review Extraction</h3>
                                <p className="text-sm font-medium opacity-60">Please verify and edit the extracted questions below before adding them to the bank.</p>
                            </div>
                            <div className="bg-orange-600 text-white px-4 py-1.5 rounded-full font-black text-xs uppercase tracking-widest shadow-lg shadow-orange-500/30">
                                {reviewQuestions.length} Questions Found
                            </div>
                        </div>
                        
                        {reviewQuestions.map((q, qIdx) => (
                            <div key={qIdx} className={`rounded-[30px] p-8 border-2 transition-all ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-orange-100 shadow-xl shadow-orange-500/5'}`}>
                                <div className="space-y-6">
                                    <div className="flex justify-between items-start gap-4">
                                        <div className="flex-1">
                                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] mb-2 text-orange-500/60">Question Text</label>
                                            <textarea 
                                                value={q.text}
                                                onChange={(e) => {
                                                    const newReview = [...reviewQuestions];
                                                    newReview[qIdx].text = e.target.value;
                                                    setReviewQuestions(newReview);
                                                }}
                                                className={`w-full p-4 rounded-2xl border-2 transition-all outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 resize-none ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100'}`}
                                                rows={3}
                                            />
                                        </div>
                                        <button 
                                            onClick={() => setReviewQuestions(reviewQuestions.filter((_, i) => i !== qIdx))}
                                            className="p-3 text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            <Trash size={20} />
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {q.answers.map((ans, aIdx) => (
                                            <div key={aIdx} className={`group flex items-center gap-3 p-3 rounded-2xl border-2 transition-all ${q.correctAnswers.includes(aIdx) ? 'border-orange-500 bg-orange-500/5' : (darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100')}`}>
                                                <button 
                                                    onClick={() => {
                                                        const newReview = [...reviewQuestions];
                                                        newReview[qIdx].correctAnswers = [aIdx]; // Single choice for extraction usually
                                                        setReviewQuestions(newReview);
                                                    }}
                                                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${q.correctAnswers.includes(aIdx) ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-400'}`}
                                                >
                                                    {String.fromCharCode(65 + aIdx)}
                                                </button>
                                                <input 
                                                    type="text" 
                                                    value={ans}
                                                    onChange={(e) => {
                                                        const newReview = [...reviewQuestions];
                                                        newReview[qIdx].answers[aIdx] = e.target.value;
                                                        setReviewQuestions(newReview);
                                                    }}
                                                    className="bg-transparent flex-1 outline-none text-sm font-bold"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : editingQuestion ? (
                /* Edit Mode */
                <div className="flex-1 overflow-y-auto p-8">
                    <div className="max-w-3xl mx-auto space-y-8">
                        <div className={`rounded-3xl p-8 ${darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white shadow-xl border border-gray-100'}`}>
                            <div className="flex justify-between items-start mb-8">
                                <h3 className="text-xl font-bold">{editingQuestion?.id ? 'Edit Question' : 'New Question Entry'}</h3>
                                <button onClick={() => setEditingQuestion(null)} className="text-gray-400 hover:text-gray-600"><X /></button>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-gray-500">Subject</label>
                                    <select 
                                        value={editingQuestion.subject} 
                                        onChange={(e) => setEditingQuestion({...editingQuestion, subject: e.target.value})}
                                        className={`w-full p-3 rounded-xl border-2 transition-all ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-100'}`}
                                    >
                                        <option value="physics">Physics</option>
                                        <option value="chemistry">Chemistry</option>
                                        <option value="biology">Biology</option>
                                        <option value="botany">Botany</option>
                                        <option value="zoology">Zoology</option>
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-gray-500">Chapter</label>
                                        <input 
                                            type="text"
                                            value={editingQuestion.chapter || ''}
                                            onChange={(e) => setEditingQuestion({...editingQuestion, chapter: e.target.value})}
                                            placeholder="e.g. Atomic Structure"
                                            className={`w-full p-3 rounded-xl border-2 transition-all ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-100'}`}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-gray-500">Topic</label>
                                        <input 
                                            type="text"
                                            value={editingQuestion.topic || ''}
                                            onChange={(e) => setEditingQuestion({...editingQuestion, topic: e.target.value})}
                                            placeholder="e.g. Bohr Model"
                                            className={`w-full p-3 rounded-xl border-2 transition-all ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-100'}`}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-gray-500">Question Text</label>
                                    <textarea 
                                        value={editingQuestion.text}
                                        onChange={(e) => setEditingQuestion({...editingQuestion, text: e.target.value})}
                                        placeholder="Enter the question..."
                                        className={`w-full p-4 rounded-xl border-2 resize-none h-32 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-100'}`}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    {editingQuestion.answers.map((ans, idx) => (
                                        <div key={idx} className={`p-4 rounded-xl border-2 flex items-center gap-3 ${editingQuestion.correctAnswers.includes(idx) ? 'border-orange-500 bg-orange-500/5' : (darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100')}`}>
                                            <button 
                                                onClick={() => {
                                                    const cur = editingQuestion.correctAnswers;
                                                    setEditingQuestion({
                                                        ...editingQuestion,
                                                        correctAnswers: cur.includes(idx) ? cur.filter(i => i !== idx) : [...cur, idx]
                                                    });
                                                }}
                                                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${editingQuestion.correctAnswers.includes(idx) ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-400'}`}
                                            >
                                                {String.fromCharCode(65 + idx)}
                                            </button>
                                            <input 
                                                type="text" 
                                                value={ans}
                                                onChange={(e) => {
                                                    const newAns = [...editingQuestion.answers];
                                                    newAns[idx] = e.target.value;
                                                    setEditingQuestion({...editingQuestion, answers: newAns});
                                                }}
                                                placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                                                className="bg-transparent flex-1 outline-none font-medium"
                                            />
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-6 flex justify-end gap-4">
                                    <button onClick={() => setEditingQuestion(null)} className="px-6 py-2 rounded-lg font-bold text-gray-500">Cancel</button>
                                    <button 
                                        onClick={handleAddOrUpdate} 
                                        disabled={isSaving}
                                        className="px-8 py-2 bg-orange-600 text-white rounded-lg font-bold flex items-center gap-2 hover:bg-orange-700 transition-colors disabled:opacity-50"
                                    >
                                        <Save size={18} /> {isSaving ? 'Saving...' : 'Save to Pool'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                /* List View */
                <div className="flex-1 flex flex-col overflow-hidden">
                    <div className={`p-6 border-b ${darkMode ? 'bg-gray-900/50 border-gray-800' : 'bg-white border-gray-100'}`}>
                        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input 
                                    type="text" 
                                    placeholder="Search questions..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className={`w-full pl-10 pr-4 py-2 rounded-xl border-2 outline-none transition-all focus:border-orange-500 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100'}`}
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <Filter size={18} className="text-gray-400" />
                                <select 
                                    value={filterSubject}
                                    onChange={(e) => setFilterSubject(e.target.value)}
                                    className={`px-4 py-2 rounded-xl border-2 outline-none ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100'}`}
                                >
                                    <option value="all">All Subjects</option>
                                    <option value="physics">Physics</option>
                                    <option value="chemistry">Chemistry</option>
                                    <option value="biology">Biology</option>
                                    <option value="botany">Botany</option>
                                    <option value="zoology">Zoology</option>
                                </select>
                                <input 
                                    type="text" 
                                    placeholder="Chapter..."
                                    value={filterChapter}
                                    onChange={(e) => setFilterChapter(e.target.value)}
                                    className={`w-32 px-4 py-2 rounded-xl border-2 outline-none ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100'}`}
                                />
                                <input 
                                    type="text" 
                                    placeholder="Topic..."
                                    value={filterTopic}
                                    onChange={(e) => setFilterTopic(e.target.value)}
                                    className={`w-32 px-4 py-2 rounded-xl border-2 outline-none ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100'}`}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6">
                        <div className="max-w-6xl mx-auto space-y-4">
                            {loading ? (
                                <div className="text-center py-20 text-gray-400">Loading question bank...</div>
                            ) : filteredQuestions.length === 0 ? (
                                <div className="text-center py-20 text-gray-400">No questions found matching your criteria.</div>
                            ) : (
                                filteredQuestions.map(q => q && (
                                    <div key={q.id} className={`group rounded-2xl p-6 transition-all border ${darkMode ? 'bg-gray-900 border-gray-800 hover:border-orange-500/50' : 'bg-white border-gray-100 hover:shadow-lg'}`}>
                                        <div className="flex justify-between items-start gap-4 mb-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${darkMode ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-50 text-orange-600'}`}>
                                                        {q.subject}
                                                    </span>
                                                    {(q.chapter || q.topic) && (
                                                        <span className="text-[10px] text-gray-400">
                                                            | {q.chapter} {q.chapter && q.topic ? '•' : ''} {q.topic}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-lg font-medium leading-relaxed">{q.text}</p>
                                            </div>
                                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => startEditing(q)} className="p-2 text-gray-400 hover:text-orange-500 transition-colors"><Plus size={18} /></button>
                                                <button onClick={() => handleDelete(q.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><Trash size={18} /></button>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                            {q.answers?.map((ans, idx) => (
                                                <div key={idx} className={`text-xs p-2 rounded-lg border flex items-center gap-2 ${q.correctAnswers?.includes(idx) ? 'bg-orange-500/10 border-orange-500/30 text-orange-500' : 'border-gray-100 opacity-60'}`}>
                                                    <span className="font-bold">{String.fromCharCode(65 + idx)}.</span>
                                                    <span className="truncate">{ans}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))
                            )}
                    </div>
                </div>
            </div>
            )}
        </div>

        {/* Import Modal - Root Level Rendering for high visibility */}
        {isImportModalOpen && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[500] p-4 animate-in fade-in duration-300">
                <div className={`${darkMode ? 'bg-gray-900 border border-gray-800 shadow-orange-500/10' : 'bg-white shadow-2xl'} rounded-[40px] w-full max-w-xl max-h-[95vh] flex flex-col overflow-hidden shadow-2xl scale-in-center animate-in zoom-in-95 duration-300`}>
                    <div className={`p-8 border-b flex items-center justify-between ${darkMode ? 'border-gray-800' : 'border-gray-50'}`}>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center">
                                <Sparkles className="text-orange-500 w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black italic tracking-tight uppercase">Smart Import</h3>
                                <div className="text-xs font-bold text-gray-400">PDF Extraction Engine</div>
                            </div>
                        </div>
                        <button 
                            onClick={() => setIsImportModalOpen(false)} 
                            className={`p-3 rounded-full transition-all ${darkMode ? 'hover:bg-gray-800 text-gray-500' : 'hover:bg-gray-100 text-gray-400'}`}
                        >
                            <X size={24} />
                        </button>
                    </div>
                    <div className="p-6 sm:p-8 space-y-6 text-left overflow-y-auto flex-1">
                        <div className={`p-4 rounded-2xl border-2 border-dashed ${darkMode ? 'bg-orange-500/5 border-orange-500/20' : 'bg-orange-50 border-orange-200 text-orange-600'}`}>
                            <p className="text-sm font-bold leading-relaxed text-center">
                                PDF Extraction Optimized for: <code className="bg-orange-500/10 px-1.5 py-0.5 rounded text-orange-600">Q1.</code>, <code className="bg-orange-500/10 px-1.5 py-0.5 rounded text-orange-600">* (a)</code>, and <code className="bg-orange-500/10 px-1.5 py-0.5 rounded text-orange-600">Answer: (c)</code> formats.
                            </p>
                        </div>
                        
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                                <Search size={12} /> Target Subject
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {['physics', 'chemistry', 'biology', 'botany', 'zoology'].map(sub => (
                                    <button
                                        key={sub}
                                        onClick={() => setImportSubject(sub)}
                                        className={`px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${importSubject === sub ? 'border-orange-600 bg-orange-600 text-white shadow-lg shadow-orange-500/20' : (darkMode ? 'bg-gray-800 border-gray-700 text-gray-400' : 'bg-gray-50 border-gray-100 text-gray-400 hover:border-orange-200')}`}
                                    >
                                        {sub}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Chapter</label>
                                <input 
                                    type="text" 
                                    value={importChapter}
                                    onChange={(e) => setImportChapter(e.target.value)}
                                    placeholder="Chapter Name"
                                    className={`w-full px-4 py-3 rounded-xl border-2 outline-none ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-100 text-gray-700'}`}
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Topic</label>
                                <input 
                                    type="text" 
                                    value={importTopic}
                                    onChange={(e) => setImportTopic(e.target.value)}
                                    placeholder="Topic Name"
                                    className={`w-full px-4 py-3 rounded-xl border-2 outline-none ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-100 text-gray-700'}`}
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Document Upload</label>
                            <label className={`border-4 border-dashed rounded-[30px] p-8 text-center cursor-pointer block transition-all group ${importFile ? 'border-orange-500 bg-orange-500/5' : (darkMode ? 'border-gray-800 hover:border-orange-500' : 'border-gray-100 hover:border-orange-600 hover:bg-orange-50/30')}`}>
                                <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center transition-all ${importFile ? 'bg-orange-500 text-white shadow-xl shadow-orange-500/30' : 'bg-gray-100 text-gray-400 group-hover:bg-orange-600 group-hover:text-white'}`}>
                                    <Upload className="w-6 h-6" />
                                </div>
                                <p className="font-black italic text-lg">{importFile ? importFile.name : 'Drop PDF Here'}</p>
                                <p className="text-[10px] font-bold opacity-40 mt-1 uppercase tracking-widest">Supports documents up to 10MB</p>
                                <input 
                                    type="file" 
                                    className="hidden" 
                                    accept=".pdf"
                                    onChange={(e) => setImportFile(e.target.files[0])}
                                />
                            </label>
                        </div>

                        <button 
                            onClick={async () => {
                                if (!importFile) return;
                                try {
                                    setIsImporting(true);
                                    const result = await importQuestionsFromPDF(importFile, importSubject, importChapter, importTopic);
                                    
                                    if (result.length === 0) {
                                        alert('No questions were identified in this document. \n\nTroubleshooting Tip: Ensure the questions are numbered (1., Q1.) and options are labeled (a, b, c). \n\nCheck the server console for "DEBUG" logs to see the raw text extraction.');
                                        setIsImporting(false);
                                        return;
                                    }

                                    setReviewQuestions(result.map(q => ({
                                        ...q,
                                        answers: q.answers || ['', '', '', ''],
                                        correctAnswers: q.correctAnswers || [0],
                                        points: 4,
                                        subject: importSubject,
                                        chapter: importChapter,
                                        topic: importTopic
                                    })));
                                    setIsReviewMode(true);
                                    setIsImportModalOpen(false);
                                    setImportFile(null);
                                } catch (err) {
                                    console.error(err);
                                    alert('Failed to parse document. Please ensure it has a clear question-answer structure.');
                                } finally {
                                    setIsImporting(false);
                                }
                            }}
                            disabled={!importFile || isImporting}
                            className={`w-full py-5 rounded-2xl font-black italic uppercase tracking-widest text-lg text-white shadow-2xl transition-all ${!importFile || isImporting ? 'bg-gray-400 cursor-not-allowed opacity-50' : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:scale-[1.02] hover:shadow-orange-500/30 active:scale-95'}`}
                        >
                            {isImporting ? 'Parsing...' : 'Analyze Document'}
                        </button>
                    </div>
                </div>
            </div>
        )}
        </>
    );
};

export default QuestionPool;

import React, { useState } from 'react';
import { X, Upload, Sparkles } from 'lucide-react';
import { generateAIQuestions } from '../../../services/contentPortalApi';

const AIQuestionGenerator = ({ onClose, darkMode, onGenerateQuestions }) => {
    const [numQuestions, setNumQuestions] = useState(5);
    const [difficulty, setDifficulty] = useState('Easy');
    const [uploadedFile, setUploadedFile] = useState(null);
    const [fileName, setFileName] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState('');
    const [uploadProgress, setUploadProgress] = useState(0);

    const handleFileUpload = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setUploadedFile(file); // Store the actual file object
            setFileName(file.name);
            setError('');
        }
    };
    const handleGenerateQuestions = async () => {
        if (!uploadedFile) {
            setError('Please upload a file first');
            return;
        }

        setIsGenerating(true);
        setError('');

        try {
            const generatedQuestions = await generateAIQuestions(uploadedFile, numQuestions, difficulty, (progressEvent) => {
                if (progressEvent.total) {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(percentCompleted);
                }
            });

            // Transform the response to match expected format
            const formattedQuestions = generatedQuestions.map((q, i) => ({
                id: Date.now() + i,
                text: q.questionText || q.question,
                options: q.options || [],
                correctAnswer: q.correctAnswer || q.answer,
                subject: q.subject || 'AI Generated',
                chapter: q.chapter || '',
                topic: q.topic || '',
                difficulty: q.difficulty || difficulty
            }));

            onGenerateQuestions(formattedQuestions);
            alert('Questions generated successfully!');
            onClose();
        } catch (err) {
            console.error('AI Generation Error Details:', {
                message: err.message,
                response: err.response?.data,
                status: err.response?.status,
                endpoint: '/admin/content/ai/generate'
            });
            setError(err.response?.data?.message || 'Failed to generate questions. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className={`${darkMode ? 'bg-gray-900' : 'bg-white'} rounded-2xl shadow-xl w-full max-w-2xl`}>
                <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between`}>
                    <h2 className={`font-bold text-xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>AI Question Generator</h2>
                    <button onClick={onClose} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}>
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                            {error}
                        </div>
                    )}
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Upload your study materials to generate questions
                    </p>

                    <div>
                        <label className={`block text-sm font-semibold mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Upload Study Materials</label>
                        <label className={`border-2 border-dashed rounded-xl p-8 text-center hover:border-purple-500 cursor-pointer block transition-colors ${uploadedFile ? (darkMode ? 'border-purple-500 bg-purple-900/20' : 'border-purple-500 bg-purple-50') : (darkMode ? 'border-gray-600' : 'border-gray-300')}`}>
                            <Upload className={`w-12 h-12 mx-auto mb-3 ${uploadedFile ? 'text-purple-500' : 'text-gray-400'}`} />
                            <p className={`font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                {fileName ? fileName : 'Click to upload or drag files here'}
                            </p>
                            <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>PDF, Word documents, or text files</p>
                            <input type="file" onChange={handleFileUpload} accept=".pdf,.docx,.doc,.txt" className="hidden" />
                        </label>
                    </div>

                    <div className={`rounded-lg p-4 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                        <h3 className={`font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Generation Settings</h3>
                        <div className="space-y-4">
                            <div>
                                <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Number of Questions</label>
                                <input type="number" min="1" max="50" value={numQuestions} onChange={(e) => setNumQuestions(Math.max(1, parseInt(e.target.value) || 1))} className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300'}`} />
                            </div>
                            <div>
                                <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Difficulty Level</label>
                                <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'border-gray-700 bg-gray-700 text-white' : 'border-gray-300'}`}>
                                    <option>Easy</option>
                                    <option>Medium</option>
                                    <option>Hard</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className={`rounded-lg p-4 flex gap-3 ${darkMode ? 'bg-purple-900/30 border border-purple-700' : 'bg-purple-50 border border-purple-200'}`}>
                        <Sparkles className={`w-5 h-5 flex-shrink-0 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                        <div>
                            <p className={`font-semibold text-sm ${darkMode ? 'text-purple-300' : 'text-purple-900'}`}>AI-Powered Generation</p>
                            <p className={`text-sm mt-1 ${darkMode ? 'text-purple-200/70' : 'text-purple-800'}`}>
                                Our AI will analyze your uploaded materials and create relevant questions based on the content. Questions will be automatically formatted with multiple choice answers.
                            </p>
                        </div>
                    </div>
                    
                    {/* Progress Bar */}
                    {isGenerating && (
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Uploading... {uploadProgress}%
                                </span>
                            </div>
                            <div className={`w-full rounded-full h-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                                <div
                                    className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 ease-out"
                                    style={{ width: `${uploadProgress}%` }}
                                />
                            </div>
                            {uploadProgress === 100 && (
                                <p className={`text-xs animate-pulse ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                                    AI is now analyzing your content. This may take a moment...
                                </p>
                            )}
                        </div>
                    )}
                </div>

                <div className={`p-6 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex gap-3 justify-end`}>
                    <button onClick={onClose} disabled={isGenerating} className={`px-6 py-2 border rounded-lg font-semibold ${darkMode ? 'border-gray-600 hover:bg-gray-800 text-white' : 'border-gray-300 hover:bg-gray-50'} disabled:opacity-50`}>
                        Cancel
                    </button>
                    <button onClick={handleGenerateQuestions} disabled={!uploadedFile || isGenerating} className={`px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:bg-gray-400 text-white rounded-lg font-semibold flex items-center gap-2 disabled:opacity-50`}>
                        <Sparkles className="w-4 h-4" />
                        {isGenerating ? 'Generating...' : 'Generate Questions'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AIQuestionGenerator;

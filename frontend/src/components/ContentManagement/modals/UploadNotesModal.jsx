import React, { useState } from 'react';
import { X, Upload } from 'lucide-react';
import { uploadNotes } from '../../../services/contentPortalApi';

const UploadNotesModal = ({ onClose, darkMode, onUpload, intendedType, initialClass }) => {
    // Map intendedType (from sidebar/tabs) to internal contentType
    const initialContentType = intendedType === 'textbooks' ? 'TEXTBOOK' : (intendedType === 'pyqs' ? 'PYQ' : 'NOTES');

    const [title, setTitle] = useState('');
    const [subject, setSubject] = useState('Physics');
    const [topic, setTopic] = useState('');
    const [classLevel, setClassLevel] = useState(initialClass || '11');
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState('');
    const [year, setYear] = useState('');
    const [contentType, setContentType] = useState(initialContentType);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setFileName(selectedFile.name);
            setError('');
        }
    };

    const handleUpload = async () => {
        if (!title || !file) {
            setError('Please fill in all required fields');
            return;
        }

        setLoading(true);
        setError('');

        console.log(`DEBUG: Handing upload for ${contentType}. initialClass was ${initialClass}, current classLevel is ${classLevel}`);
        try {
            const finalSubject = contentType === 'PYQ' ? 'PYQ' : subject;
            const description = contentType === 'PYQ' ? `Previous Year Question - ${year}` : `${subject}${topic ? ' - ' + topic : ''}`;
            console.log(`DEBUG: Final API payload - contentType: ${contentType}, classLevel: ${classLevel}, title: ${title}, subject: ${finalSubject}`);
            // Pages is now null as it is automated in the backend
            const uploadedNote = await uploadNotes(file, title, finalSubject, topic, null, description, contentType, classLevel, year);
            onUpload(uploadedNote);
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to upload content. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className={`${darkMode ? 'bg-gray-900' : 'bg-white'} rounded-2xl shadow-xl w-full max-w-2xl`}>
                <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between`}>
                    <h2 className={`font-bold text-xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Upload {contentType === 'TEXTBOOK' ? 'Textbook' : (contentType === 'PYQ' ? 'PYQ' : 'Notes')}
                    </h2>
                    <button onClick={onClose} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}><X className="w-5 h-5" /></button>
                </div>
                <div className="p-6 space-y-4">
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                            {error}
                        </div>
                    )}
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Title / {contentType === 'TEXTBOOK' ? 'Book Name' : 'Topic Name'} *</label>
                            <input type="text" placeholder={contentType === 'TEXTBOOK' ? 'Enter book title' : 'Enter title'} value={title} onChange={(e) => setTitle(e.target.value)} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none ${darkMode ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-300'}`} />
                        </div>
                    </div>
                    <div className={`grid ${contentType === 'PYQ' ? 'grid-cols-2' : 'grid-cols-2'} gap-4`}>
                        <div>
                            <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Class *</label>
                            <select value={classLevel} onChange={(e) => setClassLevel(e.target.value)} className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-300'}`}>
                                <option value="11">11th</option>
                                <option value="12">12th</option>
                            </select>
                        </div>
                        {contentType === 'PYQ' ? (
                            <div>
                                <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Exam Year *</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. 2023" 
                                    value={year} 
                                    onChange={(e) => setYear(e.target.value)} 
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none ${darkMode ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-300'}`} 
                                />
                            </div>
                        ) : (
                            <div>
                                <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Subject *</label>
                                <select value={subject} onChange={(e) => setSubject(e.target.value)} className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-300'}`}>
                                    <option>Physics</option>
                                    <option>Chemistry</option>
                                    <option>Biology</option>
                                    {contentType !== 'TEXTBOOK' && <option>Botany</option>}
                                    {contentType !== 'TEXTBOOK' && <option>Zoology</option>}
                                </select>
                            </div>
                        )}
                    </div>
                        {contentType !== 'TEXTBOOK' && contentType !== 'PYQ' && (
                            <div>
                                <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Topic (optional)</label>
                                <input type="text" placeholder="Enter topic" value={topic} onChange={(e) => setTopic(e.target.value)} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none ${darkMode ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-300'}`} />
                            </div>
                        )}
                        <div>
                        <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>File Upload *</label>
                        <label className={`border-2 border-dashed rounded-lg p-8 text-center hover:border-orange-500 cursor-pointer block ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}>
                            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{fileName || 'Click to upload PDF, Word, or PPT'}</p>
                            <input type="file" onChange={handleFileChange} accept=".pdf,.docx,.ppt,.pptx,.doc" className="hidden" />
                        </label>
                    </div>
                </div>
                <div className={`p-6 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex gap-3 justify-end`}>
                    <button onClick={onClose} disabled={loading} className={`px-6 py-2 border rounded-lg ${darkMode ? 'border-gray-600 hover:bg-gray-800 text-white' : 'border-gray-300 hover:bg-gray-50'}`}>Cancel</button>
                    <button onClick={handleUpload} disabled={!title || !file || (contentType === 'PYQ' && !year) || loading} className="px-6 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white rounded-lg font-semibold">
                        {loading ? 'Uploading...' : 'Upload'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default UploadNotesModal;

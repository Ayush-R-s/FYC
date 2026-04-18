import React, { useState, useRef } from 'react';
import { X, Upload } from 'lucide-react';
import { getPresignedVideoUrl, uploadVideoMetadata } from '../../../services/contentPortalApi';

const UploadVideoModal = ({ onClose, darkMode, onUpload }) => {
    const [title, setTitle] = useState('');
    const [subject, setSubject] = useState('Physics');
    const [category, setCategory] = useState('11');
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState('');
    const [fileSize, setFileSize] = useState('');
    const [duration, setDuration] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadPhase, setUploadPhase] = useState(''); // 'preparing', 'uploading', 'saving'
    const xhrRef = useRef(null);

    const formatDuration = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const formatFileSize = (bytes) => {
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
        return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setFileName(selectedFile.name);
            setFileSize(formatFileSize(selectedFile.size));
            setError('');

            // Auto-detect duration
            const videoElement = document.createElement('video');
            videoElement.preload = 'metadata';
            videoElement.onloadedmetadata = () => {
                window.URL.revokeObjectURL(videoElement.src);
                setDuration(formatDuration(videoElement.duration));
            };
            videoElement.src = URL.createObjectURL(selectedFile);
        }
    };

    const uploadToS3WithProgress = (url, file) => {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhrRef.current = xhr;

            xhr.upload.addEventListener('progress', (event) => {
                if (event.lengthComputable) {
                    const percent = Math.round((event.loaded / event.total) * 100);
                    setUploadProgress(percent);
                }
            });

            xhr.addEventListener('load', () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve();
                } else {
                    reject(new Error(`S3 upload failed with status ${xhr.status}`));
                }
            });

            xhr.addEventListener('error', () => reject(new Error('Network error during upload')));
            xhr.addEventListener('abort', () => reject(new Error('Upload cancelled')));

            xhr.open('PUT', url);
            xhr.setRequestHeader('Content-Type', file.type);
            xhr.send(file);
        });
    };

    const handleCancel = () => {
        if (xhrRef.current && loading) {
            xhrRef.current.abort();
            xhrRef.current = null;
            setLoading(false);
            setUploadProgress(0);
            setUploadPhase('');
        } else {
            onClose();
        }
    };

    const handleUpload = async () => {
        if (!title || !file) {
            setError('Please fill in all required fields');
            return;
        }

        setLoading(true);
        setError('');
        setUploadProgress(0);

        try {
            // 1. Get Presigned URL
            setUploadPhase('preparing');
            const { url, key } = await getPresignedVideoUrl(file.name, file.type);

            // 2. Upload directly to S3 with progress tracking
            setUploadPhase('uploading');
            await uploadToS3WithProgress(url, file);

            // 3. Save metadata to backend
            setUploadPhase('saving');
            setUploadProgress(100);
            const uploadedVideo = await uploadVideoMetadata(key, file.name, title, subject, duration, category);

            onUpload(uploadedVideo);
            onClose();
        } catch (err) {
            if (err.message === 'Upload cancelled') {
                setError('Upload was cancelled.');
            } else {
                setError(err.response?.data?.message || err.message || 'Failed to upload video. Please try again.');
            }
        } finally {
            setLoading(false);
            xhrRef.current = null;
        }
    };

    const getPhaseLabel = () => {
        switch (uploadPhase) {
            case 'preparing': return 'Getting upload URL...';
            case 'uploading': return `Uploading to storage... ${uploadProgress}%`;
            case 'saving': return 'Saving video metadata...';
            default: return 'Uploading...';
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className={`${darkMode ? 'bg-gray-900' : 'bg-white'} rounded-2xl shadow-xl w-full max-w-2xl`}>
                <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between`}>
                    <h2 className={`font-bold text-xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>Upload Video</h2>
                    <button onClick={handleCancel} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}><X className="w-5 h-5" /></button>
                </div>
                <div className="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                            {error}
                        </div>
                    )}
                    <div>
                        <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Topic Name *</label>
                        <input type="text" placeholder="Enter video topic" value={title} onChange={(e) => setTitle(e.target.value)} className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-300'}`} disabled={loading} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Subject *</label>
                            <select value={subject} onChange={(e) => setSubject(e.target.value)} className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-300'}`} disabled={loading}>
                                <option>Physics</option>
                                <option>Chemistry</option>
                                <option>Biology</option>
                                <option>Botany</option>
                                <option>Zoology</option>
                            </select>
                        </div>
                        <div>
                            <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Class Level *</label>
                            <select value={category} onChange={(e) => setCategory(e.target.value)} className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-300'}`} disabled={loading}>
                                <option value="11">Class 11th</option>
                                <option value="12">Class 12th</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Video File *</label>
                        <label className={`border-2 border-dashed rounded-lg p-8 text-center hover:border-orange-500 cursor-pointer block ${darkMode ? 'border-gray-600' : 'border-gray-300'} ${loading ? 'pointer-events-none opacity-50' : ''}`}>
                            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{fileName || 'Click to upload MP4 or MOV video'}</p>
                            {fileSize && (
                                <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                    Size: {fileSize}
                                </p>
                            )}
                            {duration && (
                                <p className={`text-xs mt-1 font-mono ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>
                                    Detected Length: {duration}
                                </p>
                            )}
                            <input type="file" onChange={handleFileChange} accept=".mp4,.mov" className="hidden" disabled={loading} />
                        </label>
                    </div>

                    {/* Progress Bar */}
                    {loading && (
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    {getPhaseLabel()}
                                </span>
                            </div>
                            <div className={`w-full rounded-full h-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                                <div
                                    className="h-3 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 transition-all duration-300 ease-out"
                                    style={{ width: `${uploadPhase === 'preparing' ? 5 : uploadProgress}%` }}
                                />
                            </div>
                            {uploadPhase === 'uploading' && (
                                <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                    Video is uploading directly to cloud storage. Please don't close this window.
                                </p>
                            )}
                        </div>
                    )}
                </div>
                <div className={`p-6 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex gap-3 justify-end`}>
                    <button onClick={handleCancel} className={`px-6 py-2 border rounded-lg ${darkMode ? 'border-gray-600 hover:bg-gray-800 text-white' : 'border-gray-300'}`}>
                        {loading ? 'Cancel Upload' : 'Cancel'}
                    </button>
                    <button onClick={handleUpload} disabled={!title || !file || loading} className="px-6 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white rounded-lg font-semibold">
                        {loading ? getPhaseLabel() : 'Upload'}
                    </button>
                </div>
            </div>
        </div>
    );

};

export default UploadVideoModal;

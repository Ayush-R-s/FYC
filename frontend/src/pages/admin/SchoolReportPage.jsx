import React, { useState, useEffect } from 'react';
import { fetchSchools, downloadSchoolReport } from '../../utils/api';
import { FileText, Download, Calendar, School, BarChart2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function SchoolReportPage() {
    const [schools, setSchools] = useState([]);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);
    const [message, setMessage] = useState(null);

    const [formData, setFormData] = useState({
        schoolName: '',
        from: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
        to: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        const loadSchools = async () => {
            const data = await fetchSchools();
            setSchools(data);
            if (data.length > 0) {
                setFormData(prev => ({ ...prev, schoolName: data[0] }));
            }
            setLoading(false);
        };
        loadSchools();
    }, []);

    const handleDownload = async (e) => {
        e.preventDefault();
        setDownloading(true);
        setMessage(null);

        const success = await downloadSchoolReport(formData.schoolName, formData.from, formData.to);

        if (success) {
            setMessage({ type: 'success', text: 'Report generated and download started!' });
        } else {
            setMessage({ type: 'error', text: 'Failed to generate report. Please try again.' });
        }
        setDownloading(false);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-10 h-10 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    <FileText className="text-orange-500" />
                    School-Based Reports
                </h1>
                <p className="text-slate-50 text-sm mt-1">Generate comprehensive performance reports for specific schools and time periods.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                    <form className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden" onSubmit={handleDownload}>
                        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                <BarChart2 size={18} className="text-orange-500" />
                                Report Parameters
                            </h3>
                        </div>

                        <div className="p-6 space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Select School</label>
                                <div className="relative">
                                    <select
                                        value={formData.schoolName}
                                        onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all appearance-none"
                                        required
                                    >
                                        {schools.map(school => (
                                            <option key={school} value={school}>{school}</option>
                                        ))}
                                    </select>
                                    <School className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">From Date</label>
                                    <div className="relative">
                                        <input
                                            type="date"
                                            value={formData.from}
                                            onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                                            required
                                        />
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">To Date</label>
                                    <div className="relative">
                                        <input
                                            type="date"
                                            value={formData.to}
                                            onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                                            required
                                        />
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    </div>
                                </div>
                            </div>

                            {message && (
                                <div className={`p-4 rounded-xl flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
                                    }`}>
                                    {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                                    <span className="text-sm font-medium">{message.text}</span>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={downloading || schools.length === 0}
                                className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-500/30 transition-all flex items-center justify-center gap-2 mt-4"
                            >
                                {downloading ? (
                                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <Download size={20} />
                                )}
                                {downloading ? 'Generating Report...' : 'Generate & Download Excel'}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="space-y-6">
                    <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl h-full">
                        <h3 className="font-bold mb-4 flex items-center gap-2">
                            <AlertCircle size={18} className="text-orange-500" />
                            Report Includes
                        </h3>
                        <ul className="space-y-4">
                            <li className="flex gap-3 items-start">
                                <div className="w-5 h-5 bg-orange-500/20 text-orange-500 rounded flex items-center justify-center shrink-0 mt-0.5">
                                    <CheckCircle2 size={12} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold">Student Roster</p>
                                    <p className="text-xs text-slate-400">Complete list of students per school.</p>
                                </div>
                            </li>
                            <li className="flex gap-3 items-start">
                                <div className="w-5 h-5 bg-orange-500/20 text-orange-500 rounded flex items-center justify-center shrink-0 mt-0.5">
                                    <CheckCircle2 size={12} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold">Performance Metrics</p>
                                    <p className="text-xs text-slate-400">Scores, strong areas, and weak areas.</p>
                                </div>
                            </li>
                            <li className="flex gap-3 items-start">
                                <div className="w-5 h-5 bg-orange-500/20 text-orange-500 rounded flex items-center justify-center shrink-0 mt-0.5">
                                    <CheckCircle2 size={12} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold">Top 10 Students</p>
                                    <p className="text-xs text-slate-400">Ranked performance for the selected period.</p>
                                </div>
                            </li>
                            <li className="flex gap-3 items-start">
                                <div className="w-5 h-5 bg-orange-500/20 text-orange-500 rounded flex items-center justify-center shrink-0 mt-0.5">
                                    <CheckCircle2 size={12} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold">School Summary</p>
                                    <p className="text-xs text-slate-400">Aggregated stats and average performance.</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

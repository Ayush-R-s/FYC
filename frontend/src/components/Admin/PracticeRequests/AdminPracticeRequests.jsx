import React, { useState, useEffect } from 'react';
import axios from '../../../services/axiosInstance';
import { Check, X, Clock, RefreshCw, CheckCircle, XCircle, Filter } from 'lucide-react';

export default function AdminPracticeRequests() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [activeFilter, setActiveFilter] = useState('ALL');

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/admin/practice/requests');
            setRequests(res.data);
        } catch (error) {
            console.error("Error fetching practice requests:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
        const interval = setInterval(fetchRequests, 10000);
        return () => clearInterval(interval);
    }, []);

    const handleAction = async (id, action) => {
        setActionLoading(id);
        try {
            await axios.put(`/admin/practice/requests/${id}/${action}`);
            // Update the status locally instead of removing
            setRequests(prev => prev.map(req =>
                req.id === id ? { ...req, status: action === 'approve' ? 'APPROVED' : 'REJECTED' } : req
            ));
        } catch (error) {
            console.error(`Error ${action}ing request:`, error);
            alert(`Failed to ${action} request.`);
        } finally {
            setActionLoading(null);
        }
    };

    const filteredRequests = activeFilter === 'ALL'
        ? requests
        : requests.filter(req => req.status === activeFilter);

    const counts = {
        ALL: requests.length,
        PENDING: requests.filter(r => r.status === 'PENDING').length,
        APPROVED: requests.filter(r => r.status === 'APPROVED').length,
        REJECTED: requests.filter(r => r.status === 'REJECTED').length,
    };

    const statusBadge = (status) => {
        const styles = {
            PENDING: 'bg-yellow-100 text-yellow-700 border-yellow-200',
            APPROVED: 'bg-green-100 text-green-700 border-green-200',
            REJECTED: 'bg-red-100 text-red-700 border-red-200',
        };
        const icons = {
            PENDING: <Clock size={14} />,
            APPROVED: <CheckCircle size={14} />,
            REJECTED: <XCircle size={14} />,
        };
        return (
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${styles[status] || ''}`}>
                {icons[status]} {status}
            </span>
        );
    };

    const filterTabs = [
        { key: 'ALL', label: 'All' },
        { key: 'PENDING', label: 'Pending' },
        { key: 'APPROVED', label: 'Approved' },
        { key: 'REJECTED', label: 'Rejected' },
    ];

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Practice Requests</h1>
                    <p className="text-slate-500">Manage incoming requests for practice sessions.</p>
                </div>
                <button
                    onClick={fetchRequests}
                    className="p-2 text-slate-500 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
                    title="Refresh"
                >
                    <RefreshCw size={20} className={loading && requests.length > 0 ? "animate-spin" : ""} />
                </button>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 flex-wrap">
                {filterTabs.map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveFilter(tab.key)}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                            activeFilter === tab.key
                                ? 'bg-orange-500 text-white shadow-sm'
                                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                        }`}
                    >
                        {tab.label}
                        <span className={`ml-2 px-1.5 py-0.5 rounded-md text-xs ${
                            activeFilter === tab.key ? 'bg-white/20' : 'bg-slate-100'
                        }`}>
                            {counts[tab.key]}
                        </span>
                    </button>
                ))}
            </div>

            {loading && requests.length === 0 ? (
                <div className="flex items-center justify-center h-64">
                    <div className="w-8 h-8 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin"></div>
                </div>
            ) : filteredRequests.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-xl p-12 text-center shadow-sm">
                    <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Filter size={28} />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-1">No Requests Found</h3>
                    <p className="text-slate-500">
                        {activeFilter === 'ALL'
                            ? 'There are no practice requests yet.'
                            : `No ${activeFilter.toLowerCase()} requests found.`}
                    </p>
                </div>
            ) : (
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-sm font-semibold text-slate-600">
                                    <th className="p-4">Name</th>
                                    <th className="p-4">Email</th>
                                    <th className="p-4">Phone</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Date</th>
                                    <th className="p-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredRequests.map(req => (
                                    <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-4 font-medium text-slate-800">{req.name}</td>
                                        <td className="p-4 text-slate-600">{req.email}</td>
                                        <td className="p-4 text-slate-600">{req.phone}</td>
                                        <td className="p-4">{statusBadge(req.status)}</td>
                                        <td className="p-4 text-slate-500 text-sm">
                                            {new Date(req.createdAt).toLocaleString()}
                                        </td>
                                        <td className="p-4 flex items-center justify-end gap-2">
                                            {req.status === 'PENDING' ? (
                                                <>
                                                    <button
                                                        onClick={() => handleAction(req.id, 'reject')}
                                                        disabled={actionLoading === req.id}
                                                        className="px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50"
                                                    >
                                                        <X size={16} /> Reject
                                                    </button>
                                                    <button
                                                        onClick={() => handleAction(req.id, 'approve')}
                                                        disabled={actionLoading === req.id}
                                                        className="px-3 py-1.5 text-sm font-medium text-green-600 hover:bg-green-50 rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50"
                                                    >
                                                        <Check size={16} /> Approve
                                                    </button>
                                                </>
                                            ) : (
                                                <span className="text-xs text-slate-400 italic">—</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

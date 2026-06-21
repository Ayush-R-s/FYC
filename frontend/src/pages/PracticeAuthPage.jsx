import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../services/axiosInstance';
import { Loader2, ArrowRight, CheckCircle, PenTool } from 'lucide-react';

export default function PracticeAuthPage() {
    const navigate = useNavigate();
    
    const [step, setStep] = useState('FORM'); // 'FORM', 'WAITING', 'APPROVED', 'REJECTED'
    const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
    const [requestId, setRequestId] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    


    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await axios.post('/api/practice/request', formData);
            if (res.data && res.data.id) {
                setRequestId(res.data.id);
                setStep('WAITING');
            }
        } catch (error) {
            console.error("Error submitting practice request:", error);
            alert("Failed to submit request. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        if (step !== 'WAITING' || !requestId) return;

        const intervalId = setInterval(async () => {
            try {
                const res = await axios.get(`/api/practice/request/${requestId}/status`);
                if (res.data.status === 'APPROVED') {
                    setStep('APPROVED');
                    clearInterval(intervalId);
                    
                    // Store the token so axios interceptor picks it up
                    if (res.data.token) {
                        localStorage.setItem('token', res.data.token);
                    }
                    
                    // Navigate after a short delay
                    setTimeout(() => navigate('/practice'), 1500);
                } else if (res.data.status === 'REJECTED') {
                    setStep('REJECTED');
                    clearInterval(intervalId);
                }
            } catch (error) {
                console.error("Error checking status:", error);
            }
        }, 3000);

        return () => clearInterval(intervalId);
    }, [step, requestId, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6">
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                {/* Decorative background elements */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full -translate-x-1/2 translate-y-1/2"></div>

                {step === 'FORM' && (
                    <div className="relative z-10 animate-fade-in">
                        <div className="flex justify-center mb-6">
                            <div className="w-16 h-16 bg-orange-500/20 text-orange-500 rounded-2xl flex items-center justify-center shadow-inner shadow-orange-500/20">
                                <PenTool size={32} />
                            </div>
                        </div>
                        <h1 className="text-3xl font-black text-white text-center mb-2">Practice Session</h1>
                        <p className="text-slate-400 text-center mb-8 font-medium">
                            Enter your details to request a practice session.
                        </p>
                        
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-300 mb-1.5">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all font-medium"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-300 mb-1.5">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all font-medium"
                                    placeholder="john@example.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-300 mb-1.5">Phone Number</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all font-medium"
                                    placeholder="1234567890"
                                />
                            </div>
                            
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl mt-6 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 shadow-lg hover:shadow-orange-500/25 disabled:opacity-70 disabled:hover:translate-y-0"
                            >
                                {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : 'Request Access'}
                                {!isSubmitting && <ArrowRight size={20} />}
                            </button>
                        </form>
                    </div>
                )}

                {step === 'WAITING' && (
                    <div className="relative z-10 text-center py-8 animate-fade-in">
                        <div className="flex justify-center mb-8">
                            <div className="w-20 h-20 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin"></div>
                        </div>
                        <h2 className="text-2xl font-black text-white mb-3">Verification Pending</h2>
                        <p className="text-slate-400 font-medium max-w-xs mx-auto">
                            Waiting for the admin to verify your account. Please don't close this page.
                        </p>
                    </div>
                )}

                {step === 'APPROVED' && (
                    <div className="relative z-10 text-center py-8 animate-fade-in">
                        <div className="flex justify-center mb-8">
                            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center text-green-500">
                                <CheckCircle size={40} />
                            </div>
                        </div>
                        <h2 className="text-2xl font-black text-white mb-3">Verified!</h2>
                        <p className="text-slate-400 font-medium">
                            Redirecting to practice session...
                        </p>
                    </div>
                )}

                {step === 'REJECTED' && (
                    <div className="relative z-10 text-center py-8 animate-fade-in">
                        <div className="flex justify-center mb-8">
                            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center text-red-500">
                                <span className="text-4xl font-black">X</span>
                            </div>
                        </div>
                        <h2 className="text-2xl font-black text-white mb-3">Request Rejected</h2>
                        <p className="text-slate-400 font-medium mb-6">
                            Sorry, your request to access the practice session was not approved.
                        </p>
                        <button
                            onClick={() => setStep('FORM')}
                            className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-6 rounded-xl transition-all"
                        >
                            Try Again
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

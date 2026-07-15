import { useState, useEffect } from 'react';
import {
    X, User, Mail, Phone, School, Calendar, Lock,
    CheckCircle2, Clock, Save, ChevronRight, ShieldCheck, UserCheck
} from 'lucide-react';
import { updateStudent } from '../../services/studentService';

const VALIDITY_OPTIONS = [
    { value: 'NO_EXPIRY', label: 'No Expiry (Permanent)' },
    { value: '1_DAY', label: '1 Day' },
    { value: '1_WEEK', label: '1 Week' },
    { value: '1_MONTH', label: '1 Month' },
    { value: '3_MONTHS', label: '3 Months' },
    { value: '6_MONTHS', label: '6 Months' },
    { value: '1_YEAR', label: '1 Year' },
    { value: 'CUSTOM', label: 'Custom Date' },
];

const STATUS_OPTIONS = [
    { value: 'ACTIVE', label: 'Active', cls: 'border-emerald-500 bg-emerald-50 text-emerald-700' },
    { value: 'INACTIVE', label: 'Inactive', cls: 'border-slate-400 bg-slate-100 text-slate-600' },
    { value: 'EXPIRED', label: 'Expired', cls: 'border-amber-500 bg-amber-50 text-amber-700' },
];

const ROLE_OPTIONS = [
    { value: 'STUDENT', label: '🎓 Student', color: 'text-blue-600' },
    { value: 'ADMIN', label: '🛡️ Admin', color: 'text-red-600' },
    { value: 'MARKETER', label: '📣 Marketer', color: 'text-purple-600' },
    { value: 'AMBASSADOR', label: '🌟 Ambassador', color: 'text-amber-600' },
];

const TABS = [
    { id: 'personal', label: 'Personal', icon: User },
    { id: 'account', label: 'Account', icon: Lock },
];

const inputStyle = "w-full pl-10 pr-4 py-2.5 bg-orange-50/60 border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500/25 focus:border-orange-500 outline-none transition-all text-sm text-slate-800 placeholder-slate-400";
const labelStyle = "block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5";

function Field({ label, icon: Icon, children }) {
    return (
        <div>
            <label className={labelStyle}>{label}</label>
            <div className="relative">
                {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-400 pointer-events-none" />}
                {children}
            </div>
        </div>
    );
}

export default function EditStudentModal({ student, studentsData = [], isOpen, onClose, onUpdateSuccess }) {
    const [activeTab, setActiveTab] = useState('personal');
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const [form, setForm] = useState({
        name: '',
        email: '',
        mobile: '',
        dob: '',
        schoolName: '',
        education: '',
        status: 'ACTIVE',
        accountValidityDuration: 'NO_EXPIRY',
        accountExpiryDate: '',
        role: 'STUDENT',
        referredBy: '',
        password: '',
        confirmPassword: '',
    });

    useEffect(() => {
        if (isOpen && student) {
            setForm({
                name: student.name || '',
                email: student.email || '',
                mobile: student.mobile || '',
                dob: student.dob || '',
                schoolName: student.schoolName || '',
                education: student.education || '',
                status: student.status || 'ACTIVE',
                accountValidityDuration: student.accountValidityDuration || 'NO_EXPIRY',
                accountExpiryDate: student.accountExpiryDate || '',
                role: student.role || 'STUDENT',
                referredBy: student.referredBy || '',
                password: '',
                confirmPassword: '',
            });
            setActiveTab('personal');
            setError('');
            setSuccess(false);
        }
    }, [isOpen, student]);

    if (!isOpen || !student) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => {
            const next = { ...prev, [name]: value };
            if (name === 'role' && (value === 'ADMIN' || value === 'MARKETER')) {
                next.referredBy = '';
            }
            if (name === 'role' && value === 'STUDENT' && prev.referredBy) {
                const referrer = studentsData.find(s => s.studentId === prev.referredBy);
                if (referrer && referrer.role !== 'AMBASSADOR') {
                    next.referredBy = '';
                }
            }
            return next;
        });
        if (error) setError('');
    };

    const getReferrerOptions = () => {
        if (!studentsData) return [];
        if (form.role === 'STUDENT') {
            return studentsData.filter(s => s.role === 'AMBASSADOR');
        }
        if (form.role === 'AMBASSADOR') {
            return studentsData.filter(s =>
                (s.role === 'MARKETER' || s.role === 'AMBASSADOR') &&
                s.id !== student.id
            );
        }
        return [];
    };

    const handleSave = async () => {
        setError('');

        if (form.password && form.password !== form.confirmPassword) {
            setError("Passwords do not match");
            setActiveTab('account');
            return;
        }
        if (form.mobile && !/^\d{10}$/.test(form.mobile)) {
            setError("Mobile number must be exactly 10 digits");
            setActiveTab('personal');
            return;
        }
        if (form.accountValidityDuration === 'CUSTOM' && !form.accountExpiryDate) {
            setError("Please pick a custom expiry date");
            setActiveTab('account');
            return;
        }

        setSaving(true);
        try {
            const payload = { ...form };
            delete payload.confirmPassword;
            if (!payload.password) delete payload.password;
            if (payload.accountValidityDuration !== 'CUSTOM') {
                payload.accountExpiryDate = null;
            }

            const updated = await updateStudent(student.id, payload);
            setSuccess(true);
            setTimeout(() => {
                if (onUpdateSuccess) onUpdateSuccess(updated || { ...student, ...form });
                onClose();
                setSuccess(false);
            }, 1200);
        } catch (err) {
            console.error(err);
            setError(err?.response?.data?.message || "Failed to save changes. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    const getExpiryPreview = () => {
        const dur = form.accountValidityDuration;
        if (!dur || dur === 'NO_EXPIRY') return null;
        if (dur === 'CUSTOM') {
            return form.accountExpiryDate
                ? `Expires on ${new Date(form.accountExpiryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`
                : null;
        }
        const map = { '1_DAY': 1, '1_WEEK': 7, '1_MONTH': 30, '3_MONTHS': 90, '6_MONTHS': 180, '1_YEAR': 365 };
        const expiry = new Date(Date.now() + map[dur] * 86400000);
        return `Expires ~${expiry.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`;
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="w-full max-w-lg max-h-[92dvh] sm:max-h-[88vh] rounded-t-[2rem] sm:rounded-[2rem] bg-white shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom sm:zoom-in-95 duration-300"
                onClick={e => e.stopPropagation()}
            >
                {/* ── Header ── */}
                <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-orange-100 bg-gradient-to-r from-orange-50 to-amber-50 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-black text-lg shadow-md shadow-orange-300">
                            {student.name?.charAt(0) || '?'}
                        </div>
                        <div>
                            <h2 className="text-base font-black text-slate-900 tracking-tight">Edit Student</h2>
                            <p className="text-[11px] text-slate-400 font-medium font-mono">{student.studentId}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-orange-100 text-slate-400 hover:text-orange-600 transition-colors">
                        <X size={18} />
                    </button>
                </div>

                {/* ── Tab Bar ── */}
                <div className="flex border-b border-orange-100 px-6 sm:px-8 bg-white shrink-0">
                    {TABS.map(tab => {
                        const Icon = tab.icon;
                        const active = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-1.5 py-3.5 px-1 mr-6 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${active
                                        ? 'text-orange-600 border-orange-500'
                                        : 'text-slate-400 border-transparent hover:text-slate-600 hover:border-slate-200'
                                    }`}
                            >
                                <Icon size={13} />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* ── Error Banner ── */}
                {error && (
                    <div className="mx-6 sm:mx-8 mt-4 p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-xs font-bold flex items-center gap-2 shrink-0 animate-in slide-in-from-top-1">
                        <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse shrink-0" />
                        {error}
                    </div>
                )}

                {/* ── Tab Content ── */}
                <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-5">
                    {success ? (
                        <div className="h-full flex flex-col items-center justify-center gap-4 animate-in zoom-in-95 duration-300 py-12">
                            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center text-orange-500">
                                <CheckCircle2 size={44} />
                            </div>
                            <div className="text-center">
                                <p className="text-xl font-black text-slate-900">Changes Saved!</p>
                                <p className="text-sm text-slate-400 mt-1">Student profile has been updated.</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* PERSONAL TAB */}
                            {activeTab === 'personal' && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in duration-300">
                                    <div className="sm:col-span-2">
                                        <Field label="Full Name" icon={User}>
                                            <input type="text" name="name" value={form.name} onChange={handleChange} className={inputStyle} placeholder="Full name" />
                                        </Field>
                                    </div>
                                    <Field label="Email" icon={Mail}>
                                        <input type="email" name="email" value={form.email} onChange={handleChange} className={inputStyle} placeholder="email@example.com" />
                                    </Field>
                                    <Field label="Mobile" icon={Phone}>
                                        <input type="text" name="mobile" value={form.mobile} onChange={handleChange} className={inputStyle} placeholder="10-digit number" />
                                    </Field>
                                    <Field label="Date of Birth" icon={Calendar}>
                                        <input type="date" name="dob" value={form.dob} onChange={handleChange} className={inputStyle} />
                                    </Field>
                                    <Field label="School Name" icon={School}>
                                        <input type="text" name="schoolName" value={form.schoolName} onChange={handleChange} className={inputStyle} placeholder="School name" />
                                    </Field>
                                    <div className="sm:col-span-2">
                                        <Field label="Education / Class" icon={School}>
                                            <input type="text" name="education" value={form.education} onChange={handleChange} className={inputStyle} placeholder="e.g. Class 12 / B.Sc" />
                                        </Field>
                                    </div>
                                </div>
                            )}

                            {/* ACCOUNT TAB */}
                            {activeTab === 'account' && (
                                <div className="space-y-5 animate-in fade-in duration-300">
                                    {/* Status */}
                                    <div>
                                        <label className={labelStyle}>Account Status</label>
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            {STATUS_OPTIONS.map(opt => (
                                                <button
                                                    key={opt.value}
                                                    type="button"
                                                    onClick={() => setForm(prev => ({ ...prev, status: opt.value }))}
                                                    className={`px-4 py-2 rounded-xl text-xs font-bold border-2 transition-all ${form.status === opt.value
                                                            ? opt.cls + ' shadow-sm'
                                                            : 'bg-slate-50 text-slate-400 border-slate-200 hover:border-orange-200 hover:text-orange-500'
                                                        }`}
                                                >
                                                    {opt.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Role Selector */}
                                    <div>
                                        <Field label="Role" icon={ShieldCheck}>
                                            <select
                                                name="role"
                                                value={form.role}
                                                onChange={handleChange}
                                                className={inputStyle + " appearance-none cursor-pointer font-semibold"}
                                                required
                                            >
                                                {ROLE_OPTIONS.map(opt => (
                                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                ))}
                                            </select>
                                        </Field>
                                        <p className="mt-1.5 ml-1 text-[11px] font-semibold text-slate-400">
                                            {form.role === 'ADMIN' && '⚠️ Admin users have full system access'}
                                            {form.role === 'MARKETER' && 'Marketer can manage marketing & outreach content'}
                                            {form.role === 'AMBASSADOR' && 'Ambassador represents jest in their community'}
                                            {form.role === 'STUDENT' && 'Standard student account with learning access'}
                                        </p>
                                    </div>

                                    {/* Referrer Selector */}
                                    {(form.role === 'STUDENT' || form.role === 'AMBASSADOR') && (
                                        <div className="animate-in slide-in-from-top-1 duration-200">
                                            <Field label="Referred By" icon={UserCheck}>
                                                <select
                                                    name="referredBy"
                                                    value={form.referredBy || ''}
                                                    onChange={handleChange}
                                                    className={inputStyle + " appearance-none cursor-pointer font-semibold"}
                                                >
                                                    <option value="">-- No Referrer --</option>
                                                    {getReferrerOptions().map(s => (
                                                        <option key={s.studentId} value={s.studentId}>
                                                            {s.name} ({s.studentId})
                                                        </option>
                                                    ))}
                                                </select>
                                            </Field>
                                        </div>
                                    )}

                                    {/* Validity */}
                                    <div>
                                        <Field label="Account Validity" icon={Clock}>
                                            <select
                                                name="accountValidityDuration"
                                                value={form.accountValidityDuration}
                                                onChange={handleChange}
                                                className={inputStyle + " appearance-none cursor-pointer"}
                                            >
                                                {VALIDITY_OPTIONS.map(opt => (
                                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                ))}
                                            </select>
                                        </Field>
                                        {getExpiryPreview() && (
                                            <p className="mt-1.5 ml-1 text-[11px] font-semibold text-orange-600 flex items-center gap-1">
                                                <Clock size={11} />{getExpiryPreview()}
                                            </p>
                                        )}
                                        {student.accountExpiryDate && (
                                            <p className="mt-1 ml-1 text-[10px] text-slate-400">
                                                Current expiry: <span className="font-bold text-slate-600">{student.accountExpiryDate}</span>
                                            </p>
                                        )}
                                    </div>

                                    {form.accountValidityDuration === 'CUSTOM' && (
                                        <div className="animate-in slide-in-from-top-1 duration-200">
                                            <Field label="Custom Expiry Date" icon={Calendar}>
                                                <input
                                                    type="date"
                                                    name="accountExpiryDate"
                                                    value={form.accountExpiryDate}
                                                    onChange={handleChange}
                                                    min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
                                                    className={inputStyle}
                                                />
                                            </Field>
                                        </div>
                                    )}

                                    {/* Password change */}
                                    <div className="pt-4 border-t border-orange-100">
                                        <p className={labelStyle + " mb-3"}>Change Password</p>
                                        <p className="text-[10px] text-slate-400 mb-4">Leave blank to keep the current password unchanged.</p>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <Field label="New Password" icon={Lock}>
                                                <input type="password" name="password" value={form.password} onChange={handleChange} className={inputStyle} placeholder="Min 6 characters" />
                                            </Field>
                                            <Field label="Confirm Password" icon={Lock}>
                                                <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} className={inputStyle} placeholder="Repeat password" />
                                            </Field>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* ── Footer ── */}
                {!success && (
                    <div className="px-6 sm:px-8 py-4 border-t border-orange-100 bg-orange-50/40 flex gap-3 shrink-0">
                        <button
                            onClick={onClose}
                            className="flex-1 py-3 bg-white hover:bg-slate-50 text-slate-600 rounded-xl font-bold text-sm border border-slate-200 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex-[2] py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-black text-sm shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {saving ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save size={15} />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

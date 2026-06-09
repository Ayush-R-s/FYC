import { useState, useEffect } from 'react';
import {
    X, User, Mail, Phone, School, Calendar, Lock,
    CheckCircle2, Clock, MapPin, ShieldCheck, Save,
    ChevronRight
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
    { value: 'ACTIVE', label: 'Active', color: 'text-emerald-600 bg-emerald-50' },
    { value: 'INACTIVE', label: 'Inactive', color: 'text-slate-500 bg-slate-100' },
    { value: 'EXPIRED', label: 'Expired', color: 'text-amber-600 bg-amber-50' },
];

const TABS = [
    { id: 'personal', label: 'Personal', icon: User },
    { id: 'address', label: 'Address', icon: MapPin },
    { id: 'guardian', label: 'Guardian', icon: ShieldCheck },
    { id: 'account', label: 'Account', icon: Lock },
];

const inputStyle = "w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm text-slate-800 placeholder-slate-400";
const labelStyle = "block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5";

function Field({ label, icon: Icon, children }) {
    return (
        <div>
            <label className={labelStyle}>{label}</label>
            <div className="relative">
                {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />}
                {children}
            </div>
        </div>
    );
}

export default function EditStudentModal({ student, isOpen, onClose, onUpdateSuccess }) {
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
        address: '',
        city: '',
        state: '',
        pincode: '',
        guardianName: '',
        guardianRelation: '',
        guardianMobile: '',
        guardianEmail: '',
        guardianAddress: '',
        guardianCity: '',
        guardianState: '',
        guardianPincode: '',
        status: 'ACTIVE',
        accountValidityDuration: 'NO_EXPIRY',
        accountExpiryDate: '',
        password: '',
        confirmPassword: '',
    });

    // Populate form when modal opens
    useEffect(() => {
        if (isOpen && student) {
            setForm({
                name: student.name || '',
                email: student.email || '',
                mobile: student.mobile || '',
                dob: student.dob || '',
                schoolName: student.schoolName || '',
                education: student.education || '',
                address: student.address || '',
                city: student.city || '',
                state: student.state || '',
                pincode: student.pincode || '',
                guardianName: student.guardianName || '',
                guardianRelation: student.guardianRelation || '',
                guardianMobile: student.guardianMobile || '',
                guardianEmail: student.guardianEmail || '',
                guardianAddress: student.guardianAddress || '',
                guardianCity: student.guardianCity || '',
                guardianState: student.guardianState || '',
                guardianPincode: student.guardianPincode || '',
                status: student.status || 'ACTIVE',
                accountValidityDuration: student.accountValidityDuration || 'NO_EXPIRY',
                accountExpiryDate: student.accountExpiryDate || '',
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
        setForm(prev => ({ ...prev, [name]: value }));
        if (error) setError('');
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
            if (payload.accountValidityDuration === 'NO_EXPIRY') {
                delete payload.accountValidityDuration;
                delete payload.accountExpiryDate;
            }
            if (payload.accountValidityDuration !== 'CUSTOM') {
                delete payload.accountExpiryDate;
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
                className="w-full max-w-2xl max-h-[92dvh] sm:max-h-[88vh] rounded-t-[2.5rem] sm:rounded-[2.5rem] bg-white shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom sm:zoom-in-95 duration-300"
                onClick={e => e.stopPropagation()}
            >
                {/* ── Header ── */}
                <div className="flex items-center justify-between p-6 sm:p-8 pb-4 border-b border-slate-100 shrink-0">
                    <div>
                        <h2 className="text-xl font-black text-slate-900 tracking-tight">Edit Student</h2>
                        <p className="text-xs text-slate-400 mt-0.5 font-medium">
                            {student.name} &nbsp;·&nbsp;
                            <span className="font-mono text-slate-500">{student.studentId}</span>
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* ── Tab Bar ── */}
                <div className="flex border-b border-slate-100 px-6 sm:px-8 overflow-x-auto no-scrollbar shrink-0">
                    {TABS.map(tab => {
                        const Icon = tab.icon;
                        const active = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-1.5 py-3.5 px-2 mr-4 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${active
                                    ? 'text-blue-600 border-blue-600'
                                    : 'text-slate-400 border-transparent hover:text-slate-600'
                                    }`}
                            >
                                <Icon size={13} />
                                {tab.label}
                                {active && <ChevronRight size={10} className="text-blue-400" />}
                            </button>
                        );
                    })}
                </div>

                {/* ── Error Banner ── */}
                {error && (
                    <div className="mx-6 sm:mx-8 mt-4 p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-xs font-bold flex items-center gap-2 shrink-0 animate-in slide-in-from-top-1">
                        <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" />
                        {error}
                    </div>
                )}

                {/* ── Tab Content ── */}
                <div className="flex-1 overflow-y-auto p-6 sm:p-8 pt-5">
                    {success ? (
                        <div className="h-full flex flex-col items-center justify-center gap-4 animate-in zoom-in-95 duration-300">
                            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-500">
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

                            {/* ADDRESS TAB */}
                            {activeTab === 'address' && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in duration-300">
                                    <div className="sm:col-span-2">
                                        <Field label="Street Address" icon={MapPin}>
                                            <input type="text" name="address" value={form.address} onChange={handleChange} className={inputStyle} placeholder="House / Street / Locality" />
                                        </Field>
                                    </div>
                                    <Field label="City" icon={MapPin}>
                                        <input type="text" name="city" value={form.city} onChange={handleChange} className={inputStyle} placeholder="City" />
                                    </Field>
                                    <Field label="State" icon={MapPin}>
                                        <input type="text" name="state" value={form.state} onChange={handleChange} className={inputStyle} placeholder="State" />
                                    </Field>
                                    <Field label="Pincode" icon={MapPin}>
                                        <input type="text" name="pincode" value={form.pincode} onChange={handleChange} className={inputStyle} placeholder="6-digit pincode" />
                                    </Field>
                                </div>
                            )}

                            {/* GUARDIAN TAB */}
                            {activeTab === 'guardian' && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in duration-300">
                                    <Field label="Guardian Name" icon={ShieldCheck}>
                                        <input type="text" name="guardianName" value={form.guardianName} onChange={handleChange} className={inputStyle} placeholder="Guardian's full name" />
                                    </Field>
                                    <Field label="Relation" icon={ShieldCheck}>
                                        <input type="text" name="guardianRelation" value={form.guardianRelation} onChange={handleChange} className={inputStyle} placeholder="e.g. Father, Mother" />
                                    </Field>
                                    <Field label="Guardian Mobile" icon={Phone}>
                                        <input type="text" name="guardianMobile" value={form.guardianMobile} onChange={handleChange} className={inputStyle} placeholder="10-digit number" />
                                    </Field>
                                    <Field label="Guardian Email" icon={Mail}>
                                        <input type="email" name="guardianEmail" value={form.guardianEmail} onChange={handleChange} className={inputStyle} placeholder="guardian@email.com" />
                                    </Field>
                                    <div className="sm:col-span-2">
                                        <Field label="Guardian Address" icon={MapPin}>
                                            <input type="text" name="guardianAddress" value={form.guardianAddress} onChange={handleChange} className={inputStyle} placeholder="Guardian's address" />
                                        </Field>
                                    </div>
                                    <Field label="Guardian City" icon={MapPin}>
                                        <input type="text" name="guardianCity" value={form.guardianCity} onChange={handleChange} className={inputStyle} placeholder="City" />
                                    </Field>
                                    <Field label="Guardian State" icon={MapPin}>
                                        <input type="text" name="guardianState" value={form.guardianState} onChange={handleChange} className={inputStyle} placeholder="State" />
                                    </Field>
                                    <Field label="Guardian Pincode" icon={MapPin}>
                                        <input type="text" name="guardianPincode" value={form.guardianPincode} onChange={handleChange} className={inputStyle} placeholder="Pincode" />
                                    </Field>
                                </div>
                            )}

                            {/* ACCOUNT TAB */}
                            {activeTab === 'account' && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in duration-300">
                                    {/* Status */}
                                    <div className="sm:col-span-2">
                                        <label className={labelStyle}>Account Status</label>
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            {STATUS_OPTIONS.map(opt => (
                                                <button
                                                    key={opt.value}
                                                    type="button"
                                                    onClick={() => setForm(prev => ({ ...prev, status: opt.value }))}
                                                    className={`px-4 py-2 rounded-xl text-xs font-bold border-2 transition-all ${form.status === opt.value
                                                        ? `${opt.color} border-current shadow-sm`
                                                        : 'bg-slate-50 text-slate-400 border-slate-200 hover:border-slate-300'
                                                        }`}
                                                >
                                                    {opt.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Validity */}
                                    <div className="sm:col-span-2">
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
                                            <p className="mt-1.5 ml-1 text-[11px] font-semibold text-blue-600 flex items-center gap-1">
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
                                        <div className="sm:col-span-2 animate-in slide-in-from-top-1 duration-200">
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
                                    <div className="sm:col-span-2 pt-2 border-t border-slate-100">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Change Password (leave blank to keep current)</p>
                                    </div>
                                    <Field label="New Password" icon={Lock}>
                                        <input type="password" name="password" value={form.password} onChange={handleChange} className={inputStyle} placeholder="Min 6 characters" />
                                    </Field>
                                    <Field label="Confirm Password" icon={Lock}>
                                        <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} className={inputStyle} placeholder="Repeat password" />
                                    </Field>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* ── Footer ── */}
                {!success && (
                    <div className="px-6 sm:px-8 py-4 border-t border-slate-100 bg-white flex gap-3 shrink-0">
                        <button
                            onClick={onClose}
                            className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold text-sm transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex-[2] py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-black text-sm shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
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

import { useState } from 'react';
import { X, User, Mail, Phone, School, Calendar, Lock, CheckCircle2, Clock, ShieldCheck, UserCheck } from 'lucide-react';
import authService from '../../services/authService';

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

const ROLE_OPTIONS = [
  { value: 'STUDENT', label: '🎓 Student', color: 'text-blue-600' },
  { value: 'ADMIN', label: '🛡️ Admin', color: 'text-red-600' },
  { value: 'MARKETER', label: '📣 Marketer', color: 'text-purple-600' },
  { value: 'AMBASSADOR', label: '🌟 Ambassador', color: 'text-amber-600' },
];

export default function AddStudentModal({ isOpen, studentsData = [], onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    mobile: '',
    dob: '',
    schoolName: '',
    role: 'STUDENT',
    referredBy: '',
    accountValidityDuration: 'NO_EXPIRY',
    accountExpiryDate: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
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
    if (formData.role === 'STUDENT') {
      return studentsData.filter(s => s.role === 'AMBASSADOR');
    }
    if (formData.role === 'AMBASSADOR') {
      return studentsData.filter(s => s.role === 'MARKETER' || s.role === 'AMBASSADOR');
    }
    return [];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!/^\d{10}$/.test(formData.mobile)) {
      setError("Mobile number must be exactly 10 digits");
      return;
    }

    const dobDate = new Date(formData.dob);
    const today = new Date();
    let age = today.getFullYear() - dobDate.getFullYear();
    const m = today.getMonth() - dobDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) {
      age--;
    }

    if (age < 14 || age > 26) {
      setError(`Age must be between 14 and 26. Calculated age: ${age}`);
      return;
    }

    // Validate custom expiry date
    if (formData.accountValidityDuration === 'CUSTOM') {
      if (!formData.accountExpiryDate) {
        setError("Please select a custom expiry date");
        return;
      }
      const expiryDate = new Date(formData.accountExpiryDate);
      if (expiryDate <= today) {
        setError("Expiry date must be in the future");
        return;
      }
    }

    setLoading(true);
    try {
      const { confirmPassword, ...submitData } = formData;

      // Don't send accountExpiryDate for non-CUSTOM durations (backend computes it)
      if (submitData.accountValidityDuration !== 'CUSTOM') {
        delete submitData.accountExpiryDate;
      }
      // Don't send validity fields if NO_EXPIRY
      if (submitData.accountValidityDuration === 'NO_EXPIRY') {
        delete submitData.accountValidityDuration;
        delete submitData.accountExpiryDate;
      }

      const result = await authService.registerStudent(submitData);

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          onSuccess();
          onClose();
          setSuccess(false);
          setFormData({
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            mobile: '',
            dob: '',
            schoolName: '',
            role: 'STUDENT',
            referredBy: '',
            accountValidityDuration: 'NO_EXPIRY',
            accountExpiryDate: ''
          });
        }, 1500);
      } else {
        setError(result.error || "Registration failed");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Compute a human-readable preview of when the account will expire
  const getExpiryPreview = () => {
    const dur = formData.accountValidityDuration;
    if (dur === 'NO_EXPIRY' || !dur) return null;
    if (dur === 'CUSTOM') {
      return formData.accountExpiryDate
        ? `Expires on ${new Date(formData.accountExpiryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`
        : null;
    }
    const today = new Date();
    const map = {
      '1_DAY': 1,
      '1_WEEK': 7,
      '1_MONTH': 30,
      '3_MONTHS': 90,
      '6_MONTHS': 180,
      '1_YEAR': 365,
    };
    const days = map[dur];
    if (!days) return null;
    const expiry = new Date(today.getTime() + days * 24 * 60 * 60 * 1000);
    return `Expires on ~${expiry.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`;
  };

  const glassEffect = "backdrop-blur-xl bg-white/90 border border-white/20 shadow-2xl";
  const inputStyle = "w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-sm";
  const labelStyle = "block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1";

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div
        className={`${glassEffect} w-full max-w-lg max-h-[85dvh] sm:max-h-[calc(100vh-2rem)] rounded-t-[2.5rem] sm:rounded-[2.5rem] overflow-hidden flex flex-col animate-in slide-in-from-bottom sm:zoom-in-95 duration-300`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 sm:p-8 pb-4 flex justify-between items-center bg-gradient-to-b from-white to-transparent sticky top-0 z-10 backdrop-blur-md">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Add New Student</h2>
            <p className="text-[10px] sm:text-xs font-medium text-slate-500 mt-1">Register a new student account manually</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 sm:p-8 pt-0 overflow-y-auto">
          {success ? (
            <div className="py-12 flex flex-col items-center text-center space-y-4 animate-in zoom-in-95 duration-500">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-500">
                <CheckCircle2 size={48} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Successfully Registered!</h3>
                <p className="text-sm text-slate-500 mt-1">The student can now log in with their credentials.</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 py-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-xs font-bold flex items-center gap-2 animate-in slide-in-from-top-1">
                  <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" />
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className={labelStyle}>Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter student's full name"
                      className={inputStyle}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className={labelStyle}>Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="email@example.com"
                      className={inputStyle}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className={labelStyle}>Mobile Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      type="text"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      placeholder="10 digit number"
                      className={inputStyle}
                      required
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className={labelStyle}>School Name</label>
                  <div className="relative">
                    <School className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      type="text"
                      name="schoolName"
                      value={formData.schoolName}
                      onChange={handleChange}
                      placeholder="Search or enter school name"
                      className={inputStyle}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:col-span-2">
                  <div>
                    <label className={labelStyle}>Date of Birth</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleChange}
                        className={inputStyle}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelStyle}>Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Min 6 characters"
                        className={inputStyle}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className={labelStyle}>Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Repeat password"
                      className={inputStyle}
                      required
                    />
                  </div>
                </div>

                {/* ==================== ROLE ==================== */}
                <div className="sm:col-span-2">
                  <label className={labelStyle}>Role</label>
                  <div className="relative">
                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className={inputStyle + " appearance-none cursor-pointer font-semibold"}
                      required
                    >
                      {ROLE_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                  <p className="mt-1.5 ml-1 text-[11px] font-semibold text-slate-400">
                    {formData.role === 'ADMIN' && '⚠️ Admin users have full system access'}
                    {formData.role === 'MARKETER' && 'Marketer can manage marketing & outreach content'}
                    {formData.role === 'AMBASSADOR' && 'Ambassador represents FYC in their community'}
                    {formData.role === 'STUDENT' && 'Standard student account with learning access'}
                  </p>
                </div>

                {/* ==================== REFERRER ==================== */}
                {(formData.role === 'STUDENT' || formData.role === 'AMBASSADOR') && (
                  <div className="sm:col-span-2 animate-in slide-in-from-top-1 duration-200">
                    <label className={labelStyle}>Referred By</label>
                    <div className="relative">
                      <UserCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <select
                        name="referredBy"
                        value={formData.referredBy || ''}
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
                    </div>
                  </div>
                )}

                {/* ==================== ACCOUNT VALIDITY ==================== */}
                <div className="sm:col-span-2">
                  <label className={labelStyle}>Account Validity</label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <select
                      name="accountValidityDuration"
                      value={formData.accountValidityDuration}
                      onChange={handleChange}
                      className={inputStyle + " appearance-none cursor-pointer"}
                    >
                      {VALIDITY_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Expiry preview */}
                  {getExpiryPreview() && (
                    <p className="mt-1.5 ml-1 text-[11px] font-semibold text-orange-600 flex items-center gap-1.5">
                      <Clock size={12} />
                      {getExpiryPreview()}
                    </p>
                  )}
                </div>

                {/* Custom date picker — only shown for CUSTOM */}
                {formData.accountValidityDuration === 'CUSTOM' && (
                  <div className="sm:col-span-2 animate-in slide-in-from-top-1 duration-200">
                    <label className={labelStyle}>Custom Expiry Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input
                        type="date"
                        name="accountExpiryDate"
                        value={formData.accountExpiryDate}
                        onChange={handleChange}
                        min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
                        className={inputStyle}
                        required
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="sticky bottom-0 pt-4 bg-white/50 backdrop-blur-sm -mx-6 sm:-mx-8 px-6 sm:px-8 pb-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing...' : 'Register Student'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

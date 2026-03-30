import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';

const StudentRegister = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        mobile: '',
        dob: '',
        schoolName: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        // Mobile validation
        if (!/^\d{10}$/.test(formData.mobile)) {
            setError("Mobile number must be exactly 10 digits");
            return;
        }

        // Age validation
        const dobDate = new Date(formData.dob);
        const today = new Date();
        let age = today.getFullYear() - dobDate.getFullYear();
        const m = today.getMonth() - dobDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) {
            age--;
        }

        if (age < 14 || age > 26) {
            setError(`Age must be between 14 and 26. Your age is calculated as ${age}.`);
            return;
        }

        setLoading(true);
        try {
            const { confirmPassword, ...submitData } = formData;
            const result = await authService.registerStudent(submitData);

            if (result.success) {
                setSuccess(true);
                setTimeout(() => {
                    navigate('/student-login');
                }, 2000);
            } else {
                // Ensure error from backend is a string and readable
                const msg = typeof result.error === 'string' ? result.error : JSON.stringify(result.error);
                setError(msg);
            }
        } catch (err) {
            setError("An unexpected error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="flex items-center justify-center p-12 bg-primary rounded-3xl shadow-2xl">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-green-500 mb-4">Registration Successful!</h2>
                    <p className="text-text-primary">Redirecting you to login page...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex w-full max-w-6xl h-auto min-h-[650px] bg-primary rounded-3xl overflow-hidden shadow-2xl border border-border-color">
            <div className="w-1/2 bg-gradient-to-b from-accent to-accent/40 flex items-center justify-center p-12">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-white mb-4">Welcome Back</h1>
                    <p className="text-white/90 text-lg mb-8">
                        Already have an account? Sign in to access your personalized dashboard.
                    </p>
                    <a
                        href="/student-login"
                        className="inline-block bg-white text-accent px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
                    >
                        Sign In
                    </a>
                </div>
            </div>

            <div className="w-1/2 flex items-center justify-center p-12">
                <div className="w-full max-w-md">
                    <h2 className="text-3xl font-bold text-text-primary mb-6 text-center">Create Account</h2>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <input
                                type="text"
                                name="name"
                                placeholder="Full Name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-border-color rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                                required
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-border-color rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                                required
                            />
                            <input
                                type="text"
                                name="mobile"
                                placeholder="Mobile Number (10 digits)"
                                value={formData.mobile}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-border-color rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                                required
                            />
                            <input
                                type="text"
                                name="schoolName"
                                placeholder="School Name"
                                value={formData.schoolName}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-border-color rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                                required
                            />
                            <input
                                type="date"
                                name="dob"
                                placeholder="Date of Birth"
                                value={formData.dob}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-border-color rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                                required
                            />
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-border-color rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                                required
                            />
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-border-color rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                                required
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-accent text-white py-3 rounded-lg font-semibold hover:bg-accent/90 transition-colors disabled:opacity-50"
                            >
                                {loading ? 'Registering...' : 'Register'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

        </div>
    );
};

export default StudentRegister;

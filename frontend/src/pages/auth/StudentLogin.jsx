import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Mail, CheckCircle, GraduationCap } from 'lucide-react';
import authService from '../../services/authService';

const StudentLogin = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        // Clear error when user starts typing
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await authService.studentLogin(
                formData.email,
                formData.password
            );

            if (result.token) {
                // Store token and user data
                localStorage.setItem('token', result.token);
                localStorage.setItem('student', JSON.stringify({
                    id: result.id,
                    studentId: result.studentId,
                    name: result.name,
                    email: result.email,
                    role: result.role
                }));


                // Redirect to student dashboard
                navigate('/student');
            } else {
                setError(result.error);
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex w-full max-w-6xl h-[650px] bg-primary rounded-3xl overflow-hidden shadow-2xl border border-border-color">
            <div className="w-[40%] relative hidden lg:flex flex-col justify-center items-center text-white p-12 text-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-accent to-[#ff9f66] opacity-90 z-10"></div>
                <img src="/images/student-login.png" alt="Student Login" className="absolute inset-0 w-full h-full object-cover" />
                <div className="relative z-20">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-5xl mb-6 mx-auto shadow-lg text-accent">
                        <GraduationCap size={48} />
                    </div>
                    <h2 className="text-4xl font-bold mb-4">Welcome Student!</h2>
                    <p className="text-lg opacity-90 mb-8">Continue your learning journey with us</p>
                    <ul className="text-left space-y-3 inline-block">
                        <li className="flex items-center gap-3"><CheckCircle size={20} /> Access to all courses</li>
                        <li className="flex items-center gap-3"><CheckCircle size={20} /> Track your progress</li>
                        <li className="flex items-center gap-3"><CheckCircle size={20} /> Personalized learning</li>
                    </ul>
                </div>
            </div>

            <div className="w-full lg:w-[60%] p-16 flex flex-col justify-center bg-primary overflow-y-auto">
                <h2 className="text-4xl font-bold mb-3 text-text-primary">Student Login</h2>
                <p className="text-text-secondary text-lg mb-10">Please enter your credentials to continue</p>

                {error && (
                    <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-400 rounded-xl text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">

                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            name="email"
                            placeholder="Email or Username"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            disabled={loading}
                            className="w-full pl-12 pr-4 py-4 border-2 border-border-color rounded-xl bg-transparent focus:outline-none focus:border-accent transition-all disabled:opacity-50"
                        />
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            disabled={loading}
                            className="w-full pl-12 pr-4 py-4 border-2 border-border-color rounded-xl bg-transparent focus:outline-none focus:border-accent transition-all disabled:opacity-50"
                        />
                    </div>

                    <div className="flex justify-between items-center text-sm text-text-secondary">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                name="rememberMe"
                                checked={formData.rememberMe}
                                onChange={handleChange}
                                disabled={loading}
                                className="w-4 h-4 accent-accent"
                            />
                            Remember me
                        </label>
                        <a href="#" className="text-accent font-semibold hover:underline">Forgot password?</a>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-accent to-accent-hover text-white py-4 rounded-xl text-lg font-bold shadow-lg hover:shadow-orange-500/30 hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {loading ? 'Signing In...' : 'Sign In →'}
                    </button>
                </form>
                <div className="mt-8 text-center text-sm text-text-secondary">
                    Need help? Contact Support<br />
                    <span className="text-green-500 font-medium flex items-center justify-center gap-2 mt-2"><Lock size={14} /> Secure Encrypted Connection</span>
                </div>
            </div>
        </div>
    );
};

export default StudentLogin;

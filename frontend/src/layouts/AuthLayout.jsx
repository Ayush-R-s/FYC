import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';

const AuthLayout = ({ darkMode, toggleTheme }) => {
    const navigate = useNavigate();

    // Enforce light mode in this layout
    useEffect(() => {
        document.documentElement.dataset.theme = 'light';
        document.body.classList.remove('dark');
    }, []);

    return (
        <div className="min-h-[100dvh] bg-primary">
            {/* Header */}
            <header className="fixed w-full top-0 z-50 bg-header-bg text-header-text flex justify-between items-center px-8 py-5 shadow-lg backdrop-blur-sm bg-opacity-95 h-24">
                <div className="flex items-center text-2xl font-bold text-accent cursor-pointer" onClick={() => navigate('/')}>
                    <img src="/images/fyc.jpeg" alt="FYC Logo" className="h-9 mr-3" />
                    <span>FYC</span>
                    <small className="text-base opacity-80 ml-2 font-normal text-text-secondary dark:text-gray-400">Learning Platform</small>
                </div>

                <nav className="flex items-center gap-6">
                    <a
                        href="#"
                        className="px-6 py-2 bg-accent text-white rounded-full font-semibold hover:bg-accent-hover transition-colors shadow-md hover:shadow-lg"
                        onClick={(e) => { e.preventDefault(); navigate('/'); }}
                    >
                        Back to Home
                    </a>
                </nav>
            </header>

            {/* Main Content */}
            <main className="pt-24 min-h-[calc(100dvh-6rem)] grid place-items-center p-4">
                <Outlet />
            </main>
        </div>
    );
};

export default AuthLayout;

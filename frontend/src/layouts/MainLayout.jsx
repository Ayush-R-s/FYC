import { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Sun, Moon, Instagram, Twitter, MessageCircle, Menu, X, Linkedin, Youtube } from 'lucide-react';

const MainLayout = ({ darkMode, toggleTheme }) => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Enforce light mode in this layout
    useEffect(() => {
        document.documentElement.dataset.theme = 'light';
        document.body.classList.remove('dark');
    }, []);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
        { name: 'Contact', path: '/contact' },
    ];

    return (
        <div className="min-h-[100dvh] flex flex-col">
            {/* Header */}
            <header className="fixed w-full top-0 z-50 bg-header-bg text-header-text flex justify-between items-center px-6 sm:px-8 py-5 shadow-lg backdrop-blur-sm bg-opacity-95">
                <div className="flex items-center text-xl sm:text-2xl font-bold text-accent cursor-pointer" onClick={() => navigate('/')}>
                    <img src="/images/fyc.jpeg" alt="FYC Logo" className="h-8 sm:h-9 mr-2 sm:mr-3" />
                    <span>FYC</span>
                    <small className="hidden xs:inline-block text-xs sm:base opacity-80 ml-2 font-normal text-text-secondary dark:text-gray-400">NEET Preparation</small>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center gap-6">
                    {navLinks.map((link) => (
                        <Link key={link.name} to={link.path} className="text-header-text hover:text-accent font-medium transition-colors">{link.name}</Link>
                    ))}
                    <Link to="/admin-login" className="px-6 py-2 bg-accent text-white rounded-full font-semibold hover:bg-accent-hover transition-colors shadow-md hover:shadow-lg">
                        Admin Login
                    </Link>
                </nav>

                {/* Mobile Toggle */}
                <button
                    className="lg:hidden p-2 text-header-text hover:text-accent transition-colors"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Toggle menu"
                >
                    {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </header>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-40 lg:hidden">
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)}></div>
                    <nav className="fixed top-0 right-0 bottom-0 w-[280px] sm:w-[320px] bg-header-bg text-header-text p-0 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                        {/* Sidebar Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white">
                            <div className="flex items-center text-xl font-bold text-accent cursor-pointer" onClick={() => { setIsMenuOpen(false); navigate('/'); }}>
                                <img src="/images/fyc.jpeg" alt="FYC Logo" className="h-8 mr-2" />
                                <span>FYC</span>
                            </div>
                            <button onClick={() => setIsMenuOpen(false)} className="p-2 text-accent hover:bg-orange-50 rounded-lg transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Navigation Links */}
                        <div className="flex flex-col p-6 gap-2 flex-1 overflow-y-auto bg-header-bg">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className="text-lg font-medium px-4 py-3 rounded-xl hover:bg-accent/5 hover:text-accent transition-all duration-200"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>

                        {/* Bottom Action */}
                        <div className="p-6 border-t border-gray-100 bg-gray-50/50">
                            <Link
                                to="/admin-login"
                                className="flex items-center justify-center w-full px-6 py-4 bg-accent text-white rounded-2xl font-bold hover:bg-accent-hover transition-all shadow-lg active:scale-[0.98]"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Admin Login
                            </Link>
                        </div>
                    </nav>
                </div>
            )}

            {/* Main Content */}
            <main className="flex-1 pt-24">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="bg-primary text-text-primary">
                <div className="py-20 text-center bg-secondary/30">
                    <strong className="block mb-8 text-2xl font-semibold">Join Our Community</strong>
                    <div className="flex justify-center gap-8">
                        <a href="https://www.instagram.com/fyc_neet_academy?igsh=NjZ6ZTU3OTQ3dzds" target="_blank" rel="noopener noreferrer" className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-md hover:shadow-xl hover:scale-110 transition-all duration-300 group">
                            <Instagram size={32} className="text-[#E4405F] group-hover:scale-110 transition-transform" />
                        </a>
                        <a href="https://youtube.com/@fycneetacademy?si=JXXTrNZ9q9W5Mv98" target="_blank" rel="noopener noreferrer" className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-md hover:shadow-xl hover:scale-110 transition-all duration-300 group">
                            <Youtube size={32} className="text-[#25D366] group-hover:scale-110 transition-transform" />
                        </a>
                        <a href="https://www.linkedin.com/in/hari-harasudhan03?trk=universal-search-cluster" target="_blank" rel="noopener noreferrer" className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-md hover:shadow-xl hover:scale-110 transition-all duration-300 group">
                            <Linkedin size={32} className="text-[#1DA1F2] group-hover:scale-110 transition-transform" />
                        </a>
                    </div>
                </div>
                <div className="text-center py-8 bg-black text-gray-400 text-sm">
                    &copy; 2025 NeetPrep. Empowering future doctors.
                </div>
            </footer>
        </div>
    );
};

export default MainLayout;

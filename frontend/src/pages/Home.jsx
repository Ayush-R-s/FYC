import { useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-[100dvh] bg-primary text-text-primary animate-fade-in overflow-hidden">
            <section className="flex flex-col lg:flex-row items-center justify-between px-6 sm:px-12 lg:px-24 py-12 lg:py-20 max-w-7xl mx-auto gap-12 lg:gap-24">
                <div className="flex-1 text-left order-2 lg:order-1">
                    <div className="inline-block bg-secondary text-accent px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-black uppercase tracking-widest mb-6 sm:mb-8 animate-slide-up">
                        Welcome to NEET Preparation Platform
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black mb-6 sm:mb-8 leading-[1.1] tracking-tighter text-text-primary text-balance">
                        Crack <span className="text-accent underline decoration-orange-500/30 underline-offset-8">NEET 2027</span> with Us
                    </h1>
                    <p className="text-lg sm:text-xl text-text-secondary mb-8 sm:mb-10 max-w-2xl leading-relaxed font-medium">
                        Join thousands of aspiring doctors in our comprehensive NEET preparation program. Master Physics, Chemistry, and Biology with expert guidance.
                    </p>
                    <button
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-accent text-white px-8 lg:px-10 py-4 rounded-2xl text-lg lg:text-xl font-black shadow-lg shadow-orange-500/20 hover:-translate-y-1 hover:shadow-orange-500/40 transition-all transform duration-300 active:scale-95"
                        onClick={() => navigate('/student-login')}
                    >
                        START LEARNING <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                    </button>

                    <div className="mt-10 sm:mt-12">
                        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                            {['Quiz Programs', '15,000+ Questions', 'Recorded Classes'].map((item, index) => (
                                <li key={index} className="flex items-center text-base sm:text-lg font-bold text-text-primary">
                                    <div className="bg-orange-500/10 p-1 rounded-lg mr-3">
                                        <CheckCircle className="text-accent" size={20} />
                                    </div>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="flex-1 grid grid-cols-2 gap-3 sm:gap-4 h-[300px] sm:h-[450px] lg:h-[600px] order-1 lg:order-2 w-full relative">
                    <div className="absolute -inset-4 bg-orange-500/5 blur-3xl rounded-full"></div>
                    <img src="/images/study-group.png" alt="NEET aspirants studying" className="row-span-2 w-full h-full rounded-2xl lg:rounded-3xl shadow-xl hover:scale-[1.02] transition-transform duration-500 object-cover relative z-10" />
                    <img src="/images/lab-setup.png" alt="Medical entrance preparation" className="w-full h-full rounded-2xl lg:rounded-3xl shadow-xl hover:scale-[1.02] transition-transform duration-500 object-cover relative z-10" />
                    <img src="/images/future-doctor.png" alt="NEET preparation" className="w-full h-full rounded-2xl lg:rounded-3xl shadow-xl hover:scale-[1.02] transition-transform duration-500 object-cover relative z-10" />
                </div>
            </section>
        </div>
    );
};

export default Home;

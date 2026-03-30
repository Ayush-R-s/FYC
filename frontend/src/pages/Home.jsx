import { useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-[100dvh] bg-primary text-text-primary animate-fade-in">
            <section className="flex flex-col lg:flex-row items-center justify-between px-8 lg:px-24 py-20 max-w-7xl mx-auto gap-24">
                <div className="flex-1 text-left">
                    <div className="inline-block bg-secondary text-accent px-6 py-2 rounded-full font-medium mb-8 animate-slide-up">
                        Welcome to NEET Preparation Platform
                    </div>
                    <h1 className="text-5xl lg:text-7xl font-bold mb-8 leading-tight text-text-primary">
                        Crack <span className="text-accent">NEET 2026</span> with Us
                    </h1>
                    <p className="text-xl text-text-secondary mb-10 max-w-2xl leading-relaxed">
                        Join thousands of aspiring doctors in our comprehensive NEET preparation program. Master Physics, Chemistry, and Biology with expert guidance.
                    </p>
                    <a
                        href="#"
                        className="inline-flex items-center gap-2 bg-accent text-white px-10 py-4 rounded-full text-xl font-semibold shadow-lg hover:-translate-y-1 hover:shadow-orange-500/30 transition-all transform duration-300"
                        onClick={(e) => { e.preventDefault(); navigate('/student-login'); }}
                    >
                        START LEARNING <ArrowRight size={24} />
                    </a>

                    <div className="mt-12">
                        <ul className="space-y-4">
                            {['Quiz Programs', '15,000+ NEET Questions Solved', 'Recorded Classes'].map((item, index) => (
                                <li key={index} className="flex items-center text-xl text-text-primary">
                                    <CheckCircle className="text-accent mr-3" size={24} /> {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="flex-1 grid grid-cols-2 gap-4 h-[600px]">
                    <img src="/images/study-group.png" alt="NEET aspirants studying" className="row-span-2 w-full h-full rounded-3xl shadow-xl hover:scale-[1.02] transition-transform duration-500 object-cover" />
                    <img src="/images/lab-setup.png" alt="Medical entrance preparation" className="w-full h-full rounded-3xl shadow-xl hover:scale-[1.02] transition-transform duration-500 object-cover" />
                    <img src="/images/future-doctor.png" alt="NEET preparation" className="w-full h-full rounded-3xl shadow-xl hover:scale-[1.02] transition-transform duration-500 object-cover" />
                </div>
            </section>
        </div>
    );
};

export default Home;

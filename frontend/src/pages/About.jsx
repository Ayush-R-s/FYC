import { BookOpen } from 'lucide-react';

const About = () => {
    return (
        <div className="min-h-[100dvh] bg-primary text-text-primary animate-fade-in p-8 lg:p-24">
            <section className="px-8 lg:px-24 py-12 max-w-6xl mx-auto text-center">
                <h1 className="text-5xl font-bold mb-10">About <span className="text-accent">NEET Exam</span></h1>
                <p className="text-xl text-text-secondary max-w-3xl mx-auto mb-16 leading-relaxed">
                    The National Eligibility cum Entrance Test (NEET) UG is India's single national-level medical entrance exam for admission to MBBS, BDS, and other undergraduate medical courses.
                </p>

                <div className="bg-primary border border-border-color p-10 rounded-3xl shadow-xl text-left mb-12">
                    <h2 className="text-3xl font-bold mb-6 text-text-primary flex items-center gap-3">
                        <BookOpen className="text-accent" /> Exam Overview (NEET UG 2026)
                    </h2>
                    <p className="text-text-secondary mb-10 text-lg">Conducted by the National Testing Agency (NTA), NEET is mandatory for aspiring medical students in government and private colleges across India. The exam is pen-and-paper based and held in a single shift.</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="bg-secondary p-8 rounded-2xl shadow-md border border-orange-100 hover:shadow-lg transition-shadow">
                            <h3 className="text-xl font-bold text-accent mb-4 border-b border-orange-200 pb-2">Exam Pattern</h3>
                            <ul className="space-y-2 text-text-secondary">
                                <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-accent mt-2"></div> Total Questions: 180</li>
                                <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-accent mt-2"></div> Duration: 3h 20m</li>
                                <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-accent mt-2"></div> Physics, Chem, Bio</li>
                                <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-accent mt-2"></div> Total Marks: 720</li>
                            </ul>
                        </div>
                        <div className="bg-secondary p-8 rounded-2xl shadow-md border border-orange-100 hover:shadow-lg transition-shadow">
                            <h3 className="text-xl font-bold text-accent mb-4 border-b border-orange-200 pb-2">Marking Scheme</h3>
                            <ul className="space-y-2 text-text-secondary">
                                <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-accent mt-2"></div> Correct: +4 marks</li>
                                <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-accent mt-2"></div> Incorrect: -1 mark</li>
                                <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-accent mt-2"></div> Unattempted: 0</li>
                            </ul>
                        </div>
                        <div className="bg-secondary p-8 rounded-2xl shadow-md border border-orange-100 hover:shadow-lg transition-shadow">
                            <h3 className="text-xl font-bold text-accent mb-4 border-b border-orange-200 pb-2">Subjects</h3>
                            <ul className="space-y-2 text-text-secondary">
                                <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-accent mt-2"></div> Physics: 180 marks</li>
                                <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-accent mt-2"></div> Chemistry: 180 marks</li>
                                <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-accent mt-2"></div> Biology: 360 marks</li>
                            </ul>
                        </div>
                        <div className="bg-secondary p-8 rounded-2xl shadow-md border border-orange-100 hover:shadow-lg transition-shadow">
                            <h3 className="text-xl font-bold text-accent mb-4 border-b border-orange-200 pb-2">Eligibility</h3>
                            <ul className="space-y-2 text-text-secondary">
                                <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-accent mt-2"></div> Age: 17+ years</li>
                                <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-accent mt-2"></div> 10+2 with PCB</li>
                                <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-accent mt-2"></div> 50% / 40% (Resv)</li>
                                <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-accent mt-2"></div> No attempt limit</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;

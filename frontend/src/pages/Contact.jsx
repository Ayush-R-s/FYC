import { Mail, Phone, MapPin } from 'lucide-react';

const Contact = () => {
    return (
        <div className="min-h-[100dvh] bg-primary text-text-primary animate-fade-in p-8 lg:p-24">
            <section className="px-8 lg:px-24 py-12 max-w-6xl mx-auto">
                <h1 className="text-5xl font-bold mb-6 text-center">Get in Touch</h1>
                <p className="text-xl text-text-secondary text-center mb-16 max-w-2xl mx-auto">Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>

                <div className="flex flex-col lg:flex-row gap-16 justify-center items-start">
                    <div className="w-full lg:w-1/3 space-y-8">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-secondary rounded-full text-accent">
                                <Mail size={24} />
                            </div>
                            <div>
                                <strong className="block text-lg mb-1 text-accent">Email</strong>
                                <span className="text-text-secondary">support@neetprep.com</span>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-secondary rounded-full text-accent">
                                <Phone size={24} />
                            </div>
                            <div>
                                <strong className="block text-lg mb-1 text-accent">Phone</strong>
                                <span className="text-text-secondary">+91 123456789<br />Mon-Fri: 9AM - 6PM</span>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-secondary rounded-full text-accent">
                                <MapPin size={24} />
                            </div>
                            <div>
                                <strong className="block text-lg mb-1 text-accent">Office</strong>
                                <span className="text-text-secondary">NeetPrep Learning<br />New Delhi, India</span>
                            </div>
                        </div>

                        <div className="bg-accent text-white p-6 rounded-2xl mt-8 shadow-lg">
                            <strong className="block text-xl mb-4">Support Hours</strong>
                            <div className="space-y-1">
                                <div className="flex justify-between"><span>Mon - Fri:</span> <span>9:00 AM - 6:00 PM</span></div>
                                <div className="flex justify-between"><span>Saturday:</span> <span>10:00 AM - 4:00 PM</span></div>
                                <div className="flex justify-between"><span>Sunday:</span> <span>Closed</span></div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full lg:w-2/3 bg-primary p-10 rounded-3xl shadow-xl border border-border-color">
                        <h2 className="text-3xl font-bold mb-8 text-text-primary">Send Us a Message</h2>
                        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                            <input type="text" placeholder="Your Name" required className="w-full p-4 border border-border-color rounded-xl bg-transparent focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all" />
                            <input type="email" placeholder="Email Address" required className="w-full p-4 border border-border-color rounded-xl bg-transparent focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all" />
                            <input type="text" placeholder="Subject" required className="w-full p-4 border border-border-color rounded-xl bg-transparent focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all" />
                            <textarea rows="5" placeholder="Your Message" required className="w-full p-4 border border-border-color rounded-xl bg-transparent focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all font-sans"></textarea>
                            <button type="submit" className="w-full bg-accent text-white py-4 rounded-xl text-lg font-bold hover:bg-accent-hover transition-all shadow-lg hover:shadow-orange-500/25">Send Message</button>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;

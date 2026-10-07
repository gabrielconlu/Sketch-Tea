'use client';

import { useState, useEffect } from 'react';

export default function ContactPage() {
    // Form States
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [status, setStatus] = useState({ type: '', text: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            try {
                const userData = JSON.parse(savedUser);
                setFormData(prev => ({
                    ...prev,
                    name: userData.name || prev.name,
                    email: userData.email || prev.email
                }));
            } catch (e) {}
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ type: '', text: '' });
        setIsSubmitting(true);

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (response.ok && result.success !== false) {
                setStatus({
                    type: 'success',
                    text: result.message || "Thank you! Your message has been sent successfully."
                });
                setFormData(prev => ({ ...prev, subject: '', message: '' }));
            } else {
                setStatus({
                    type: 'error',
                    text: result.message || "Failed to send message. Please try again."
                });
            }
        } catch (err) {
            console.error('Contact submission error:', err);
            setStatus({
                type: 'error',
                text: "Unable to connect to the server. Please check your connection."
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="max-w-[900px] mx-auto px-4 pt-[112px] pb-14 sm:px-[30px] sm:pt-[140px] sm:pb-20 flex-1 w-full">
            <div className="text-center mb-[50px]">
                <h1 className="text-5xl lg:text-6xl font-bold mb-3 font-serif">Contact Us</h1>
                <p className="max-w-[600px] mx-auto opacity-85 text-[1.1rem]">
                    Have questions, feedback, or custom artwork requests? Send us a message and we will respond promptly.
                </p>
            </div>

            <div className="bg-[var(--card)] border border-[var(--glass-border)] rounded-[28px] p-[40px_32px] backdrop-blur-[20px] shadow-[var(--shadow)]">
                {status.text && (
                    <div className={`p-[12px_16px] rounded-[12px] text-[0.9rem] mb-5 text-center font-semibold border ${
                        status.type === 'success' 
                            ? 'bg-[rgba(46,204,113,0.15)] text-[var(--success)] border-[rgba(46,204,113,0.3)]' 
                            : 'bg-[rgba(231,76,60,0.15)] text-[var(--error)] border-[rgba(231,76,60,0.3)]'
                    }`}>
                        {status.text}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-5">
                        <label htmlFor="name" className="block font-semibold mb-2 text-[0.95rem]">Full Name</label>
                        <input 
                            type="text" 
                            id="name" 
                            name="name" 
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your full name" 
                            required 
                            className="w-full p-[14px_18px] rounded-[12px] border border-[var(--glass-border)] bg-[var(--paper2)] text-[var(--text)] text-[0.95rem] outline-none transition focus:border-[var(--accent3)] focus:ring-2 focus:ring-[rgba(255,159,28,0.2)]"
                        />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="email" className="block font-semibold mb-2 text-[0.95rem]">Email Address</label>
                        <input 
                            type="email" 
                            id="email" 
                            name="email" 
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="your.email@example.com" 
                            required 
                            className="w-full p-[14px_18px] rounded-[12px] border border-[var(--glass-border)] bg-[var(--paper2)] text-[var(--text)] text-[0.95rem] outline-none transition focus:border-[var(--accent3)] focus:ring-2 focus:ring-[rgba(255,159,28,0.2)]"
                        />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="subject" className="block font-semibold mb-2 text-[0.95rem]">Subject</label>
                        <input 
                            type="text" 
                            id="subject" 
                            name="subject" 
                            value={formData.subject}
                            onChange={handleChange}
                            placeholder="What is this regarding?" 
                            required 
                            className="w-full p-[14px_18px] rounded-[12px] border border-[var(--glass-border)] bg-[var(--paper2)] text-[var(--text)] text-[0.95rem] outline-none transition focus:border-[var(--accent3)] focus:ring-2 focus:ring-[rgba(255,159,28,0.2)]"
                        />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="message" className="block font-semibold mb-2 text-[0.95rem]">Message</label>
                        <textarea 
                            id="message" 
                            name="message" 
                            rows="5" 
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="Write your message here..." 
                            required 
                            className="w-full p-[14px_18px] rounded-[12px] border border-[var(--glass-border)] bg-[var(--paper2)] text-[var(--text)] text-[0.95rem] outline-none transition focus:border-[var(--accent3)] focus:ring-2 focus:ring-[rgba(255,159,28,0.2)] resize-y"
                        ></textarea>
                    </div>
                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full p-4 rounded-full border-none bg-[var(--accent3)] text-white text-[1rem] font-bold cursor-pointer transition duration-350 shadow-[0_10px_25px_rgba(255,159,28,0.35)] hover:bg-[#e58a0f] hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {isSubmitting ? 'Sending Message...' : 'Send Message'}
                    </button>
                </form>
            </div>
        </main>
    );
}
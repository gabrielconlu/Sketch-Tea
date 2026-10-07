'use client';

import { useState, useEffect, useRef } from 'react';

export default function OtherServicesPage() {
    const [selectedService, setSelectedService] = useState('Logo Design');
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [ideas, setIdeas] = useState('');
    const [fileName, setFileName] = useState('');
    const [statusMessage, setStatusMessage] = useState({ text: '', type: '' });
    const [submitting, setSubmitting] = useState(false);

    const submittingRef = useRef(false);
    const fileInputRef = useRef(null);

    const generateReferenceCode = (userEmail) => {
        const cleanEmail = (userEmail || '').trim().toLowerCase();
        let prefix = 'ST-USER-';

        if (cleanEmail === 'gabbyconlu@gmail.com') {
            prefix = 'ST-GAB-';
        } else if (cleanEmail === 'archimary.me@gmail.com' || cleanEmail === 'archimary@gmail.com') {
            prefix = 'ST-MARY-';
        } else if (cleanEmail === 'dangabrielconlu@gmail.com') {
            prefix = 'ST-DAN-';
        }

        const randomId = Math.floor(1000 + Math.random() * 9000);
        return `${prefix}${randomId}`;
    };

    useEffect(() => {
        const pendingData = localStorage.getItem('pendingOrderData');
        const savedUser = localStorage.getItem('user');

        if (pendingData) {
            try {
                const data = JSON.parse(pendingData);
                if (data.fullName) setFullName(data.fullName);
                if (data.email) setEmail(data.email);
                if (data.ideas) setIdeas(data.ideas);
                if (data.serviceType) setSelectedService(data.serviceType);
            } catch (e) {}
        } else if (savedUser) {
            try {
                const userData = JSON.parse(savedUser);
                if (userData.email) setEmail(userData.email);
                if (userData.name) setFullName(userData.name);
            } catch (e) {}
        }
    }, []);

    const handleFileChange = (e) => {
        if (e.target.files.length > 0) {
            setFileName(`Selected: ${e.target.files.length} file(s)`);
        } else {
            setFileName('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (submittingRef.current) return;
        submittingRef.current = true;

        setStatusMessage({ text: '', type: '' });

        // Bypassed check to allow proceeding directly to payment options
        const isAuthenticated = true;

        if (!isAuthenticated) {
            const formDataObj = { fullName, email, ideas, serviceType: selectedService };
            localStorage.setItem('pendingOrderData', JSON.stringify(formDataObj));

            setStatusMessage({
                text: "Please sign in first. Your order draft has been saved!",
                type: "error"
            });

            setTimeout(() => {
                window.location.href = '/?redirect=other-services';
            }, 1200);
            return;
        }

        setSubmitting(true);

        try {
            const newRefCode = generateReferenceCode(email);
            localStorage.setItem('generatedReferenceCode', newRefCode);

            const orderData = {
                fullName: fullName.trim(),
                email: email.trim(),
                ideas: ideas.trim(),
                serviceType: selectedService,
                referenceCode: newRefCode,
            };
            localStorage.setItem('pendingOrderData', JSON.stringify(orderData));

            if (fileInputRef.current && fileInputRef.current.files.length > 0) {
                const files = fileInputRef.current.files;
                const fileReaders = [];

                for (let i = 0; i < files.length; i++) {
                    const file = files[i];
                    fileReaders.push(new Promise((resolve) => {
                        const reader = new FileReader();
                        reader.onload = (uploadEvent) => {
                            resolve({
                                name: file.name,
                                type: file.type,
                                data: uploadEvent.target.result
                            });
                        };
                        reader.readAsDataURL(file);
                    }));
                }

                const base64Files = await Promise.all(fileReaders);
                localStorage.setItem('pendingReferenceFiles', JSON.stringify(base64Files));
            } else {
                localStorage.removeItem('pendingReferenceFiles');
            }

            setStatusMessage({
                text: "Details saved! Redirecting to payment options...",
                type: "success"
            });

            setTimeout(() => {
                window.location.href = '/payment-methods?service=other-services';
            }, 1000);

        } catch (err) {
            console.error('Submission error:', err);
            setStatusMessage({
                text: err.message || "Failed to process. Please try again.",
                type: "error"
            });
            submittingRef.current = false;
            setSubmitting(false);
        }
    };

    return (
        <main className="max-w-[700px] mx-auto w-full px-4 pt-[112px] pb-14 sm:px-[30px] sm:pt-[140px] sm:pb-20 flex-1">
            <div className="text-center mb-10">
                <h1 className="text-[clamp(2.5rem,4vw,3.8rem)] font-bold mb-3">Service Request</h1>
                <p className="opacity-85 text-[1.05rem]">Choose your desired design service and describe your vision below.</p>
            </div>

            <div className="bg-[var(--card)] border border-[var(--glass-border)] rounded-[28px] p-[40px_32px] backdrop-blur-[20px] shadow-[var(--shadow)]">
                
                {/* Service Type Selection Tabs */}
                <div className="mb-[28px]">
                    <label className="block font-semibold mb-2 text-[0.95rem]">Select Service Type</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {['Logo Design', 'Calling Cards', 'Invitations'].map((service) => (
                            <button
                                key={service}
                                type="button"
                                onClick={() => setSelectedService(service)}
                                className={`p-[12px_16px] rounded-[14px] text-[0.9rem] font-bold border transition cursor-pointer text-center ${
                                    selectedService === service 
                                        ? 'bg-[var(--accent3)] text-white border-[var(--accent3)] shadow-[0_5px_15px_rgba(255,159,28,0.3)]' 
                                        : 'bg-[var(--paper2)] text-[var(--text)] border-[var(--glass-border)] hover:border-[var(--accent3)]'
                                }`}
                            >
                                {service === 'Logo Design' && '🎨 Logo Design'}
                                {service === 'Calling Cards' && '📇 Calling Cards'}
                                {service === 'Invitations' && '💌 Invitations'}
                            </button>
                        ))}
                    </div>
                </div>

                {statusMessage.text && (
                    <div className={`p-[12px_16px] rounded-[12px] text-[0.9rem] mb-5 text-center font-semibold ${statusMessage.type === 'error' ? 'bg-[rgba(231,76,60,0.15)] text-[var(--error)] border border-[rgba(231,76,60,0.3)]' : 'bg-[rgba(46,204,113,0.15)] text-[var(--success)] border border-[rgba(46,204,113,0.3)]'}`}>
                        {statusMessage.text}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-[22px]">
                        <label htmlFor="fullName" className="block font-semibold mb-2 text-[0.95rem]">Full Name</label>
                        <input 
                            type="text" 
                            id="fullName" 
                            name="fullName" 
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required 
                            placeholder="John Doe"
                            className="w-full p-[14px_18px] rounded-[12px] border border-[var(--glass-border)] bg-[var(--paper2)] text-[var(--text)] text-[0.95rem] outline-none transition focus:border-[var(--accent3)] focus:ring-2 focus:ring-[rgba(255,159,28,0.2)]"
                        />
                    </div>

                    <div className="mb-[22px]">
                        <label htmlFor="email" className="block font-semibold mb-2 text-[0.95rem]">Gmail Address</label>
                        <input 
                            type="email" 
                            id="email" 
                            name="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required 
                            placeholder="your.email@gmail.com"
                            className="w-full p-[14px_18px] rounded-[12px] border border-[var(--glass-border)] bg-[var(--paper2)] text-[var(--text)] text-[0.95rem] outline-none transition focus:border-[var(--accent3)] focus:ring-2 focus:ring-[rgba(255,159,28,0.2)]"
                        />
                    </div>

                    <div className="mb-[22px]">
                        <label htmlFor="ideas" className="block font-semibold mb-2 text-[0.95rem]">
                            {selectedService === 'Logo Design' && 'Logo Design Ideas & Details'}
                            {selectedService === 'Calling Cards' && 'Calling Card Details (Name, Title, Info, Style)'}
                            {selectedService === 'Invitations' && 'Invitation Details (Event type, Theme, Date, Wording)'}
                        </label>
                        <textarea 
                            id="ideas" 
                            name="ideas" 
                            rows="5" 
                            value={ideas}
                            onChange={(e) => setIdeas(e.target.value)}
                            required 
                            placeholder={
                                selectedService === 'Logo Design' ? "Describe your brand concepts, color preferences, and artistic style..." :
                                selectedService === 'Calling Cards' ? "Include text, contact details, layout orientation, and style preferences..." :
                                "Include event theme, color scheme, wording, and special instructions..."
                            }
                            className="w-full p-[14px_18px] rounded-[12px] border border-[var(--glass-border)] bg-[var(--paper2)] text-[var(--text)] text-[0.95rem] outline-none transition focus:border-[var(--accent3)] focus:ring-2 focus:ring-[rgba(255,159,28,0.2)] resize-y"
                        ></textarea>
                    </div>

                    <div className="mb-[22px]">
                        <label className="block font-semibold mb-2 text-[0.95rem]">Reference Pictures (Optional)</label>
                        <label 
                            htmlFor="reference_file"
                            className="relative flex flex-col items-center justify-center border-2 border-dashed border-[var(--glass-border)] rounded-[16px] p-6 text-center bg-[var(--paper2)] cursor-pointer transition hover:border-[var(--accent3)] hover:bg-[var(--card)] block w-full"
                        >
                            <input 
                                type="file" 
                                ref={fileInputRef}
                                id="reference_file" 
                                name="reference_file" 
                                accept="image/*"
                                multiple
                                onChange={handleFileChange}
                                className="sr-only"
                            />
                            <div className="text-[0.9rem] opacity-80 pointer-events-none">📷 Drag & drop images here or click anywhere to browse (multiple files allowed)</div>
                            {fileName && <div className="mt-2 text-[0.85rem] font-bold text-[var(--accent3)] pointer-events-none">{fileName}</div>}
                        </label>
                    </div>

                    <button 
                        type="submit" 
                        disabled={submitting}
                        className="w-full p-4 rounded-full border-none bg-[var(--accent3)] text-white text-[1rem] font-bold cursor-pointer transition hover:bg-[#e58a0f] hover:-translate-y-0.5 shadow-[0_10px_25px_rgba(255,159,28,0.35)] mt-[10px] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {submitting ? 'Saving...' : 'Proceed to Payment Options'}
                    </button>
                </form>
            </div>
        </main>
    );
}
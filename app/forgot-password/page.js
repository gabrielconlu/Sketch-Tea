'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [csrfToken, setCsrfToken] = useState('');
    const [status, setStatus] = useState({ type: '', text: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetch('/api/csrf', { credentials: 'include' })
            .then((response) => response.json())
            .then((data) => {
                if (data?.csrfToken) {
                    setCsrfToken(data.csrfToken);
                }
            })
            .catch(() => undefined);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ type: '', text: '' });

        if (!csrfToken) {
            setStatus({ type: 'error', text: 'Security token missing. Please refresh the page.' });
            return;
        }

        setIsSubmitting(true);
        setStatus({ type: '', text: 'Sending reset link...' });

        try {
            const response = await fetch('/api/users/forgot-password', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'x-csrf-token': csrfToken,
                },
                body: JSON.stringify({ email })
            });

            const result = await response.json();

            if (response.ok && result.success) {
                setStatus({
                    type: 'success',
                    text: 'Reset instructions have been sent to your email.'
                });
                setEmail('');
            } else {
                setStatus({
                    type: 'error',
                    text: result.message || 'Unable to send reset link.'
                });
            }
        } catch (err) {
            console.error('Forgot password error:', err);
            setStatus({
                type: 'error',
                text: 'Something went wrong. Please try again later.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex min-h-[80vh] items-center justify-center px-4 py-8 sm:px-6">
            <div className="relative w-full max-w-[440px] overflow-hidden rounded-[26px] border border-[var(--glass-border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] p-5 shadow-[var(--shadow)] backdrop-blur-[16px] sm:p-7">
                <div className="relative mb-6 text-center">
                    <div className="mb-3 inline-flex items-center justify-center rounded-full border border-[var(--glass-border)] bg-[var(--paper2)] px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-[var(--accent3)]">
                        Sketch Tea
                    </div>
                    <h2 className="text-[clamp(2rem,4vw,2.6rem)] font-bold leading-none text-[var(--text)] font-serif">
                        Reset Password
                    </h2>
                </div>

                {status.text && (
                    <div
                        className={`relative mb-4 rounded-xl border p-[10px_14px] text-center text-[0.85rem] font-semibold ${
                            status.type === 'success'
                                ? 'border-[rgba(46,204,113,0.28)] bg-[rgba(46,204,113,0.12)] text-[#2ecc71]'
                                : status.type === 'error'
                                ? 'border-[rgba(231,76,60,0.28)] bg-[rgba(231,76,60,0.12)] text-[#e74c3c]'
                                : 'border-[rgba(255,159,28,0.28)] bg-[rgba(255,159,28,0.12)] text-[var(--accent3)]'
                        }`}
                    >
                        {status.text}
                    </div>
                )}

                <p className="mb-5 text-center text-[0.92rem] text-[var(--text)]/75">
                    Enter the email address connected to your account and we’ll send a reset link.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="mb-2 block text-[0.78rem] font-semibold tracking-[0.02em] text-[var(--text)]">
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="you@example.com"
                            className="w-full rounded-xl border border-[var(--glass-border)] bg-[var(--paper2)] px-3.5 py-3 text-[0.95rem] text-[var(--text)] outline-none transition focus:border-[var(--accent3)] focus:ring-3 focus:ring-[rgba(255,159,28,0.15)]"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded-full bg-[linear-gradient(135deg,#ffb347,#ff9f1c)] px-5 py-3.5 text-base font-bold text-white shadow-[0_10px_22px_rgba(255,159,28,0.28)] transition hover:translate-y-[-1px] hover:opacity-98 disabled:opacity-70"
                    >
                        {isSubmitting ? 'Sending...' : 'Send reset link'}
                    </button>
                </form>

                <p className="relative mt-5 text-center text-[0.9rem] text-[var(--text)]/75">
                    Back to{' '}
                    <Link href="/login" className="font-bold text-[var(--accent3)] underline underline-offset-4">
                        login
                    </Link>
                </p>
            </div>
        </div>
    );
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
    const router = useRouter();
    const [csrfToken, setCsrfToken] = useState('');
    const [formData, setFormData] = useState(() => {
        if (typeof window === 'undefined') {
            return { email: '', password: '' };
        }

        return {
            email: localStorage.getItem('rememberedEmail') || '',
            password: ''
        };
    });
    const [status, setStatus] = useState({ type: '', text: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [rememberMe, setRememberMe] = useState(() => {
        if (typeof window === 'undefined') {
            return false;
        }

        return localStorage.getItem('rememberMe') === 'true';
    });

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (name === 'email' && rememberMe) {
            localStorage.setItem('rememberedEmail', value);
        }
    };

    const handleRememberMeToggle = (e) => {
        const checked = e.target.checked;
        setRememberMe(checked);

        if (checked) {
            localStorage.setItem('rememberMe', 'true');
            localStorage.setItem('rememberedEmail', formData.email);
        } else {
            localStorage.removeItem('rememberMe');
            localStorage.removeItem('rememberedEmail');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ type: '', text: '' });

        if (!csrfToken) {
            setStatus({ type: 'error', text: 'Security token missing. Please refresh the page.' });
            return;
        }

        setIsSubmitting(true);
        setStatus({ type: '', text: 'Logging in...' });

        try {
            const response = await fetch('/api/users/login', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'x-csrf-token': csrfToken,
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (response.ok && result.success) {
                setStatus({ type: 'success', text: 'Login successful! Redirecting...' });

                if (rememberMe) {
                    localStorage.setItem('rememberMe', 'true');
                    localStorage.setItem('rememberedEmail', formData.email);
                } else {
                    localStorage.removeItem('rememberMe');
                    localStorage.removeItem('rememberedEmail');
                }

                localStorage.setItem('user', JSON.stringify(result.user));
                localStorage.setItem('isLoggedIn', 'true');
                window.dispatchEvent(new Event('authChange'));

                setTimeout(() => {
                    router.push('/');
                }, 1000);
            } else {
                setStatus({ type: 'error', text: result.message || 'Invalid email or password.' });
                setIsSubmitting(false);
            }
        } catch (err) {
            console.error('Login error:', err);
            setStatus({ type: 'error', text: 'Network error. Please check your connection.' });
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
                        Welcome Back
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

                <form onSubmit={handleSubmit} className="relative space-y-4">
                    <div>
                        <label className="mb-2 block text-[0.78rem] font-semibold tracking-[0.02em] text-[var(--text)]">
                            Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full rounded-xl border border-[var(--glass-border)] bg-[var(--paper2)] px-3.5 py-3 text-[0.95rem] text-[var(--text)] outline-none transition focus:border-[var(--accent3)] focus:ring-3 focus:ring-[rgba(255,159,28,0.15)]"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-[0.78rem] font-semibold tracking-[0.02em] text-[var(--text)]">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full rounded-xl border border-[var(--glass-border)] bg-[var(--paper2)] px-3.5 py-3 text-[0.95rem] text-[var(--text)] outline-none transition focus:border-[var(--accent3)] focus:ring-3 focus:ring-[rgba(255,159,28,0.15)]"
                        />
                    </div>

                    <div className="flex items-center justify-between gap-3 text-[0.88rem] text-[var(--text)]/75">
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={handleRememberMeToggle}
                                className="h-4 w-4 rounded border-[var(--glass-border)] text-[var(--accent3)] focus:ring-[var(--accent3)]"
                            />
                            Remember me
                        </label>

                        <Link href="/forgot-password" className="font-medium text-[var(--accent3)] hover:underline">
                            Forgot password?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded-full bg-[linear-gradient(135deg,#ffb347,#ff9f1c)] px-5 py-3.5 text-base font-bold text-white shadow-[0_10px_22px_rgba(255,159,28,0.28)] transition hover:translate-y-[-1px] hover:opacity-98 disabled:opacity-70"
                    >
                        {isSubmitting ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <p className="relative mt-5 text-center text-[0.9rem] text-[var(--text)]/75">
                    Don’t have an account?{' '}
                    <Link href="/register" className="font-bold text-[var(--accent3)] underline underline-offset-4">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}
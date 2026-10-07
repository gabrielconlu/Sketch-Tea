'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
    const router = useRouter();
    const [csrfToken, setCsrfToken] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [acceptedPolicies, setAcceptedPolicies] = useState(false);

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

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        if (!name || !email || !password) {
            setError('Please fill in all fields.');
            return;
        }

        if (!acceptedPolicies) {
            setError('Please accept the Privacy Policy and Terms & Conditions to continue.');
            return;
        }

        if (!csrfToken) {
            setError('Security token missing. Please refresh the page and try again.');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('/api/users/register', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'x-csrf-token': csrfToken,
                },
                body: JSON.stringify({ name, email, password, acceptedPolicies }),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || 'Registration failed');
            }

            // Success! Redirect user to login page
            router.push('/login');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center px-4 py-24">
            <div className="w-full max-w-[440px] p-5 sm:p-[40px] rounded-[24px] bg-[var(--card)] backdrop-blur-[20px] border border-[var(--glass-border)] shadow-[var(--shadow)]">
                <div className="text-center mb-8">
                    <h1 className="font-serif text-[2rem] sm:text-[2.5rem] font-bold text-[var(--text)] mb-2">Create Account</h1>
                    <p className="text-[0.95rem] opacity-70">Join Sketch Tea to explore and order</p>
                </div>

                {error && (
                    <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-[var(--error)] text-[0.9rem] text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleRegister} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-[0.85rem] font-semibold opacity-80 mb-1.5">Full Name</label>
                        <input 
                            type="text" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your full name"
                            className="w-full px-4 py-3 rounded-xl bg-[var(--paper2)] border border-[var(--glass-border)] text-[var(--text)] placeholder:opacity-40 focus:outline-none focus:border-[var(--accent3)] transition text-[0.95rem]"
                        />
                    </div>

                    <div>
                        <label className="block text-[0.85rem] font-semibold opacity-80 mb-1.5">Email Address</label>
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@example.com"
                            className="w-full px-4 py-3 rounded-xl bg-[var(--paper2)] border border-[var(--glass-border)] text-[var(--text)] placeholder:opacity-40 focus:outline-none focus:border-[var(--accent3)] transition text-[0.95rem]"
                        />
                    </div>

                    <div>
                        <label className="block text-[0.85rem] font-semibold opacity-80 mb-1.5">Password</label>
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="At least 6 characters"
                            className="w-full px-4 py-3 rounded-xl bg-[var(--paper2)] border border-[var(--glass-border)] text-[var(--text)] placeholder:opacity-40 focus:outline-none focus:border-[var(--accent3)] transition text-[0.95rem]"
                        />
                    </div>

                    <label className="flex items-start gap-3 text-[0.85rem] leading-6 opacity-90">
                        <input
                            type="checkbox"
                            name="acceptedPolicies"
                            checked={acceptedPolicies}
                            onChange={(e) => setAcceptedPolicies(e.target.checked)}
                            required
                            className="mt-1 h-4 w-4 shrink-0 accent-[var(--accent3)]"
                        />
                        <span>
                            I have read and agree to the{' '}
                            <Link href="/legal#privacy" className="text-[var(--accent3)] font-semibold hover:underline">Privacy Policy</Link>
                            {' '}and{' '}
                            <Link href="/legal#terms" className="text-[var(--accent3)] font-semibold hover:underline">Terms &amp; Conditions</Link>.
                        </span>
                    </label>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full mt-2 py-3.5 rounded-xl bg-[var(--accent3)] text-[#FFFFFF] font-bold text-[1rem] shadow-md hover:opacity-90 transition cursor-pointer disabled:opacity-50 flex items-center justify-center"
                    >
                        {loading ? 'Creating account...' : 'Register'}
                    </button>
                </form>

                <div className="mt-8 text-center text-[0.9rem] opacity-80">
                    Already have an account?{' '}
                    <Link href="/login" className="text-[var(--accent3)] font-semibold hover:underline">
                        Log In
                    </Link>
                </div>
            </div>
        </div>
    );
}
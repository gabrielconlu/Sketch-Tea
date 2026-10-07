'use client';

import { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface UserData {
    id?: string;
    email?: string;
    name?: string;
    [key: string]: any;
}

export default function AccountPage() {
    const router = useRouter();

    const [isMounted, setIsMounted] = useState<boolean>(false);
    const [user, setUser] = useState<UserData | null>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [name, setName] = useState<string>('');
    const [message, setMessage] = useState<string>('');

    useEffect(() => {
        setIsMounted(true);

        // Check login state and load user info
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const savedUser = localStorage.getItem('user');

        if (!isLoggedIn && !savedUser) {
            router.push('/login');
            return;
        }

        if (savedUser) {
            try {
                const parsedUser: UserData = JSON.parse(savedUser);
                setUser(parsedUser);
                setName(parsedUser.name || '');
            } catch (e) {
                console.error('Error parsing user data:', e);
            }
        }
    }, [router]);

    const handleSaveProfile = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!user) return;

        const updatedUser: UserData = { ...user, name };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setIsEditing(false);
        setMessage('Profile updated successfully!');

        setTimeout(() => setMessage(''), 3000);
    };

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('user');
        localStorage.removeItem('userId');
        localStorage.removeItem('generatedReferenceCode');
        window.dispatchEvent(new Event('authChange'));
        router.push('/login');
    };

    if (!isMounted) {
        return null;
    }

    return (
        <div className="max-w-[800px] mx-auto w-full pt-[120px] pb-[60px] px-[20px] flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-[3rem] font-bold tracking-tight">Account Settings</h1>
                <p className="opacity-80">Manage your profile details and preferences for Sketch Tea.</p>
            </div>

            {message && (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-semibold text-sm">
                    {message}
                </div>
            )}

            <div className="bg-[var(--card)] border border-[var(--glass-border)] backdrop-blur-md p-8 rounded-3xl shadow-[var(--shadow)] flex flex-col gap-6">
                <div className="flex justify-between items-center border-b border-[var(--glass-border)] pb-4">
                    <h2 className="text-[1.8rem] font-bold">Personal Information</h2>
                    {!isEditing ? (
                        <button 
                            onClick={() => setIsEditing(true)}
                            className="px-4 py-2 rounded-xl bg-[var(--accent3)] text-white text-sm font-bold transition hover:opacity-90 cursor-pointer"
                        >
                            Edit Profile
                        </button>
                    ) : (
                        <button 
                            onClick={() => setIsEditing(false)}
                            className="px-4 py-2 rounded-xl border border-[var(--glass-border)] text-sm font-bold transition hover:bg-[var(--card)] cursor-pointer"
                        >
                            Cancel
                        </button>
                    )}
                </div>

                {!isEditing ? (
                    <div className="flex flex-col gap-4">
                        <div>
                            <span className="text-xs uppercase font-extrabold tracking-wider opacity-60 block mb-1">Full Name</span>
                            <p className="text-lg font-semibold">{user?.name || 'Not provided'}</p>
                        </div>
                        <div>
                            <span className="text-xs uppercase font-extrabold tracking-wider opacity-60 block mb-1">Email Address</span>
                            <p className="text-lg font-semibold">{user?.email || 'Not provided'}</p>
                        </div>
                        <div>
                            <span className="text-xs uppercase font-extrabold tracking-wider opacity-60 block mb-1">User ID</span>
                            <p className="text-sm font-mono opacity-80">{user?.id || 'Local Session'}</p>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-xs uppercase font-extrabold tracking-wider opacity-60">Full Name</label>
                            <input 
                                type="text" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)}
                                className="p-3 rounded-xl bg-[var(--paper)] border border-[var(--glass-border)] text-[var(--text)] focus:outline-none focus:border-[var(--accent3)]"
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-xs uppercase font-extrabold tracking-wider opacity-60">Email Address (Read-only)</label>
                            <input 
                                type="email" 
                                value={user?.email || ''} 
                                disabled
                                className="p-3 rounded-xl bg-[var(--paper)]/50 border border-[var(--glass-border)] opacity-60 cursor-not-allowed"
                            />
                        </div>
                        <button 
                            type="submit"
                            className="mt-2 py-3 px-6 rounded-xl bg-[var(--accent3)] text-white font-bold transition hover:opacity-90 w-fit cursor-pointer"
                        >
                            Save Changes
                        </button>
                    </form>
                )}

                <hr className="border-[var(--glass-border)] my-2" />

                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-bold text-[var(--error)]">Log Out of Account</h3>
                        <p className="text-sm opacity-70">Sign out of your session on this device.</p>
                    </div>
                    <button 
                        onClick={handleLogout}
                        className="px-4 py-2 rounded-xl bg-[var(--error)]/10 border border-[var(--error)]/30 text-[var(--error)] font-bold text-sm transition hover:bg-[var(--error)] hover:text-white cursor-pointer"
                    >
                        Log Out
                    </button>
                </div>
            </div>
        </div>
    );
}
'use client';

import { useState, useEffect, useCallback, useSyncExternalStore, type MouseEvent, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import './globals.css';

const THEME_CHANGE_EVENT = 'sketchTeaThemeChange';

function subscribeToTheme(callback: () => void) {
    window.addEventListener('storage', callback);
    window.addEventListener(THEME_CHANGE_EVENT, callback);

    return () => {
        window.removeEventListener('storage', callback);
        window.removeEventListener(THEME_CHANGE_EVENT, callback);
    };
}

function getThemeSnapshot() {
    return localStorage.getItem('theme') === 'dark';
}

function getServerThemeSnapshot() {
    return false;
}

export default function RootLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const isDark = useSyncExternalStore(subscribeToTheme, getThemeSnapshot, getServerThemeSnapshot);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [referenceCode, setReferenceCode] = useState('');

    const checkAuthStatus = useCallback(async () => {
        try {
            const response = await fetch('/api/users/session', { credentials: 'include' });
            const data = await response.json();
            setIsLoggedIn(Boolean(data?.authenticated && data?.success));
        } catch {
            setIsLoggedIn(false);
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 800);
        const authTimer = setTimeout(() => {
            void checkAuthStatus();
        }, 0);

        // Retrieve orders from local storage or user profile data to base tracking on account orders
        const accountOrders = JSON.parse(
            localStorage.getItem('userOrders') || 
            localStorage.getItem('orders') || 
            '[]'
        );
        const latestOrderRef = accountOrders.length > 0 ? accountOrders[0].referenceCode : null;

        // Check multiple possible storage keys, prioritizing account history or explicitly generated codes
        const savedRef = 
            localStorage.getItem('generatedReferenceCode') || 
            localStorage.getItem('activeReferenceCode') || 
            latestOrderRef || 
            JSON.parse(localStorage.getItem('user') || '{}')?.latestReferenceCode;

        let referenceTimer: ReturnType<typeof setTimeout> | undefined;
        if (savedRef) {
            referenceTimer = setTimeout(() => {
                setReferenceCode(savedRef);
            }, 0);
        }

        // Listen for storage changes across tabs or custom login triggers
        window.addEventListener('storage', checkAuthStatus);
        
        // Custom event listener if login happens within the same tab without a full reload
        window.addEventListener('authChange', checkAuthStatus);

        return () => {
            clearTimeout(timer);
            clearTimeout(authTimer);
            if (referenceTimer) {
                clearTimeout(referenceTimer);
            }
            window.removeEventListener('storage', checkAuthStatus);
            window.removeEventListener('authChange', checkAuthStatus);
        };
    }, [checkAuthStatus]);

    useEffect(() => {
        document.body.classList.toggle('dark', isDark);
    }, [isDark]);

    const toggleTheme = () => {
        const nextTheme = !isDark;
        localStorage.setItem('theme', nextTheme ? 'dark' : 'light');
        window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
    };

    const handleLogout = async (e: MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();

        try {
            await fetch('/api/users/logout', {
                method: 'POST',
                credentials: 'include',
            });
        } catch {
            // ignore logout API errors and continue with local cleanup
        }

        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('user');
        localStorage.removeItem('userId');
        localStorage.removeItem('generatedReferenceCode');
        setIsLoggedIn(false);
        window.dispatchEvent(new Event('authChange'));
        router.push('/login');
    };

    const navItems = [
        { name: 'About', href: '/about' },
        { name: 'Story Gallery', href: '/story-gallery' },
        { name: 'Characters', href: '/characters' },
        { name: 'Other Services', href: '/other-services' },
        { name: 'Contact', href: '/contact' },
        { name: 'Privacy Policy', href: '/legal' },
    ];

    return (
        <html lang="en">
            <head>
                <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Manrope:wght@400;500;600&display=swap" rel="stylesheet" />
            </head>
            <body>
                <div className={`min-h-screen flex flex-col transition-colors duration-500 ${isDark ? 'dark bg-[#122b2a] text-white' : 'bg-[#FFFFFF] text-[#114b46]'}`}>
                    <style jsx global>{`
                        :root {
                            --paper: ${isDark ? '#122b2a' : '#FFFFFF'};
                            --paper2: ${isDark ? '#0b1c1b' : '#f4fbfb'};
                            --card: ${isDark ? 'rgba(18, 43, 42, 0.85)' : 'rgba(203, 243, 240, 0.35)'};
                            --text: ${isDark ? '#FFFFFF' : '#114b46'};
                            --accent: #2EC4B6;
                            --accent2: #FFBF69;
                            --accent3: #FF9F1C;
                            --glass: ${isDark ? 'rgba(18, 43, 42, 0.95)' : 'rgba(255, 255, 255, 0.90)'};
                            --glass-border: ${isDark ? 'rgba(203, 243, 240, 0.20)' : 'rgba(46, 196, 182, 0.25)'};
                            --shadow: ${isDark ? '0 25px 60px rgba(0, 0, 0, 0.50)' : '0 20px 50px rgba(46, 196, 182, 0.12)'};
                            --error: #e74c3c;
                        }
                        body {
                            font-family: 'Manrope', sans-serif;
                            background: var(--paper);
                            color: var(--text);
                        }
                        h1, h2, h3 {
                            font-family: 'Cormorant Garamond', serif;
                        }
                    `}</style>

                    {/* Page Loader */}
                    <div className={`fixed inset-0 flex justify-center items-center flex-col gap-5 bg-[var(--paper)] z-[99999] transition-opacity duration-600 ${loading ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
                        <div className="w-[70px] h-[70px] rounded-full border-4 border-[var(--glass-border)] border-t-[var(--accent3)] animate-spin"></div>
                        <div className="font-serif text-[54px] font-bold text-[var(--text)]">Sketch <span style={{color: 'var(--accent3)'}}>Tea</span></div>
                    </div>

                    {/* Sidebar Backdrop Overlay */}
                    {sidebarOpen && (
                        <div 
                            onClick={() => setSidebarOpen(false)}
                            className="fixed inset-0 z-[5999] backdrop-blur-sm bg-black/40 transition-opacity duration-300"
                        />
                    )}

                    {/* Sidebar Menu */}
                    <aside className={`fixed top-0 left-0 w-[min(320px,calc(100vw-24px))] h-dvh max-h-dvh overflow-y-auto bg-[var(--glass)] backdrop-blur-[25px] border-r border-[var(--glass-border)] z-[6001] p-[24px_20px] sm:p-[40px_30px] flex flex-col justify-between transition-transform duration-500 ease-out shadow-[var(--shadow)] ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                        <div className="flex flex-col gap-[24px]">
                            <div className="flex justify-between items-center border-b border-[var(--glass-border)] pb-[20px]">
                                <Link href="/about" className="font-serif text-[2.2rem] font-bold text-[var(--text)] no-underline">
                                    Sketch <span className="text-[var(--accent3)]">Tea</span>
                                </Link>
                                <button 
                                    className="w-9 h-9 rounded-full flex items-center justify-center bg-transparent border border-[var(--glass-border)] text-[1.2rem] text-[var(--text)] cursor-pointer transition hover:bg-[var(--accent3)] hover:text-white hover:border-[var(--accent3)]" 
                                    onClick={() => setSidebarOpen(false)}
                                    aria-label="Close menu"
                                >
                                    &times;
                                </button>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <span className="text-[0.7rem] uppercase tracking-[0.1em] text-[var(--accent3)] font-bold px-4 mb-1">Menu</span>
                                {navItems.map((item) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link 
                                            key={item.name}
                                            href={item.href} 
                                            className={`flex items-center px-4 py-3 rounded-xl font-medium text-[1.05rem] transition-all duration-300 no-underline ${
                                                isActive 
                                                    ? 'bg-[var(--accent3)]/20 text-[var(--accent3)] font-semibold border-l-4 border-[var(--accent3)] shadow-sm' 
                                                    : 'text-[var(--text)] hover:bg-[var(--glass-border)]/30 hover:text-[var(--accent3)] hover:translate-x-1.5'
                                            }`} 
                                            onClick={() => setSidebarOpen(false)}
                                        >
                                            <span>{item.name}</span>
                                        </Link>
                                    );
                                })}

                                <div className="mt-1">
                                    {isLoggedIn && referenceCode ? (
                                        <Link 
                                            href={`/order-status/${referenceCode}`} 
                                            className={`flex items-center px-4 py-3 rounded-xl font-medium text-[1.05rem] transition-all duration-300 no-underline ${
                                                pathname.startsWith('/order-status') 
                                                    ? 'bg-[var(--accent3)]/20 text-[var(--accent3)] font-semibold border-l-4 border-[var(--accent3)] shadow-sm' 
                                                    : 'text-[var(--accent3)] hover:bg-[var(--glass-border)]/30 hover:translate-x-1.5'
                                            }`}
                                            onClick={() => setSidebarOpen(false)}
                                        >
                                            <span>Track Order</span>
                                        </Link>
                                    ) : null}
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-[var(--glass-border)] flex flex-col gap-1.5">
                            <span className="text-[0.7rem] uppercase tracking-[0.1em] text-[var(--accent3)] font-bold px-4 mb-1">Account</span>
                            {!isLoggedIn ? (
                                <Link 
                                    href="/login" 
                                    className="flex items-center px-4 py-3 rounded-xl font-medium text-[var(--text)] text-[1rem] hover:bg-[var(--accent3)] hover:text-white transition-all duration-300 no-underline shadow-sm" 
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <span>Log In / Register</span>
                                </Link>
                            ) : (
                                <>
                                    <Link 
                                        href="/account" 
                                        className="flex items-center px-4 py-3 rounded-xl font-medium text-[var(--text)] text-[1rem] hover:bg-[var(--glass-border)]/30 hover:text-[var(--accent3)] transition no-underline" 
                                        onClick={() => setSidebarOpen(false)}
                                    >
                                        <span>Account Settings</span>
                                    </Link>
                                    <a 
                                        href="#" 
                                        onClick={handleLogout} 
                                        className="flex items-center px-4 py-3 rounded-xl font-medium text-[var(--error)] text-[1rem] hover:bg-red-500/10 transition no-underline"
                                    >
                                        <span>Log Out</span>
                                    </a>
                                </>
                            )}
                        </div>
                    </aside>

                    {/* Header */}
                    <header className="fixed top-0 left-0 w-full z-[5000] backdrop-blur-[18px] bg-[var(--glass)] border-b border-[var(--glass-border)] shadow-[var(--shadow)]">
                        <nav className="max-w-[1400px] mx-auto flex items-center justify-between gap-3 p-[10px_14px] sm:gap-4 sm:p-[16px_30px]">
                            <div className="flex items-center gap-4">
                                <button className="bg-transparent border-none cursor-pointer flex flex-col gap-[5px] p-2 z-[5001]" onClick={() => setSidebarOpen(true)} aria-label="Open Menu">
                                    <span className="block w-[28px] h-[3px] bg-[var(--text)] rounded-[3px]"></span>
                                    <span className="block w-[28px] h-[3px] bg-[var(--text)] rounded-[3px]"></span>
                                    <span className="block w-[28px] h-[3px] bg-[var(--text)] rounded-[3px]"></span>
                                </button>
                            </div>
                            
                            <Link href="/about" className="font-serif text-[1.45rem] sm:text-[2.2rem] font-bold text-[var(--text)] no-underline whitespace-nowrap">
                                Sketch <span className="text-[var(--accent3)]">Tea</span>
                            </Link>

                            <div className="flex items-center gap-3">
                                {isLoggedIn && referenceCode ? (
                                    <Link 
                                        href={`/order-status/${referenceCode}`} 
                                        title="Track Order"
                                        className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[var(--glass-border)] bg-[var(--card)] text-[var(--text)] text-[0.85rem] font-semibold transition hover:border-[var(--accent3)] no-underline"
                                    >
                                        📦 Track
                                    </Link>
                                ) : null}

                                <button 
                                    onClick={toggleTheme}
                                    title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                                    className="w-[44px] h-[44px] rounded-full border border-[var(--glass-border)] bg-[var(--card)] text-[var(--accent3)] text-[1.1rem] flex items-center justify-center transition transform hover:scale-110 shadow-md cursor-pointer"
                                >
                                    {isDark ? '☀️' : '🌙'}
                                </button>
                            </div>
                        </nav>
                    </header>

                    {/* Main Content Area */}
                    <main className="flex-grow">
                        {children}
                    </main>
                </div>
            </body>
        </html>
    );
}
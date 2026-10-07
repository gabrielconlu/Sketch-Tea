'use client';

import { useState, useEffect, useCallback, use } from 'react';
import Link from 'next/link';

export default function OrderStatusPage({ params }) {
    // Unwrap params using React.use() for Next.js 15+ compliance
    const resolvedParams = use(params);
    
    // Safely extract from Next.js catch-all route array or string format
    const rawParam = resolvedParams?.referenceCode;
    const rawRefCode = Array.isArray(rawParam) ? rawParam[0] : (rawParam || 'N/A');
    const referenceCode = decodeURIComponent(rawRefCode);

    const [customerName, setCustomerName] = useState('Valued Customer');
    
    // Order status states
    const [orderStatus, setOrderStatus] = useState('Payment Pending Verification');
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(null);

    // Email-based order history list state
    const [userOrders, setUserOrders] = useState([]);

    // Copy to clipboard notification state
    const [copiedField, setCopiedField] = useState(null);

    const handleCopy = async (text, fieldKey) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedField(fieldKey);
            setTimeout(() => {
                setCopiedField(null);
            }, 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    // Reusable fetch function to get current order and strictly filtered history
    const fetchOrderStatus = useCallback(async (isManual = false) => {
        if (!referenceCode || referenceCode === 'N/A') return;
        
        if (isManual) setIsRefreshing(true);

        try {
            // 1. Fetch current single order status & associated email/name
            const res = await fetch(`/api/order-status?ref=${encodeURIComponent(referenceCode)}`);
            const contentType = res.headers.get("content-type");
            
            let fetchedEmail = '';
            let currentOrderName = '';

            if (contentType && contentType.includes("application/json")) {
                const data = await res.json();
                if (data.success && data.status) {
                    setOrderStatus(data.status);
                    setLastUpdated(new Date().toLocaleTimeString());
                    if (data.contact_email) fetchedEmail = data.contact_email;
                    if (data.customerName || data.name) {
                        currentOrderName = data.customerName || data.name;
                        setCustomerName(currentOrderName);
                    }
                }
            }

            // 2. Fallback to localStorage saved user email if API didn't return one
            if (!fetchedEmail) {
                const savedUser = localStorage.getItem('user');
                if (savedUser) {
                    try {
                        const parsedUser = JSON.parse(savedUser);
                        if (parsedUser.email) fetchedEmail = parsedUser.email;
                    } catch (e) {}
                }
            }

            if (!fetchedEmail) {
                const pendingOrder = localStorage.getItem('pendingOrderData') || localStorage.getItem('pendingOrder');
                if (pendingOrder) {
                    try {
                        const parsed = JSON.parse(pendingOrder);
                        if (parsed.email) fetchedEmail = parsed.email;
                    } catch (e) {}
                }
            }

            // 3. Fetch orders and strictly filter them to match the active account name/email or reference prefix pattern
            if (fetchedEmail) {
                const historyRes = await fetch(`/api/user-orders?email=${encodeURIComponent(fetchedEmail)}`);
                const historyContentType = historyRes.headers.get("content-type");

                if (historyContentType && historyContentType.includes("application/json")) {
                    const historyData = await historyRes.json();
                    if (historyData.success && historyData.orders) {
                        // Extract prefix from current reference code (e.g., "ST-DAN" from "ST-DAN-0059")
                        const activePrefix = referenceCode.split('-').slice(0, 2).join('-'); // e.g. "ST-DAN"

                        // Filter orders so it only shows matching name/prefix context (e.g., Dan's orders vs Gab's orders)
                        const filteredOrders = historyData.orders.filter(order => {
                            const matchesPrefix = order.reference_code && order.reference_code.includes(activePrefix);
                            const matchesName = currentOrderName && (order.name || order.customerName)?.toLowerCase() === currentOrderName.toLowerCase();
                            // Keep if it matches the exact active prefix pattern or customer name
                            return matchesPrefix || matchesName;
                        });

                        const sortedOrders = filteredOrders.sort((a, b) => {
                            const dateA = new Date(a.created_at || 0).getTime();
                            const dateB = new Date(b.created_at || 0).getTime();
                            if (dateA !== dateB) return dateB - dateA;
                            return (b.id || 0) - (a.id || 0);
                        });
                        setUserOrders(sortedOrders);
                    }
                }
            }
        } catch (err) {
            console.error("Failed to sync order status and history:", err);
        } finally {
            if (isManual) {
                setTimeout(() => setIsRefreshing(false), 500);
            }
        }
    }, [referenceCode]);

    // Initial load
    useEffect(() => {
        let nameToSet = 'Valued Customer';
        const pendingOrder = localStorage.getItem('pendingOrderData') || localStorage.getItem('pendingOrder');
        if (pendingOrder) {
            try {
                const parsed = JSON.parse(pendingOrder);
                if (parsed.fullName || parsed.name) {
                    nameToSet = parsed.fullName || parsed.name;
                }
                if (parsed.status) {
                    setOrderStatus(parsed.status);
                }
            } catch (e) {}
        }

        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            try {
                const userData = JSON.parse(savedUser);
                if (userData.name || userData.fullName) {
                    nameToSet = userData.name || userData.fullName;
                }
            } catch (e) {}
        }

        setCustomerName(nameToSet);

        fetchOrderStatus();
        const interval = setInterval(() => {
            fetchOrderStatus(false);
        }, 10000);

        return () => {
            clearInterval(interval);
        };
    }, [fetchOrderStatus]);

    const handleManualRefresh = () => {
        fetchOrderStatus(true);
    };

    const handleNewOrder = () => {
        localStorage.removeItem('generatedReferenceCode');
        localStorage.removeItem('pendingOrder');
        localStorage.removeItem('pendingOrderData');
        localStorage.removeItem('pendingReferenceFiles');
        
        window.location.href = '/other-services';
    };

    const isPaid = orderStatus.toLowerCase().includes('paid') || orderStatus.toLowerCase().includes('approved') || orderStatus.toLowerCase().includes('completed');
    const isOrderSubmitted = orderStatus.toLowerCase().includes('submitted') || orderStatus.toLowerCase().includes('pending') || isPaid;

    return (
        <div className="w-full max-w-[750px] mx-auto pt-[120px] pb-20 px-[30px]">
            {/* Creative Scrollbar Styles */}
            <style jsx global>{`
                .creative-scroll::-webkit-scrollbar {
                    width: 8px;
                }
                .creative-scroll::-webkit-scrollbar-track {
                    background: var(--paper2);
                    border-radius: 9999px;
                    margin: 6px 0;
                }
                .creative-scroll::-webkit-scrollbar-thumb {
                    background: linear-gradient(180deg, var(--accent3), #ffbc66);
                    border-radius: 9999px;
                    border: 2px solid var(--paper2);
                    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.15);
                }
                .creative-scroll::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(180deg, #e58a0f, var(--accent3));
                }
            `}</style>

            <div className="text-center mb-10">
                {isOrderSubmitted && (
                    <div className="inline-flex items-center bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 px-4 py-2 rounded-lg mb-[18px] text-[0.85rem] font-bold shadow-sm">
                        ✓ Order Submitted Successfully
                    </div>
                )}
                <h1 className="text-[clamp(2.5rem,4vw,3.8rem)] font-bold mb-3">Live Order Tracker</h1>
                <p className="opacity-85 text-[1.05rem]">Review your active order details and manual payment information below.</p>
            </div>

            {/* Current Selected Reference Card */}
            <div className="bg-[var(--card)] border border-[var(--glass-border)] rounded-[28px] p-[40px_32px] backdrop-blur-[20px] shadow-[var(--shadow)] mb-10">
                <div className="mb-6 p-4 rounded-2xl bg-[var(--paper2)] border border-[var(--glass-border)] text-center relative">
                    <div className="text-xs opacity-70 uppercase tracking-wider mb-1">Active Reference Code</div>
                    <div className="flex items-center justify-center gap-2">
                        <span className="font-mono font-bold text-[1.4rem] text-[var(--accent3)]">{referenceCode}</span>
                        <button
                            onClick={() => handleCopy(referenceCode, 'refCode')}
                            className="p-1.5 rounded-lg border border-[var(--glass-border)] bg-[var(--paper)] hover:border-[var(--accent3)] transition text-xs flex items-center gap-1 cursor-pointer"
                            title="Copy Reference Code"
                        >
                            {copiedField === 'refCode' ? '✅ Copied!' : '📋 Copy'}
                        </button>
                    </div>
                </div>

                <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-center pb-3 border-b border-[var(--glass-border)]">
                        <span className="opacity-75">Current Status</span>
                        <div className="flex items-center gap-2">
                            <span className={`px-3 py-1 rounded-full font-semibold text-xs ${isPaid ? 'bg-[rgba(46,204,113,0.15)] text-[var(--success)]' : 'bg-[rgba(255,159,28,0.15)] text-[var(--accent3)]'}`}>
                                {orderStatus}
                            </span>
                            <button
                                onClick={handleManualRefresh}
                                disabled={isRefreshing}
                                className="text-xs px-2.5 py-1 rounded-lg border border-[var(--glass-border)] bg-[var(--paper)] hover:border-[var(--accent3)] transition flex items-center gap-1 cursor-pointer"
                                title="Check for updates"
                            >
                                <span className={`inline-block ${isRefreshing ? 'animate-spin' : ''}`}>
                                    🔄
                                </span>
                                {isRefreshing ? '...' : 'Refresh'}
                            </button>
                        </div>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-[var(--glass-border)]">
                        <span className="opacity-75">Customer Name</span>
                        <span className="font-semibold">{customerName}</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-[var(--glass-border)]">
                        <span className="opacity-75">Order Details</span>
                        <span className="font-semibold truncate max-w-[250px]">Custom Request</span>
                    </div>
                </div>

                {/* Payment / Bank Details Box */}
                <div className="p-5 rounded-2xl bg-[var(--paper2)] border border-[var(--glass-border)] mb-6">
                    <h4 className="font-serif text-[1.3rem] font-bold mb-2 text-[var(--accent3)]">Payment Instructions</h4>
                    <p className="text-[0.9rem] opacity-85 mb-4">Please complete your manual transfer using the details below. Include your reference code <strong>{referenceCode}</strong> in your transaction notes.</p>
                    
                    <div className="space-y-3 text-[0.9rem]">
                        <div className="flex justify-between items-center border-b border-[var(--glass-border)] pb-2">
                            <span className="opacity-70">Bank / Provider:</span>
                            <span className="font-semibold">Wise (or [Insert Bank Name])</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-[var(--glass-border)] pb-2">
                            <span className="opacity-70">Account Name:</span>
                            <div className="flex items-center gap-2">
                                <span className="font-semibold">[Insert Account Name]</span>
                                <button
                                    onClick={() => handleCopy('[Insert Account Name]', 'accName')}
                                    className="px-2 py-0.5 rounded border border-[var(--glass-border)] bg-[var(--paper)] hover:border-[var(--accent3)] transition text-[11px] cursor-pointer"
                                >
                                    {copiedField === 'accName' ? '✅ Copied' : '📋 Copy'}
                                </button>
                            </div>
                        </div>
                        <div className="flex justify-between items-center pb-1">
                            <span className="opacity-70">Account Number:</span>
                            <div className="flex items-center gap-2">
                                <span className="font-mono font-semibold text-[var(--accent3)]">[Insert Account Number]</span>
                                <button
                                    onClick={() => handleCopy('[Insert Account Number]', 'accNum')}
                                    className="px-2 py-0.5 rounded border border-[var(--glass-border)] bg-[var(--paper)] hover:border-[var(--accent3)] transition text-[11px] cursor-pointer"
                                >
                                    {copiedField === 'accNum' ? '✅ Copied' : '📋 Copy'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-4 rounded-xl bg-[var(--paper2)] border border-[var(--glass-border)] text-[0.85rem] opacity-85 leading-relaxed">
                    💡 <strong>What happens next?</strong> Once you send your payment, our team will review and verify your transaction, and your status will automatically update here!
                    {lastUpdated && <span className="block text-[10px] opacity-40 mt-2">Last checked: {lastUpdated}</span>}
                </div>
            </div>

            {/* Strictly Filtered Order History Section */}
            <div className="bg-[var(--card)] border border-[var(--glass-border)] rounded-[28px] p-[35px_32px] backdrop-blur-[20px] shadow-[var(--shadow)]">
                <h3 className="text-[1.8rem] font-bold mb-2">Your Account Order History</h3>
                <p className="text-[0.95rem] opacity-75 mb-6">Past orders associated with your active profile ({customerName}):</p>

                {userOrders.length === 0 ? (
                    <p className="text-sm opacity-60 italic">No other orders found for this account.</p>
                ) : (
                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-3 creative-scroll">
                        {userOrders.map((order) => {
                            const isThisOrderActive = order.reference_code === referenceCode;
                            const orderIsPaid = order.status.toLowerCase().includes('paid') || order.status.toLowerCase().includes('approved') || order.status.toLowerCase().includes('completed');
                            
                            return (
                                <div 
                                    key={order.id} 
                                    className={`p-4 rounded-xl border transition-all ${isThisOrderActive ? 'border-[var(--accent3)] bg-[var(--paper2)] shadow-sm' : 'border-[var(--glass-border)] bg-[var(--paper)] hover:border-[var(--accent3)]/50'}`}
                                >
                                    <div className="flex flex-wrap justify-between items-center gap-2 mb-2">
                                        <span className="font-mono font-bold text-[var(--accent3)]">{order.reference_code}</span>
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${orderIsPaid ? 'bg-[rgba(46,204,113,0.15)] text-[var(--success)]' : 'bg-[rgba(255,159,28,0.15)] text-[var(--accent3)]'}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <p className="text-xs opacity-80 mb-2 line-clamp-1"><strong>Details:</strong> {order.design_ideas || 'Custom design request'}</p>
                                    <div className="flex justify-between items-center text-[11px] opacity-50 pt-2 border-t border-[var(--glass-border)]">
                                        <span>Placed: {order.created_at ? new Date(order.created_at).toLocaleString() : 'Recent'}</span>
                                        <Link 
                                            href={`/order-status/${order.reference_code}`} 
                                            className="font-bold text-[var(--accent3)] hover:underline"
                                        >
                                            View Details →
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Make a New Order Action Section */}
            <div className="mt-8 text-center">
                <p className="text-[0.95rem] opacity-85 mb-4">Done tracking or ready for another project?</p>
                <button 
                    onClick={handleNewOrder}
                    className="px-6 py-3 bg-[var(--accent3)] text-white font-bold rounded-xl shadow-[0_8px_20px_rgba(255,159,28,0.3)] transition-all hover:scale-105 hover:bg-[#e58a0f] cursor-pointer"
                >
                    ✨ Make a New Order?
                </button>
            </div>
        </div>
    );
}
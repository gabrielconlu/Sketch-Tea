import { NextResponse } from 'next/server';
import { clearSessionCookie } from '@/lib/security';

export async function POST() {
    const response = NextResponse.json({ success: true, message: 'Logged out.' });
    clearSessionCookie(response);
    return response;
}

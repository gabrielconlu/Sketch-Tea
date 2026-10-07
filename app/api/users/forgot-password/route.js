import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getClientIdentifier, isValidEmail, rateLimit, parseCookies } from '@/lib/security';

export async function POST(request) {
    try {
        const body = await request.json();
        const email = String(body.email || '').trim().toLowerCase();
        const clientId = getClientIdentifier(request);

        const rateResult = rateLimit({
            identifier: clientId,
            key: 'forgot-password',
            maxRequests: 3,
            windowMs: 60_000,
        });

        if (!rateResult.allowed) {
            return NextResponse.json(
                { success: false, message: `Too many reset attempts. Please wait ${rateResult.retryAfter} seconds.` },
                { status: 429 }
            );
        }

        const csrfToken = request.headers.get('x-csrf-token');
        const csrfCookie = parseCookies(request.headers.get('cookie') || '').csrf_token;
        if (!csrfToken || !csrfCookie || csrfToken !== csrfCookie) {
            return NextResponse.json(
                { success: false, message: 'Security validation failed. Please refresh and try again.' },
                { status: 403 }
            );
        }

        if (!email || !isValidEmail(email)) {
            return NextResponse.json({ success: false, message: 'Please provide a valid email address.' }, { status: 400 });
        }

        const [rows] = await db.query('SELECT id FROM users WHERE email = ?', [email]);

        if (rows.length === 0) {
            return NextResponse.json({
                success: true,
                message: 'If an account exists for that email, a reset link will be sent.',
            });
        }

        return NextResponse.json({
            success: true,
            message: 'If an account exists for that email, a reset link will be sent.',
        });
    } catch (error) {
        console.error('Forgot password error:', error);
        return NextResponse.json({ success: false, message: 'Server error while processing your request.' }, { status: 500 });
    }
}

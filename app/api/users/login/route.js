import { NextResponse } from 'next/server';
import db from '@/lib/db';
import bcrypt from 'bcrypt';
import {
    getClientIdentifier,
    getSessionFromRequest,
    rateLimit,
    isValidEmail,
    isStrongPassword,
    parseCookies,
    setSessionCookie,
} from '@/lib/security';

export async function POST(req) {
    try {
        const body = await req.json();
        const email = String(body.email || '').trim().toLowerCase();
        const password = String(body.password || '');
        const clientId = getClientIdentifier(req);

        const rateResult = rateLimit({
            identifier: clientId,
            key: 'login',
            maxRequests: 5,
            windowMs: 60_000,
        });

        if (!rateResult.allowed) {
            return NextResponse.json(
                { success: false, message: `Too many login attempts. Please wait ${rateResult.retryAfter} seconds.` },
                { status: 429 }
            );
        }

        const csrfToken = req.headers.get('x-csrf-token');
        const csrfCookie = parseCookies(req.headers.get('cookie') || '').csrf_token;
        if (!csrfToken || !csrfCookie || csrfToken !== csrfCookie) {
            return NextResponse.json(
                { success: false, message: 'Security validation failed. Please refresh and try again.' },
                { status: 403 }
            );
        }

        if (!email || !password || !isValidEmail(email) || !isStrongPassword(password)) {
            return NextResponse.json(
                { success: false, message: 'Invalid email or password format.' },
                { status: 400 }
            );
        }

        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

        if (rows.length === 0) {
            return NextResponse.json(
                { success: false, message: 'Invalid email or password.' },
                { status: 401 }
            );
        }

        const user = rows[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return NextResponse.json(
                { success: false, message: 'Invalid email or password.' },
                { status: 401 }
            );
        }

        const response = NextResponse.json({
            success: true,
            message: 'Login successful!',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        });

        setSessionCookie(response, user);
        return response;
    } catch (error) {
        console.error('❌ Login Error:', error);
        return NextResponse.json(
            { success: false, message: 'Server error during login.' },
            { status: 500 }
        );
    }
}

export async function GET(req) {
    const session = getSessionFromRequest(req);
    if (!session) {
        return NextResponse.json({ success: false, authenticated: false }, { status: 401 });
    }

    return NextResponse.json({
        success: true,
        authenticated: true,
        user: {
            id: session.sub,
            email: session.email,
            name: session.name,
        },
    });
}

import { NextResponse } from 'next/server';
import db from '@/lib/db';
import bcrypt from 'bcrypt';
import { isStrongPassword, isValidEmail, parseCookies, getClientIdentifier, rateLimit } from '@/lib/security';

export async function POST(request) {
    try {
        const body = await request.json();
        const name = String(body.name || '').trim();
        const email = String(body.email || '').trim().toLowerCase();
        const password = String(body.password || '');
        const acceptedPolicies = body.acceptedPolicies === true;

        const clientId = getClientIdentifier(request);
        const rateResult = rateLimit({
            identifier: clientId,
            key: 'register',
            maxRequests: 10,
            windowMs: 60_000,
        });

        if (!rateResult.allowed) {
            return NextResponse.json(
                { success: false, message: `Too many registration attempts. Please wait ${rateResult.retryAfter} seconds.` },
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

        if (!name || name.length < 2) {
            return NextResponse.json({ success: false, message: 'Please enter a valid name.' }, { status: 400 });
        }

        if (!email || !isValidEmail(email)) {
            return NextResponse.json({ success: false, message: 'Please provide a valid email address.' }, { status: 400 });
        }

        if (!password || !isStrongPassword(password)) {
            return NextResponse.json({
                success: false,
                message: 'Password must be at least 8 characters long and include uppercase, number, and symbol.'
            }, { status: 400 });
        }

        if (!acceptedPolicies) {
            return NextResponse.json({ success: false, message: 'You must accept the Privacy Policy and Terms & Conditions.' }, { status: 400 });
        }

        await db.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                is_verified BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        const [existingUser] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return NextResponse.json({ success: false, message: 'Email already registered.' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query(
            'INSERT INTO users (name, email, password, is_verified) VALUES (?, ?, ?, TRUE)',
            [name, email, hashedPassword]
        );

        return NextResponse.json({
            success: true,
            message: 'Registration successful! You can now log in.'
        });
    } catch (error) {
        console.error('Error during user registration:', error);
        return NextResponse.json({ success: false, message: error.message || 'Server error' }, { status: 500 });
    }
}

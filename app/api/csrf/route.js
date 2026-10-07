import { NextResponse } from 'next/server';
import { generateCsrfToken, setSecurityCookie } from '@/lib/security';

export async function GET() {
    const csrfToken = generateCsrfToken();
    const response = NextResponse.json({ success: true, csrfToken });
    setSecurityCookie(response, 'csrf_token', csrfToken, {
        httpOnly: false,
        sameSite: 'lax',
        maxAge: 60 * 60,
    });

    return response;
}

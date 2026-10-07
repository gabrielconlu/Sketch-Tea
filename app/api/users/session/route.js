import { NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/security';

export async function GET(request) {
    const session = getSessionFromRequest(request);

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

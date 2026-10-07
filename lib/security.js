import crypto from 'crypto';

const rateLimitStore = new Map();

export function parseCookies(cookieHeader = '') {
    return cookieHeader.split(';').reduce((cookies, part) => {
        const trimmed = part.trim();
        if (!trimmed) return cookies;

        const separatorIndex = trimmed.indexOf('=');
        if (separatorIndex === -1) {
            cookies[trimmed] = '';
            return cookies;
        }

        const key = trimmed.slice(0, separatorIndex);
        const value = trimmed.slice(separatorIndex + 1);
        cookies[key] = decodeURIComponent(value);
        return cookies;
    }, {});
}

export function getClientIdentifier(request) {
    const forwarded = request?.headers?.get?.('x-forwarded-for');
    const realIp = request?.headers?.get?.('x-real-ip');
    const ip = (forwarded || realIp || 'unknown').split(',')[0].trim();
    return ip || 'unknown';
}

export function rateLimit({ identifier, key, maxRequests = 5, windowMs = 60_000 }) {
    const bucketKey = `${key}:${identifier}`;
    const now = Date.now();
    const entries = rateLimitStore.get(bucketKey) || [];
    const validEntries = entries.filter((timestamp) => now - timestamp < windowMs);

    validEntries.push(now);
    rateLimitStore.set(bucketKey, validEntries);

    if (validEntries.length > maxRequests) {
        const oldest = validEntries[0];
        const retryAfter = Math.max(1, Math.ceil((oldest + windowMs - now) / 1000));
        return { allowed: false, retryAfter };
    }

    return { allowed: true, retryAfter: 0 };
}

export function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());
}

export function isStrongPassword(password) {
    const value = String(password || '');
    return value.length >= 8 && /[A-Z]/.test(value) && /[0-9]/.test(value) && /[^A-Za-z0-9]/.test(value);
}

export function generateCsrfToken() {
    return crypto.randomBytes(32).toString('hex');
}

export function setSecurityCookie(response, name, value, options = {}) {
    response.cookies.set({
        name,
        value,
        path: '/',
        httpOnly: options.httpOnly ?? false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: options.sameSite || 'lax',
        maxAge: options.maxAge ?? 60 * 60 * 24,
    });
}

export function clearSecurityCookie(response, name) {
    response.cookies.set({
        name,
        value: '',
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0,
    });
}

export function createSignedSession(payload) {
    const secret = process.env.SESSION_SECRET || 'change-this-secret-key';
    const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'session' })).toString('base64url');
    const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const signature = crypto
        .createHmac('sha256', secret)
        .update(`${header}.${body}`)
        .digest('base64url');

    return `${header}.${body}.${signature}`;
}

function safeEqual(a, b) {
    if (a.length !== b.length) {
        return false;
    }

    return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

export function verifySignedSession(token) {
    if (!token) {
        return null;
    }

    const [header, payloadPart, signature] = token.split('.');
    if (!header || !payloadPart || !signature) {
        return null;
    }

    const secret = process.env.SESSION_SECRET || 'change-this-secret-key';
    const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(`${header}.${payloadPart}`)
        .digest('base64url');

    if (!safeEqual(signature, expectedSignature)) {
        return null;
    }

    try {
        const payload = JSON.parse(Buffer.from(payloadPart, 'base64url').toString('utf8'));
        if (!payload || !payload.exp || payload.exp < Date.now()) {
            return null;
        }

        return payload;
    } catch {
        return null;
    }
}

export function getSessionFromRequest(request) {
    const cookieHeader = request.headers.get('cookie') || '';
    const cookies = parseCookies(cookieHeader);
    const sessionToken = cookies.sketch_tea_session;
    if (!sessionToken) {
        return null;
    }

    return verifySignedSession(sessionToken);
}

export function setSessionCookie(response, user) {
    const payload = {
        sub: String(user.id),
        email: user.email,
        name: user.name,
        exp: Date.now() + 1000 * 60 * 60 * 12,
    };

    const token = createSignedSession(payload);
    setSecurityCookie(response, 'sketch_tea_session', token, {
        httpOnly: true,
        maxAge: 60 * 60 * 12,
    });
}

export function clearSessionCookie(response) {
    clearSecurityCookie(response, 'sketch_tea_session');
}

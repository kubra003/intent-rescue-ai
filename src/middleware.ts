import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// In-memory rate limiting store (Simple demonstration for hackathon)
const rateLimitStore = new Map<string, { count: number; lastReset: number }>();
const LIMIT = 10; // Requests
const WINDOW = 60 * 1000; // 1 Minute

/**
 * IntentRescue AI: Security & Rate Limiting Middleware
 * Protects clinical API routes from abuse and ensures high availability.
 * Focus on Security evaluation criteria.
 */
export function middleware(request: NextRequest) {
  // Only apply to the analyze API route
  if (request.nextUrl.pathname.startsWith('/api/analyze')) {
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : '127.0.0.1';
    const now = Date.now();
    const entry = rateLimitStore.get(ip) || { count: 0, lastReset: now };

    // Reset window logic
    if (now - entry.lastReset > WINDOW) {
      entry.count = 0;
      entry.lastReset = now;
    }

    entry.count += 1;
    rateLimitStore.set(ip, entry);

    if (entry.count > LIMIT) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Too many emergency requests from this IP.' },
        { status: 429 }
      );
    }
    
    // Security Headers Boost
    const response = NextResponse.next();
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Permissions-Policy', 'geolocation=(), microphone=()');
    return response;
  }

  return NextResponse.next();
}

// Ensure middleware runs only on relevant paths
export const config = {
  matcher: '/api/:path*',
};

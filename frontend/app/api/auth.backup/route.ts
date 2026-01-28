// API routes for Vercel deployment
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const path = request.nextUrl.pathname;
    let body;
    try {
      body = await request.json();
    } catch (error) {
      // If JSON parsing fails, return an error response
      return new Response(
        JSON.stringify({ detail: 'Invalid JSON in request body' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Utility: mock token generator
    const generateToken = () =>
      `mock_token_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;

    // ================= SIGN UP =================
    if (path === '/api/auth/signup') {
      const { email, password } = body;

      if (!email || !password) {
        return new Response(
          JSON.stringify({ detail: 'Email and password are required' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({
          user: { id: '1', email },
          token: generateToken(),
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }
    // ================= SIGN IN =================
    else if (path === '/api/auth/signin') {
      const { email, password } = body;

      if (!email || !password) {
        return new Response(
          JSON.stringify({ detail: 'Email and password are required' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({
          user: { id: '1', email },
          token: generateToken(),
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }
    // ================= LOGOUT =================
    else if (path === '/api/auth/logout') {
      return new Response(
        JSON.stringify({ message: 'Logged out successfully' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }
    // ================= FORGOT PASSWORD =================
    else if (path === '/api/auth/forgot-password') {
      const { email } = body;

      if (!email) {
        return new Response(
          JSON.stringify({ detail: 'Email is required' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ message: 'Password reset email sent' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }
    // ================= RESET PASSWORD =================
    else if (path === '/api/auth/reset-password') {
      const { token, new_password } = body;

      if (!token || !new_password) {
        return new Response(
          JSON.stringify({ detail: 'Token and new password are required' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ message: 'Password reset successful' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }
    // ================= FALLBACK =================
    else {
      return new Response(
        JSON.stringify({ detail: 'Route not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

  } catch (error) {
    console.error('Auth API error:', error);
    return new Response(
      JSON.stringify({ detail: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

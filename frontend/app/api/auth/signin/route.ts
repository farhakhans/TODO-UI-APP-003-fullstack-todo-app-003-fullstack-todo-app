// app/api/auth/signin/route.ts
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    // Basic validation
    if (!email || !password) {
      return Response.json({ detail: 'Email and password are required' }, { status: 400 });
    }

    // Mock response for demo purposes
    // In a real app, you would verify credentials against DB
    const token = `mock-jwt-token-${Date.now()}`;

    return Response.json({
      token: token,  // Changed to match backend format
      user: { id: 1, email }
    });
  } catch (error) {
    return Response.json({ detail: 'Internal server error' }, { status: 500 });
  }
}
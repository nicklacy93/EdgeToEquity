import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// Simple in-memory user store (replace with database)
const users = [
  {
    id: '1',
    email: 'demo@edgetoequity.com',
    password: 'demo123', // In production, use bcrypt hashing
    name: 'Demo User',
    isFirstTimeUser: false,
    onboardingCompleted: true,
    tradingExperience: 'intermediate',
    preferences: {
      theme: 'dark',
      defaultTimeframe: '1H',
      notifications: true,
    },
  },
];

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user
    const user = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return user data (without password) and token
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      user: userWithoutPassword,
      token,
      message: 'Login successful',
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
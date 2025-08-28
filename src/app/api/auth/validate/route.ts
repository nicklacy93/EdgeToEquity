import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Demo user for validation
const demoUser = {
  id: '1',
  email: 'demo@edgetoequity.com',
  name: 'Demo User',
  isFirstTimeUser: false,
  onboardingCompleted: true,
  tradingExperience: 'intermediate',
  preferences: {
    theme: 'dark',
    defaultTimeframe: '1H',
    notifications: true,
  },
};

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    // In production, fetch user from database using decoded.userId
    // For demo, return demo user
    return NextResponse.json(demoUser);
  } catch (error) {
    console.error('Token validation error:', error);
    return NextResponse.json(
      { error: 'Invalid token' },
      { status: 401 }
    );
  }
}
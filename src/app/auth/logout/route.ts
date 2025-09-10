import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

async function clearAuthCookie() {
  // Mirror the attributes you used when setting the cookie
  const cookieStore = await cookies();
  cookieStore.set({
    name: 'auth-token',
    value: '',
    maxAge: 0,
    path: '/',
    httpOnly: false, // set true in real auth
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });
}

// Support both GET (from <Link/>) and POST (from <form/>)
export async function GET(request: Request) {
  await clearAuthCookie();
  return NextResponse.redirect(new URL('/auth/login?signedout=1', request.url));
}

export async function POST(request: Request) {
  await clearAuthCookie();
  return NextResponse.redirect(new URL('/auth/login?signedout=1', request.url));
}

import { cookies } from 'next/headers';

export interface AuthUser {
    id: string;
    email: string;
    name: string;
}

export function getAuthToken(): string | undefined {
    const cookieStore = cookies();
    return cookieStore.get('auth-token')?.value;
}

export function isAuthenticated(): boolean {
    return !!getAuthToken();
}

export function requireAuth(): AuthUser | null {
    const token = getAuthToken();
    if (!token) return null;

    try {
        // In production, verify JWT token here
        // For now, return mock user data
        return {
            id: '1',
            email: 'demo@edgetoequity.com',
            name: 'Demo User'
        };
    } catch {
        return null;
    }
}

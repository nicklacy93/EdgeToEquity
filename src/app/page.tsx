import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default function RootPage() {
    const token = cookies().get('auth-token')?.value;
    redirect(token ? '/dashboard' : '/landing');
}
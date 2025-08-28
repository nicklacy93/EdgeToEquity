import { cookies } from 'next/headers';
import TopNav from '@/components/Navigation/TopNav';

export default function ShellLayout({ children }: { children: React.ReactNode }) {
    const token = cookies().get('auth-token')?.value;
    const isAuthed = Boolean(token);

    return (
        <div className="min-h-screen bg-[hsl(var(--background-hsl))]">
            <TopNav isAuthed={isAuthed} />
            <main className="flex-1">{children}</main>
        </div>
    );
}

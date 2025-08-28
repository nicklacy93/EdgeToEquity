import ShellLayout from '../(shell)/layout';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <ShellLayout>{children}</ShellLayout>;
}

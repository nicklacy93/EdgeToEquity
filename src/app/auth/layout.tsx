import ShellLayout from '../(shell)/layout';

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <ShellLayout>{children}</ShellLayout>;
}

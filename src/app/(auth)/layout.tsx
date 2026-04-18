export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-background via-muted to-background px-4 py-12">
      {children}
    </div>
  );
}

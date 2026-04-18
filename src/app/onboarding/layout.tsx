import * as React from "react";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-background via-muted to-background px-4 py-8 ">
      <div className="w-full max-w-2xl">
        <div className="mb-3 text-center">
          <h1 className="text-3xl font-extrabold mt-2">Welcome!</h1>
          <p className="text-muted-foreground mt-1">
            Let&apos;s get your business profile ready.
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}

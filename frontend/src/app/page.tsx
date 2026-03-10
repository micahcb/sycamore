"use client";

import { useAuth } from "@/components/auth/backend-auth-provider";
import { HomeLanding } from "@/components/home-landing";
import { PlaidLinkSection } from "@/components/plaid-link-section";

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background">
        <div className="text-muted-foreground">Loading…</div>
      </div>
    );
  }

  if (!user) {
    return <HomeLanding />;
  }

  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <main className="mx-auto max-w-5xl px-4 py-12">
        <PlaidLinkSection />
      </main>
    </div>
  );
}

"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/backend-auth-provider";

const PUBLIC_PATHS = ["/", "/login"];

type AuthGuardProps = {
  children: ReactNode;
  /** When on /login or / (unauthenticated) we render only this (no sidebar/nav). Otherwise we render shell. */
  shell?: ReactNode;
};

export function AuthGuard({ children, shell }: AuthGuardProps) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    const isPublic = PUBLIC_PATHS.includes(pathname);
    if (!user && !isPublic) {
      router.replace("/");
    }
  }, [loading, user, pathname, router]);

  if (loading) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background">
        <div className="text-muted-foreground">Loading…</div>
      </div>
    );
  }

  if (!user && !PUBLIC_PATHS.includes(pathname)) {
    return null;
  }

  if (pathname === "/login") {
    return <>{children}</>;
  }

  if (pathname === "/" && !user) {
    return <>{children}</>;
  }

  return <>{shell ?? children}</>;
}

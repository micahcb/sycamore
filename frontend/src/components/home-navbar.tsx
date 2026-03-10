"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { TreeLottie } from "@/components/tree-lottie";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Blog", href: "#" },
  { label: "Resources", href: "#" },
  { label: "Contact", href: "#" },
];

const SCROLL_FADE_THRESHOLD = 120;

export function HomeNavbar() {
  const [logoHovered, setLogoHovered] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(typeof window !== "undefined" ? window.scrollY : 0);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const opacity = Math.max(0, 1 - scrollY / SCROLL_FADE_THRESHOLD);

  return (
    <header
      className="sticky top-0 z-50 w-full px-4 pt-4 transition-opacity duration-200"
      style={{ opacity, pointerEvents: opacity < 0.01 ? "none" : "auto" }}
      role="banner"
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-6 focus:top-6 focus:z-100 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-sm focus:text-primary-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      >
        Skip to main content
      </a>
      <div className="mx-auto flex h-14 min-w-0 max-w-[calc(100%-2rem)] items-center justify-between gap-6 rounded-2xl border border-border/50 bg-background/80 px-4 py-2 shadow-lg backdrop-blur-md supports-backdrop-filter:bg-background/70 sm:w-fit sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-md"
          aria-label="Go to Sycamore homepage"
          onMouseEnter={() => setLogoHovered(true)}
          onMouseLeave={() => setLogoHovered(false)}
        >
          <TreeLottie className="h-6 w-6 shrink-0" playTrigger={logoHovered} aria-hidden />
          <span className="font-semibold tracking-tight">Sycamore</span>
        </Link>

        <nav
          className="flex items-center gap-6"
          aria-label="Main navigation"
        >
          <ul className="hidden items-center gap-6 sm:flex">
            {navLinks.map(({ label, href }) => (
              <li key={label}>
                <Link
                  href={href}
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-md"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:hidden"
            aria-label="Main menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <svg
              aria-hidden
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="size-4"
            >
              <path d="M14 4.25H2V2.75H14V4.25Z" fill="currentColor" />
              <path d="M14 8.75H2V7.25H14V8.75Z" fill="currentColor" />
              <path d="M2 13.25H14V11.75H2V13.25Z" fill="currentColor" />
            </svg>
          </button>
        </nav>
      </div>
      {menuOpen && (
        <div className="mx-auto mt-2 max-w-5xl rounded-2xl border border-border/50 bg-background/80 px-4 py-3 shadow-lg backdrop-blur-md supports-backdrop-filter:bg-background/70 sm:hidden">
          <ul className="flex flex-col gap-2">
            {navLinks.map(({ label, href }) => (
              <li key={label}>
                <Link
                  href={href}
                  className={cn(
                    "block rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  )}
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}

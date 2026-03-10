"use client";

import Link from "next/link";
import { TreeLottie } from "@/components/tree-lottie";

const companyLinks = [
  { label: "About", href: "#" },
  { label: "Careers", href: "#" },
  { label: "Contact", href: "#" },
];

export function HomeFooter() {
  return (
    <footer className="relative overflow-hidden py-20" role="contentinfo">
      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <div className="mb-12 flex flex-col items-start gap-12 md:flex-row md:justify-between">
          <div className="max-w-sm">
            <div className="mb-4 flex items-center gap-2 text-foreground">
              <span className="flex shrink-0 rounded-md border border-border bg-card/50 p-1.5">
                <TreeLottie className="h-6 w-6 text-primary" aria-hidden />
              </span>
              <span className="text-lg font-semibold tracking-tight">Sycamore</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Personal finance that grows with you. Track income, connect accounts, and stay on budget.
            </p>
          </div>
          <div className="flex gap-14 md:ml-auto">
            <div>
              <span className="mb-3 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Company
              </span>
              <div className="flex flex-col gap-1.5">
                {companyLinks.map(({ label, href }) => (
                  <Link
                    key={label}
                    href={href}
                    className="text-left text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <span className="mb-3 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Contact
              </span>
              <div className="space-y-1.5 text-sm">
                <a
                  href="mailto:contact@sycamore.app"
                  className="block text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
                >
                  contact@sycamore.app
                </a>
                <a
                  href="mailto:support@sycamore.app"
                  className="block text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
                >
                  support@sycamore.app
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="mb-6 h-px w-full shrink-0 bg-border/80" role="separator" />
        <p className="text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Sycamore. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

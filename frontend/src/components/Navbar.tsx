"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { TreeIcon } from "@/components/tree-icon";

const pageLabels: Record<string, string> = {
  "/": "Home",
  "/accounts": "Accounts",
  "/transactions": "Transactions",
};

function getPageLabel(pathname: string): string {
  if (pageLabels[pathname]) return pageLabels[pathname];
  if (pathname.startsWith("/accounts")) return "Accounts";
  if (pathname.startsWith("/transactions")) return "Transactions";
  return "Home";
}

export function Navbar() {
  const pathname = usePathname();
  const currentPage = getPageLabel(pathname ?? "/");

  return (
    <nav
      className="flex h-14 w-full shrink-0 items-center border-b border-border bg-background px-4"
      aria-label="Main navigation"
    >
      <span className="flex items-center gap-2 text-md font-medium text-foreground" aria-current="page">
        {currentPage}
      </span>
    </nav>
  );
}

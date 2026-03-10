"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LordIcon } from "@/components/lord-icon";
import { TreeLottie } from "@/components/tree-lottie";
import { cn } from "@/lib/utils";

// Lordicon CDN URLs (hover-triggered). Swap with any icon from https://lordicon.com → copy embed URL.
const LORDICON = {
  home: "https://cdn.lordicon.com/ewtxwele.json",
  accounts: "https://cdn.lordicon.com/bgfqzjey.json",
  transactions: "https://cdn.lordicon.com/hnzvpwtz.json",
} as const;

const navItems = [
  { href: "/", label: "Home", icon: LORDICON.home },
  { href: "/accounts", label: "Accounts", icon: LORDICON.accounts },
  { href: "/transactions", label: "Transactions", icon: LORDICON.transactions },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <div
      className="fixed inset-y-0 left-0 z-10 hidden h-svh w-(--sidebar-width) border-r border-sidebar-border bg-sidebar transition-[left,right,width] duration-200 ease-linear md:flex"
      data-side="left"
    >
      <div
        data-sidebar="sidebar"
        className="flex h-full w-full flex-col bg-sidebar"
      >
        <div
          data-slot="sidebar-header"
          data-sidebar="header"
          className="flex h-14 flex-col gap-2 border-b border-sidebar-border p-2"
        >
          <div className="flex h-full items-center px-2">
            <Link
              href="/"
              className="flex items-center gap-2 truncate text-sidebar-foreground transition-colors hover:text-sidebar-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
            >
              <TreeLottie className="h-6 w-6" aria-hidden />
              <span className="font-semibold tracking-tight">Sycamore</span>
            </Link>
          </div>
        </div>
        <div
          data-slot="sidebar-content"
          data-sidebar="content"
          className="flex min-h-0 flex-1 flex-col gap-2 overflow-auto"
        >
          <div
            data-slot="sidebar-group"
            data-sidebar="group"
            className="relative flex w-full min-w-0 flex-col p-2"
          >
            <div
              data-slot="sidebar-group-label"
              data-sidebar="group-label"
              className="flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 outline-none ring-sidebar-ring transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2"
            >
              BUDGET
            </div>
            <div
              data-slot="sidebar-group-content"
              data-sidebar="group-content"
              className="w-full text-sm"
            >
              <ul
                data-slot="sidebar-menu"
                data-sidebar="menu"
                className="flex w-full min-w-0 flex-col gap-1"
              >
                {navItems.map(({ href, label, icon }) => {
                  const isActive =
                    href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(href);
                  return (
                    <li
                      key={href}
                      data-slot="sidebar-menu-item"
                      data-sidebar="menu-item"
                      className="group/menu-item relative"
                    >
                      <Link
                        href={href}
                        className={cn(
                          "peer/menu-button flex h-8 w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm text-sidebar-foreground outline-none ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2",
                          "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                          "active:bg-sidebar-accent active:text-sidebar-accent-foreground",
                          "disabled:pointer-events-none disabled:opacity-50",
                          "data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground",
                          "[&>span:last-child]:truncate [&_lord-icon]:shrink-0"
                        )}
                        data-slot="sidebar-menu-button"
                        data-sidebar="menu-button"
                        data-size="default"
                        data-active={isActive}
                        aria-current={isActive ? "page" : undefined}
                      >
                        <LordIcon
                          src={icon}
                          trigger="hover"
                          size={20}
                          className="text-sidebar-foreground"
                        />
                        <span className="flex items-center gap-2">{label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
        <div
          data-slot="sidebar-footer"
          data-sidebar="footer"
          className="flex flex-row items-center gap-2 p-2"
        />
      </div>
    </div>
  );
}

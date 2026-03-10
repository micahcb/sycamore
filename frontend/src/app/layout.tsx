import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono, Figtree } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { AppSidebar } from "@/components/app-sidebar";
import { AuthGuard } from "@/components/auth/auth-guard";
import { BackendAuthProvider } from "@/components/auth/backend-auth-provider";
import { Navbar } from "@/components/Navbar";

const figtree = Figtree({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sycamore",
  description: "Sycamore is a personal finance management tool that helps you track your income and expenses.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("dark font-sans", figtree.variable)}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Script
          src="https://cdn.plaid.com/link/v2/stable/link-initialize.js"
          strategy="beforeInteractive"
        />
        <BackendAuthProvider>
          <AuthGuard
            shell={
              <>
                <AppSidebar />
                <div className="flex min-h-svh flex-col md:pl-(--sidebar-width)">
                  <Navbar />
                  {children}
                </div>
              </>
            }
          >
            {children}
          </AuthGuard>
        </BackendAuthProvider>
      </body>
    </html>
  );
}

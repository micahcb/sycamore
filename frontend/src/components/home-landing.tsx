"use client";

import { useState } from "react";
import Link from "next/link";
import { BanksMarquee } from "@/components/banks-marquee";
import { HomeFooter } from "@/components/home-footer";
import { HomeNavbar } from "@/components/home-navbar";
import { LordIcon } from "@/components/lord-icon";
import { TreeLottie } from "@/components/tree-lottie";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const LORDICON_WALLET = "https://cdn.lordicon.com/ynsswhvj.json";

export function HomeLanding() {
  const [logoHovered, setLogoHovered] = useState(false);

  return (
    <div className="min-h-screen w-full bg-background font-sans antialiased flex flex-col items-center">
      <HomeNavbar />
      <main id="main-content" className="w-full max-w-5xl flex-1 flex flex-col items-center px-4 py-12">
        <div className="flex flex-col items-center justify-center gap-8 pt-12 text-center md:pt-20 w-full">
          <div
            className="flex flex-col items-center justify-center gap-3 w-full max-w-min"
            onMouseEnter={() => setLogoHovered(true)}
            onMouseLeave={() => setLogoHovered(false)}
          >
            <span className="inline-flex items-center justify-center rounded-xl border border-border bg-card p-3 shadow-sm shrink-0">
              <TreeLottie className="h-12 w-12 text-primary" playTrigger={logoHovered} aria-hidden />
            </span>
            <h1 className="text-4xl font-semibold tracking-tight text-foreground w-full text-center">
              Sycamore
            </h1>
          </div>
          <div className="space-y-2">
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              Personal finance that grows with you. Track income, connect accounts, and stay on top of your budget.
            </p>
          </div>
          <Link href="/login">
            <Button size="lg" className="gap-2" id="home-cta-btn">
              Get started
              <LordIcon
                src={LORDICON_WALLET}
                trigger="hover"
                target="#home-cta-btn"
                size={20}
                className="text-primary-foreground"
              />
            </Button>
          </Link>
        </div>

        <div className="mt-16 w-full grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="rounded-xl border border-border bg-card py-6 shadow-sm">
            <CardHeader className="px-6">
              <CardTitle className="text-md font-medium text-primary">
                Connect accounts
              </CardTitle>
              <CardDescription className="text-muted-foreground text-sm">
                Link your bank and cards securely with Plaid. Your data stays private.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="rounded-xl border border-border bg-card py-6 shadow-sm">
            <CardHeader className="px-6">
              <CardTitle className="text-md font-medium text-primary">
                Track spending
              </CardTitle>
              <CardDescription className="text-muted-foreground text-sm">
                See transactions in one place and understand where your money goes.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="rounded-xl border border-border bg-card py-6 shadow-sm sm:col-span-2 lg:col-span-1">
            <CardHeader className="px-6">
              <CardTitle className="text-md font-medium text-primary">
                Stay on budget
              </CardTitle>
              <CardDescription className="text-muted-foreground text-sm">
                Set goals and get a clear view of your finances without the hassle.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
        <BanksMarquee />
      </main>
      <HomeFooter />
    </div>
  );
}

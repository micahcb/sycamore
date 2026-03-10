"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { getAccounts } from "@/lib/plaid-api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Account = {
  account_id: string;
  name: string;
  type: string;
  subtype: string;
  balances?: { current?: number; available?: number };
};

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAccounts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAccounts();
      setAccounts(res.accounts as Account[]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load accounts");
      setAccounts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <main className="mx-auto max-w-5xl px-4 py-12">
        <h1 className="mb-2 font-semibold tracking-tight text-foreground">
          Accounts
        </h1>
        <p className="mb-6 text-sm text-muted-foreground">
          Linked bank accounts from your connected item.
        </p>

        <Card className="w-full max-w-2xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-semibold tracking-tight">
              Your accounts
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchAccounts}
              disabled={loading}
              aria-label="Refresh accounts"
            >
              Refresh
            </Button>
          </CardHeader>
          <CardContent>
            {loading && (
              <p className="text-sm text-muted-foreground">Loading…</p>
            )}
            {error && (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            )}
            {!loading && !error && accounts.length === 0 && (
              <CardDescription>
                No accounts yet. Connect a bank account on the{" "}
                <Link href="/" className="font-medium text-primary underline">
                  home page
                </Link>{" "}
                to see accounts here.
              </CardDescription>
            )}
            {!loading && !error && accounts.length > 0 && (
              <ul className="space-y-3">
                {accounts.map((a) => (
                  <li
                    key={a.account_id}
                    className="flex flex-col gap-1 rounded-lg border border-border bg-muted/30 px-4 py-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-foreground">
                        {a.name}
                      </span>
                      <span className="text-xs text-muted-foreground uppercase tracking-wide">
                        {a.subtype ?? a.type}
                      </span>
                    </div>
                    {a.balances?.current != null && (
                      <p className="text-sm text-muted-foreground">
                        Current: $
                        {typeof a.balances.current === "number"
                          ? a.balances.current.toFixed(2)
                          : a.balances.current}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { getTransactions } from "@/lib/plaid-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Transaction = {
  name?: string;
  amount?: number;
  date?: string;
  pending?: boolean;
};

function formatDateRange(start: string | Date, end: string | Date) {
  const a = new Date(start);
  const b = new Date(end);
  return { start: a.toISOString().slice(0, 10), end: b.toISOString().slice(0, 10) };
}

const defaultRange = formatDateRange(
  new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  new Date()
);

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState(defaultRange.start);
  const [endDate, setEndDate] = useState(defaultRange.end);

  const fetchTransactions = useCallback(
    async (start?: string, end?: string) => {
      setLoading(true);
      setError(null);
      const s = start ?? startDate;
      const e = end ?? endDate;
      try {
        const res = await getTransactions({ start_date: s, end_date: e });
        setTransactions((res.transactions as Transaction[]) ?? []);
        setTotal(res.total ?? 0);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load transactions");
        setTransactions([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    },
    [startDate, endDate]
  );

  useEffect(() => {
    fetchTransactions(defaultRange.start, defaultRange.end);
  }, []);

  const handleApplyRange = useCallback(() => {
    fetchTransactions(startDate, endDate);
  }, [startDate, endDate, fetchTransactions]);

  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <main className="mx-auto max-w-5xl px-4 py-12">
        <h1 className="mb-2 font-semibold tracking-tight text-foreground">
          Transactions
        </h1>
        <p className="mb-6 text-sm text-muted-foreground">
          Filter by date range. Results from the API for your linked item.
        </p>

        <Card className="mb-6 w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="font-semibold tracking-tight">
              Date range
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Choose start and end date (YYYY-MM-DD), then apply.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap items-end gap-4">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="start-date"
                className="text-sm font-medium text-foreground"
              >
                Start date
              </label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                aria-label="Start date for transaction range"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="end-date"
                className="text-sm font-medium text-foreground"
              >
                End date
              </label>
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                aria-label="End date for transaction range"
              />
            </div>
            <Button
              onClick={handleApplyRange}
              disabled={loading}
              aria-label="Apply date range filter"
            >
              Apply
            </Button>
          </CardContent>
        </Card>

        <Card className="w-full max-w-2xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-semibold tracking-tight">
              Transactions
            </CardTitle>
            {!loading && !error && (
              <span className="text-sm text-muted-foreground">
                {total} total
              </span>
            )}
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
            {!loading && !error && transactions.length === 0 && (
              <CardDescription>
                No transactions in this range. Try a different date range or
                connect a bank account on the{" "}
                <Link href="/" className="font-medium text-primary underline">
                  home page
                </Link>
                .
              </CardDescription>
            )}
            {!loading && !error && transactions.length > 0 && (
              <ul className="max-h-[60vh] space-y-2 overflow-y-auto">
                {transactions.map((t, i) => (
                  <li
                    key={t.name ? `${t.date}-${t.name}-${i}` : i}
                    className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-4 py-3"
                  >
                    <div className="min-w-0 flex-1">
                      <span className="font-medium text-foreground">
                        {t.name ?? "—"}
                      </span>
                      {t.date && (
                        <span className="ml-2 text-xs text-muted-foreground">
                          {t.date}
                        </span>
                      )}
                      {t.pending && (
                        <span className="ml-2 text-xs text-muted-foreground">
                          (pending)
                        </span>
                      )}
                    </div>
                    <span className="shrink-0 font-medium text-foreground">
                      {t.amount != null ? `$${t.amount.toFixed(2)}` : "—"}
                    </span>
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

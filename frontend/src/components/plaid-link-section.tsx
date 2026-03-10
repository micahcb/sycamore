"use client";

import { useCallback, useEffect, useState } from "react";
import { usePlaidLink } from "react-plaid-link";
import { useAuth } from "@/components/auth/backend-auth-provider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  createLinkToken,
  exchangeToken,
  getAccounts,
  getTransactions,
} from "@/lib/plaid-api";

type Account = { account_id: string; name: string; type: string; subtype: string };
type Transaction = { name?: string; amount?: number; date?: string; pending?: boolean };

export function PlaidLinkSection() {
  const { user } = useAuth();
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [linked, setLinked] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLinkToken = useCallback(async () => {
    setError(null);
    try {
      const { link_token } = await createLinkToken(user?.id);
      setLinkToken(link_token);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to get link token");
    }
  }, [user?.id]);

  useEffect(() => {
    fetchLinkToken();
  }, [fetchLinkToken]);

  const onSuccess = useCallback(
    async (publicToken: string) => {
      setError(null);
      setLoading(true);
      try {
        await exchangeToken(publicToken);
        setLinked(true);
        const [accRes, txRes] = await Promise.all([
          getAccounts(),
          getTransactions(),
        ]);
        setAccounts(accRes.accounts);
        setTransactions(txRes.transactions as Transaction[]);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to link account");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess,
    onExit: (error) => {
      if (error) setError(error.error_message ?? "Link exited with error");
    },
  });

  const refetchData = useCallback(async () => {
    if (!linked) return;
    setLoading(true);
    setError(null);
    try {
      const [accRes, txRes] = await Promise.all([
        getAccounts(),
        getTransactions(),
      ]);
      setAccounts(accRes.accounts);
      setTransactions(txRes.transactions as Transaction[]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  }, [linked]);

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="font-semibold tracking-tight">
          Connect your bank
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Sandbox: use username <code className="rounded bg-muted px-1">user_good</code>, password{" "}
          <code className="rounded bg-muted px-1">pass_good</code>. For phone use{" "}
          <code className="rounded bg-muted px-1">415-555-0010</code> (OTP: 123456).
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => open()}
            disabled={!ready || !linkToken || loading}
            aria-label="Open Plaid Link to connect a bank account"
          >
            {linked ? "Link another account" : "Connect bank account"}
          </Button>
          {linked && (
            <Button
              variant="outline"
              onClick={refetchData}
              disabled={loading}
            >
              Refresh data
            </Button>
          )}
        </div>

        {linked && (
          <>
            {accounts.length > 0 && (
              <div>
                <h3 className="mb-2 font-medium tracking-tight text-foreground">
                  Accounts
                </h3>
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  {accounts.map((a) => (
                    <li
                      key={a.account_id}
                      className="flex justify-between rounded-md border border-border bg-muted/30 px-3 py-2"
                    >
                      <span className="font-medium text-foreground">{a.name}</span>
                      <span>{a.subtype ?? a.type}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {transactions.length > 0 && (
              <div>
                <h3 className="mb-2 font-medium tracking-tight text-foreground">
                  Recent transactions
                </h3>
                <ul className="max-h-60 space-y-1.5 overflow-y-auto text-sm text-muted-foreground">
                  {transactions.slice(0, 20).map((t, i) => (
                    <li
                      key={t.name ? `${t.date}-${t.name}-${i}` : i}
                      className="flex justify-between rounded-md border border-border bg-muted/30 px-3 py-2"
                    >
                      <span className="text-foreground">{t.name ?? "—"}</span>
                      <span>
                        {t.amount != null ? `$${t.amount.toFixed(2)}` : "—"}
                        {t.pending && " (pending)"}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

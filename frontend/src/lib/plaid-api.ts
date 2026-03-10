const raw = process.env.NEXT_PUBLIC_PLAID_API_URL ?? "http://localhost:3001";
const API_BASE =
  raw.startsWith("http://") || raw.startsWith("https://")
    ? raw
    : `https://${raw}`;

async function request<T>(
  path: string,
  options?: RequestInit & { body?: object }
): Promise<T> {
  const { body, ...init } = options ?? {};
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init.headers },
    ...(body !== undefined && { body: JSON.stringify(body) }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { error?: unknown }).error as string ?? res.statusText);
  return data as T;
}

export async function createLinkToken(clientUserId?: string) {
  return request<{ link_token: string }>("/api/link/token", {
    method: "POST",
    body: clientUserId ? { clientUserId } : {},
  });
}

export async function exchangeToken(publicToken: string) {
  return request<{ access_token: string; item_id: string }>("/api/token/exchange", {
    method: "POST",
    body: { public_token: publicToken },
  });
}

export async function getAccounts() {
  return request<{ accounts: Array<{ account_id: string; name: string; type: string; subtype: string; balances?: unknown }> }>("/api/accounts");
}

export async function getTransactions(params?: { start_date?: string; end_date?: string }) {
  const q = params ? new URLSearchParams(params).toString() : "";
  return request<{ transactions: Array<unknown>; total: number }>(`/api/transactions${q ? `?${q}` : ""}`, { method: "GET" });
}

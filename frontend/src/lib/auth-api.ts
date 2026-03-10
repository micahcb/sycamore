const raw = process.env.NEXT_PUBLIC_PLAID_API_URL ?? "http://localhost:3001";
const API_BASE = (
  raw.startsWith("http://") || raw.startsWith("https://") ? raw : `https://${raw}`
).replace(/\/+$/, "");

export type VerifyResponse = {
  token: string;
  user: { id: string; phone: string };
};

export async function sendOtp(phone: string): Promise<void> {
  const res = await fetch(`${API_BASE}/auth/send-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data as { error?: string }).error ?? "Failed to send code");
  }
}

export async function verifyOtp(phone: string, code: string): Promise<VerifyResponse> {
  const res = await fetch(`${API_BASE}/auth/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, code }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data as { error?: string }).error ?? "Verification failed");
  }
  return data as VerifyResponse;
}

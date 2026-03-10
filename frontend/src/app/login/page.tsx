"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/backend-auth-provider";
import { sendOtp, verifyOtp } from "@/lib/auth-api";
import { LordIcon } from "@/components/lord-icon";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const LORDICON_SEND =
  "https://cdn.lordicon.com/sxbdgbzi.json";
const LORDICON_VERIFY =
  "https://cdn.lordicon.com/ypagsvdy.json";

export default function LoginPage() {
  const { user, loading: authLoading, setSession } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoginMode, setIsLoginMode] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      router.replace("/");
    }
  }, [authLoading, user, router]);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const raw = phone.trim();
    if (!raw) {
      setError("Enter your phone number");
      return;
    }
    setLoading(true);
    try {
      await sendOtp(raw);
      setStep("code");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send code");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const rawPhone = phone.trim();
    const rawCode = code.trim();
    if (!rawPhone || !rawCode) {
      setError("Enter the code we sent you");
      return;
    }
    setLoading(true);
    try {
      const { token, user: authUser } = await verifyOtp(rawPhone, rawCode);
      setSession(token, authUser);
      router.replace("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background">
        <div className="text-muted-foreground">Loading…</div>
      </div>
    );
  }

  if (user) {
    return null;
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-background px-4 py-8">
      <div className="flex w-full max-w-sm flex-col items-center justify-center">
        <Card className="w-full rounded-lg border border-border bg-card shadow-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl font-semibold tracking-tight text-foreground">
              {isLoginMode ? "Log In" : "Create your account"}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {step === "phone"
                ? "Enter your phone number to get started."
                : "Enter the 6-digit code we sent to your phone."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {step === "phone" ? (
              <form className="space-y-4" onSubmit={handleSendCode}>
                <div className="space-y-2">
                  <label
                    htmlFor="phone"
                    className="block pb-1 text-sm font-medium leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Phone number
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    autoComplete="tel"
                    className="w-full"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    aria-required
                    disabled={loading}
                  />
                </div>
                {error && (
                  <p className="text-sm text-destructive" role="alert">
                    {error}
                  </p>
                )}
                <Button
                  id="send-code-btn"
                  type="submit"
                  className="w-full"
                  variant="default"
                  disabled={loading}
                >
                  {loading ? "Sending…" : "Send code"}
                  <LordIcon
                    src={LORDICON_SEND}
                    trigger="hover"
                    target="#send-code-btn"
                    size={20}
                    className="text-primary-foreground"
                  />
                  
                </Button>
              </form>
            ) : (
              <form className="space-y-4" onSubmit={handleVerify}>
                <div className="space-y-2">
                  <label
                    htmlFor="code"
                    className="block pb-2 text-sm font-medium leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Verification code
                  </label>
                  <Input
                    id="code"
                    name="code"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    placeholder="000000"
                    maxLength={6}
                    className="w-full"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    aria-required
                    disabled={loading}
                  />
                </div>
                {error && (
                  <p className="text-sm text-destructive" role="alert">
                    {error}
                  </p>
                )}
                <Button
                  id="verify-btn"
                  type="submit"
                  className="w-full"
                  variant="default"
                  disabled={loading}
                >
                  {loading ? "Verifying…" : "Verify"}
                  <LordIcon
                    src={LORDICON_VERIFY}
                    trigger="hover"
                    target="#verify-btn"
                    size={20}
                    className="text-primary-foreground"
                  />
                </Button>
                <button
                  type="button"
                  onClick={() => {
                    setStep("phone");
                    setCode("");
                    setError(null);
                  }}
                  className="w-full text-sm text-muted-foreground hover:text-foreground"
                >
                  Use a different number
                </button>
              </form>
            )}
          </CardContent>
          <CardFooter className="flex flex-col items-center gap-2 border-t border-border pt-6">
            <p className="text-sm text-muted-foreground">
              {isLoginMode ? (
                <>
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setIsLoginMode(false)}
                    className={cn(
                      "font-medium text-primary underline-offset-4 hover:underline"
                    )}
                  >
                    Create account
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setIsLoginMode(true)}
                    className={cn(
                      "font-medium text-primary underline-offset-4 hover:underline"
                    )}
                  >
                    Sign in
                  </button>
                </>
              )}
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

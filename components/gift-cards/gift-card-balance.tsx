"use client";

import { useState } from "react";
import { CheckCircle2, CreditCard, Loader2, Search, XCircle } from "lucide-react";
import { checkGiftCardBalance } from "@/lib/gift-cards";
import { GiftCardBalanceResult } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function GiftCardBalance() {
  const [code, setCode] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GiftCardBalanceResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleCheck(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) {
      setError("Please enter your 16-character gift card or voucher code.");
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await checkGiftCardBalance(code, pin);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to look up gift card balance.");
    } finally {
      setLoading(false);
    }
  }

  function handleDemoClick(demoCode: string) {
    setCode(demoCode);
    setPin("1234");
    setError(null);
  }

  return (
    <section aria-labelledby="balance-heading" className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-6 sm:p-8 shadow-xs">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
          <CreditCard className="size-5" />
        </div>
        <div>
          <h2 id="balance-heading" className="font-serif text-xl sm:text-2xl font-semibold text-on-surface">
            Check Your Card Balance
          </h2>
          <p className="text-xs text-on-surface-variant">
            Enter your voucher code to check the remaining funds available to spend.
          </p>
        </div>
      </div>

      <form onSubmit={handleCheck} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-[2fr_1fr_auto] gap-3 items-end">
          <div>
            <label htmlFor="balance-card-code" className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1.5">
              Card or Voucher Code
            </label>
            <Input
              id="balance-card-code"
              placeholder="e.g. STEM-GOLD-2026"
              value={code}
              onChange={(e) => {
                setCode(e.target.value.toUpperCase());
                if (error) setError(null);
              }}
              className="font-mono text-sm"
              aria-invalid={!!error}
            />
          </div>

          <div>
            <label htmlFor="balance-card-pin" className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1.5">
              PIN (Optional)
            </label>
            <Input
              id="balance-card-pin"
              placeholder="4 digits"
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="font-mono text-sm"
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full sm:w-auto h-12">
            {loading ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}
            Check Balance
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-on-surface-variant">
          <span>Try a test card:</span>
          <button
            type="button"
            onClick={() => handleDemoClick("STEM-GOLD-2026")}
            className="rounded-full bg-surface-container px-2.5 py-1 font-mono text-[11px] hover:bg-primary/20 hover:text-primary transition-colors focus-visible:ring-2 focus-visible:ring-primary outline-none"
          >
            STEM-GOLD-2026 ($75)
          </button>
          <button
            type="button"
            onClick={() => handleDemoClick("STEM-ROSE-8819")}
            className="rounded-full bg-surface-container px-2.5 py-1 font-mono text-[11px] hover:bg-primary/20 hover:text-primary transition-colors focus-visible:ring-2 focus-visible:ring-primary outline-none"
          >
            STEM-ROSE-8819 ($120)
          </button>
        </div>
      </form>

      {error && (
        <div role="alert" className="mt-4 flex items-start gap-2.5 rounded-xl border border-error/30 bg-error-container/20 p-3 text-sm text-error">
          <XCircle className="size-4 shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {result && (
        <div role="region" aria-live="polite" className="mt-6 rounded-xl border border-primary/30 bg-primary/5 p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-primary" />
                <span className="font-mono text-xs font-semibold text-on-surface">{result.code}</span>
                <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-semibold text-on-primary-container">Active</span>
              </div>
              <p className="text-xs text-on-surface-variant">Ready to use at checkout anytime. Card balance never expires.</p>
            </div>
            <div className="text-right sm:border-l sm:border-outline-variant/30 sm:pl-6">
              <span className="text-[10px] uppercase tracking-wider text-on-surface-variant block">Available Balance</span>
              <span className="font-serif text-3xl font-bold text-primary">${result.balance.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

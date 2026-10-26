"use client";

import { Check, Loader2, Send } from "lucide-react";
import { useState, type FormEvent, type ReactNode } from "react";

export function QuickContactForm(): ReactNode {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          message: "Tashrifchi pastki 'Quick Connect' formasi orqali email qoldirdi.",
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Xatolik yuz berdi");
      }

      setStatus("success");
      setEmail("");
    } catch (err: unknown) {
      setStatus("error");
      setErrorMsg(
        err instanceof Error ? err.message : "Xatolik yuz berdi",
      );
    }
  };

  if (status === "success") {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-2.5 text-sm text-emerald-600 dark:text-emerald-400">
        <Check className="h-4 w-4" />
        <span>Rahmat! Emailingiz qabul qilindi, tez orada bog&apos;lanaman.</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="relative flex w-full max-w-md flex-col gap-2">
      <div className="relative flex w-full items-center">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Emailingizni qoldiring (masalan: ism@kompaniya.uz)"
          className="w-full rounded-xl border border-foreground/12 bg-background/60 py-2.5 pr-28 pl-3.5 text-xs sm:text-sm text-foreground placeholder:text-foreground/35 backdrop-blur-sm transition-colors focus:border-foreground/35 focus:outline-none"
        />
        <button
          type="submit"
          disabled={status === "loading" || !email.trim()}
          className="absolute right-1.5 inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-foreground px-3 py-1.5 text-xs font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {status === "loading" ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <>
              <Send className="h-3 w-3" />
              <span>Yuborish</span>
            </>
          )}
        </button>
      </div>
      {status === "error" && (
        <span className="text-xs text-red-500 dark:text-red-400">{errorMsg}</span>
      )}
    </form>
  );
}

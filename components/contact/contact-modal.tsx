"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check, Copy, Loader2, Mail, Send, X } from "lucide-react";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { useContact } from "./contact-context";

const EMAIL = "farrukh.front.dev@gmail.com";
const EASE = [0.22, 1, 0.36, 1] as const;

export function ContactModal(): ReactNode {
  const { isOpen, closeContact } = useContact();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [copied, setCopied] = useState(false);

  // ESC orqali yopish
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        closeContact();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeContact]);

  // Modal ochilganda scrollni to'xtatish
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    } else {
      document.body.style.overflow = "";
      const timer = setTimeout(() => {
        setStatus("idle");
        setErrorMessage("");
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Xatolik yuz berdi");
      }

      setStatus("success");
      setName("");
      setEmail("");
      setMessage("");
      setTimeout(() => {
        closeContact();
      }, 2500);
    } catch (err: unknown) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Xabar yuborishda xatolik yuz berdi.",
      );
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeContact}
            className="fixed inset-0 bg-background/80 backdrop-blur-md"
            aria-hidden="true"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-foreground/10 bg-background p-6 shadow-2xl sm:p-8"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={closeContact}
              className="absolute top-5 right-5 inline-flex h-9 w-9 items-center justify-center rounded-xl border border-foreground/8 text-foreground/60 transition-colors hover:bg-foreground/5 hover:text-foreground"
              aria-label="Yopish"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Header */}
            <div className="mb-6">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-foreground/10 bg-foreground/5 px-3 py-1 text-xs font-medium text-foreground/80">
                <Mail className="h-3.5 w-3.5" /> Aloqaga chiqish
              </span>
              <h3 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Keling, birga ishlaymiz!
              </h3>
              <p className="mt-1.5 text-sm text-foreground/65">
                Loyihangiz bormi yoki shunchaki fikr almashmoqchimisiz? Ma&apos;lumotingizni qoldiring, xabar to&apos;g&apos;ridan-to&apos;g&apos;ri Telegramimga yetib boradi.
              </p>
            </div>

            {/* Content or Success View */}
            {status === "success" ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-8 text-center"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20">
                  <Check className="h-7 w-7" strokeWidth={2.5} />
                </div>
                <h4 className="mt-4 text-xl font-medium text-foreground">
                  Xabaringiz yetkazildi!
                </h4>
                <p className="mt-1 max-w-[28ch] text-sm text-foreground/65">
                  Telegram botimga xabar keldi. Tez orada siz bilan bog&apos;lanaman 🚀
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="mb-1.5 block text-xs font-medium text-foreground/75"
                  >
                    Ismingiz yoki Kompaniya (ixtiyoriy)
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Masalan: Sardor yoki Tech Corp"
                    className="w-full rounded-xl border border-foreground/10 bg-foreground/[0.02] px-4 py-2.5 text-sm text-foreground placeholder:text-foreground/35 focus:border-foreground/30 focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-email"
                    className="mb-1.5 block text-xs font-medium text-foreground/75"
                  >
                    Email manzilingiz <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ismingiz@gmail.com"
                    className="w-full rounded-xl border border-foreground/10 bg-foreground/[0.02] px-4 py-2.5 text-sm text-foreground placeholder:text-foreground/35 focus:border-foreground/30 focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-message"
                    className="mb-1.5 block text-xs font-medium text-foreground/75"
                  >
                    Xabaringiz yoki taklifingiz (ixtiyoriy)
                  </label>
                  <textarea
                    id="contact-message"
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Qanday loyiha yoki savol haqida gaplashamiz?"
                    className="w-full resize-none rounded-xl border border-foreground/10 bg-foreground/[0.02] px-4 py-2.5 text-sm text-foreground placeholder:text-foreground/35 focus:border-foreground/30 focus:outline-none"
                  />
                </div>

                {status === "error" && (
                  <p className="text-xs text-red-500 dark:text-red-400">
                    {errorMessage}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "loading" || !email.trim()}
                  className="mt-1 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-foreground px-5 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Yuborilmoqda...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Xabarni Yuborish
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Direct copy footer */}
            <div className="mt-6 border-t border-foreground/8 pt-4">
              <div className="flex items-center justify-between text-xs text-foreground/60">
                <span>Yoki to&apos;g&apos;ridan-to&apos;g&apos;ri email:</span>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="inline-flex items-center gap-1.5 font-medium text-foreground hover:underline"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                      Nusxalandi!
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      {EMAIL}
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import toast from "react-hot-toast";

const STORAGE_KEY = "nails-promo-popup-dismissed";
const SUPPRESSED_PREFIXES = ["/cart", "/checkout", "/gift-cards/success", "/account/login", "/account/signup"];

export default function PromoPopup() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const suppressed = SUPPRESSED_PREFIXES.some((p) => pathname.startsWith(p));

  useEffect(() => {
    if (typeof window === "undefined" || suppressed) return;
    if (localStorage.getItem(STORAGE_KEY)) return;
    const timer = setTimeout(() => setVisible(true), 2500);
    return () => clearTimeout(timer);
  }, [suppressed]);

  function dismiss() {
    setVisible(false);
    localStorage.setItem(STORAGE_KEY, "1");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      toast.success("Welcome! Your code is WELCOME15.");
    } catch {
      toast.success("Here's your code: WELCOME15");
    } finally {
      setSubmitting(false);
      dismiss();
    }
  }

  if (!visible || suppressed) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/50" onClick={dismiss} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        <button
          onClick={dismiss}
          className="absolute right-3 top-3 text-brand-400 hover:text-brand-700 z-10"
          aria-label="Close"
        >
          <X size={20} />
        </button>
        <div className="bg-gradient-to-br from-brand-100 to-brand-200 px-8 pt-10 pb-6 text-center">
          <p className="text-xs tracking-[0.2em] font-semibold text-brand-600 uppercase mb-2">
            New here?
          </p>
          <h3 className="font-display text-3xl text-brand-900">Get 15% Off</h3>
          <p className="text-brand-700 mt-2 text-sm">
            Your first order, plus early access to new drops. And don&apos;t forget —{" "}
            <span className="font-semibold">buy 3 sets, get 1 free</span> with code{" "}
            <span className="font-semibold">BUY3GET1</span>.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-3">
          <input
            required
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-brand-200 rounded-full px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
          />
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-brand-700 hover:bg-brand-800 text-white rounded-full py-3 text-sm font-semibold transition-colors disabled:opacity-60"
          >
            {submitting ? "Submitting…" : "Unlock 15% Off"}
          </button>
          <button type="button" onClick={dismiss} className="text-xs text-brand-400 hover:text-brand-600 mt-1">
            No thanks, I&apos;ll pay full price
          </button>
        </form>
      </div>
    </div>
  );
}

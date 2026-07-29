"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function NewsletterForm({ dark = false }: { dark?: boolean }) {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      toast.success("You're subscribed! Watch for 15% off in your inbox.");
      setEmail("");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm gap-2">
      <input
        required
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email address"
        className={`flex-1 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 ${
          dark ? "bg-white/10 text-white placeholder:text-white/60 border border-white/20" : "border border-brand-200"
        }`}
      />
      <button
        type="submit"
        disabled={submitting}
        className="rounded-full bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 text-sm font-semibold transition-colors disabled:opacity-60"
      >
        Join
      </button>
    </form>
  );
}

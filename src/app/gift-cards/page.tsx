"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { Gift } from "lucide-react";

const AMOUNTS = [25, 50, 75, 100, 150];

export default function GiftCardsPage() {
  const { data: session } = useSession();
  const [amount, setAmount] = useState(50);
  const [customAmount, setCustomAmount] = useState("");
  const [email, setEmail] = useState(session?.user?.email ?? "");
  const [senderName, setSenderName] = useState(session?.user?.name ?? "");
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const finalAmount = customAmount ? Number(customAmount) : amount;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!finalAmount || finalAmount < 10) {
      toast.error("Gift cards start at $10.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/gift-cards/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: finalAmount,
          email,
          senderName,
          recipientName,
          recipientEmail,
          message,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong");
      window.location.href = data.url;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 grid md:grid-cols-2 gap-12">
      <div>
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-brand-200 to-brand-400 flex items-center justify-center">
          <div className="text-center text-white">
            <Gift size={44} className="mx-auto mb-3" />
            <p className="text-xs uppercase tracking-widest">Blush &amp; Bloom Gift Card</p>
            <p className="font-display text-5xl mt-2">${finalAmount || 0}</p>
          </div>
        </div>
        <h1 className="font-display text-3xl text-brand-900 mt-6">Gift Cards</h1>
        <p className="text-brand-600 mt-2 text-sm leading-relaxed">
          Give the gift of salon-quality nails. Delivered instantly by code — redeemable on any set,
          any size, any shape. Never expires.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <p className="text-sm font-medium text-brand-900 mb-2">Choose an amount</p>
          <div className="flex flex-wrap gap-2">
            {AMOUNTS.map((a) => (
              <button
                type="button"
                key={a}
                onClick={() => {
                  setAmount(a);
                  setCustomAmount("");
                }}
                className={`px-4 py-2 rounded-full text-sm border transition-colors ${
                  amount === a && !customAmount
                    ? "bg-brand-700 text-white border-brand-700"
                    : "border-brand-200 text-brand-700 hover:border-brand-400"
                }`}
              >
                ${a}
              </button>
            ))}
            <input
              type="number"
              min={10}
              max={500}
              placeholder="Custom"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              className="w-24 px-3 py-2 rounded-full text-sm border border-brand-200"
            />
          </div>
        </div>

        <input
          required
          type="email"
          placeholder="Your email (for receipt)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-brand-200 rounded-lg px-4 py-2.5 text-sm"
        />
        <input
          required
          placeholder="Your name"
          value={senderName}
          onChange={(e) => setSenderName(e.target.value)}
          className="w-full border border-brand-200 rounded-lg px-4 py-2.5 text-sm"
        />
        <div className="grid sm:grid-cols-2 gap-3">
          <input
            placeholder="Recipient name (optional)"
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
            className="border border-brand-200 rounded-lg px-4 py-2.5 text-sm"
          />
          <input
            type="email"
            placeholder="Recipient email (optional)"
            value={recipientEmail}
            onChange={(e) => setRecipientEmail(e.target.value)}
            className="border border-brand-200 rounded-lg px-4 py-2.5 text-sm"
          />
        </div>
        <textarea
          placeholder="Add a personal message (optional)"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          className="w-full border border-brand-200 rounded-lg px-4 py-2.5 text-sm"
        />

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-brand-700 hover:bg-brand-800 text-white py-3.5 text-sm font-semibold transition-colors disabled:opacity-60"
        >
          {submitting ? "Processing…" : `Buy Gift Card — $${finalAmount || 0}`}
        </button>
      </form>
    </div>
  );
}

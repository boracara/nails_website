"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { Sparkles } from "lucide-react";
import { NAIL_SHAPES } from "@/data/products";
import { SIZE_LABELS } from "@/data/size-chart";

export default function CustomDesignsPage() {
  const { data: session } = useSession();
  const [name, setName] = useState(session?.user?.name ?? "");
  const [email, setEmail] = useState(session?.user?.email ?? "");
  const [shape, setShape] = useState("");
  const [size, setSize] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/custom-design", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, shape, size, description }),
      });
      if (!res.ok) throw new Error();
      setSubmitted(true);
      toast.success("Request sent! We'll be in touch within 1-2 business days.");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-14">
      <div className="text-center mb-10">
        <Sparkles size={36} className="mx-auto text-brand-600" />
        <h1 className="font-display text-3xl text-brand-900 mt-3">Custom Nail Designs</h1>
        <p className="text-brand-600 mt-2 text-sm">
          Have a design in mind, a wedding theme, or measurements between sizes? Tell us the details
          and our nail artists will send you a custom quote.
        </p>
      </div>

      {submitted ? (
        <div className="text-center bg-brand-50 rounded-2xl p-10">
          <p className="font-display text-2xl text-brand-900 mb-2">Request received!</p>
          <p className="text-brand-600 text-sm">
            We&apos;ll follow up at <span className="font-medium">{email}</span> with a custom quote.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <input
              required
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-brand-200 rounded-lg px-4 py-2.5 text-sm"
            />
            <input
              required
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-brand-200 rounded-lg px-4 py-2.5 text-sm"
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <select
              value={shape}
              onChange={(e) => setShape(e.target.value)}
              className="border border-brand-200 rounded-lg px-4 py-2.5 text-sm bg-white"
            >
              <option value="">Preferred shape (optional)</option>
              {NAIL_SHAPES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <select
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="border border-brand-200 rounded-lg px-4 py-2.5 text-sm bg-white"
            >
              <option value="">Closest size (optional)</option>
              {SIZE_LABELS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <textarea
            required
            placeholder="Describe your dream design — colors, inspiration photos you'll email us, occasion, or exact nail measurements in mm..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
            className="w-full border border-brand-200 rounded-lg px-4 py-2.5 text-sm"
          />
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-brand-700 hover:bg-brand-800 text-white py-3.5 text-sm font-semibold transition-colors disabled:opacity-60"
          >
            {submitting ? "Sending…" : "Submit Request"}
          </button>
        </form>
      )}
    </div>
  );
}

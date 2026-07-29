"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import toast from "react-hot-toast";
import StarRating from "./StarRating";

export type ReviewData = {
  id: string;
  name: string;
  rating: number;
  title: string;
  body: string;
  verified: boolean;
  createdAt: string | Date;
};

export default function ReviewsSection({
  productId,
  reviews,
  avgRating,
}: {
  productId: string;
  reviews: ReviewData[];
  avgRating: number;
}) {
  const router = useRouter();
  const [formOpen, setFormOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [rating, setRating] = useState(5);
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, rating, name, title, body }),
      });
      if (!res.ok) throw new Error();
      toast.success("Thanks for your review!");
      setFormOpen(false);
      setName("");
      setTitle("");
      setBody("");
      setRating(5);
      router.refresh();
    } catch {
      toast.error("Couldn't submit your review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mt-16 border-t border-brand-100 pt-10">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-display text-2xl text-brand-900">Customer Reviews</h2>
          <div className="flex items-center gap-2 mt-1">
            <StarRating rating={avgRating} />
            <span className="text-sm text-brand-500">
              {avgRating.toFixed(1)} out of 5 ({reviews.length} review{reviews.length === 1 ? "" : "s"})
            </span>
          </div>
        </div>
        <button
          onClick={() => setFormOpen((v) => !v)}
          className="rounded-full border border-brand-300 px-5 py-2.5 text-sm font-semibold text-brand-700 hover:bg-brand-50 transition-colors"
        >
          Write a review
        </button>
      </div>

      {formOpen && (
        <form onSubmit={handleSubmit} className="bg-brand-50 rounded-2xl p-5 mb-8 space-y-3">
          <div>
            <label className="block text-xs font-medium text-brand-600 mb-1">Your rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button type="button" key={n} onClick={() => setRating(n)} aria-label={`${n} stars`}>
                  <Star size={22} className={n <= rating ? "fill-brand-500 text-brand-500" : "text-brand-200"} />
                </button>
              ))}
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <input
              required
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-brand-200 rounded-lg px-3 py-2 text-sm bg-white"
            />
            <input
              required
              placeholder="Review title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border border-brand-200 rounded-lg px-3 py-2 text-sm bg-white"
            />
          </div>
          <textarea
            required
            placeholder="Tell us what you think..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={4}
            className="w-full border border-brand-200 rounded-lg px-3 py-2 text-sm bg-white"
          />
          <button
            type="submit"
            disabled={submitting}
            className="rounded-full bg-brand-700 hover:bg-brand-800 text-white px-6 py-2.5 text-sm font-semibold transition-colors disabled:opacity-60"
          >
            {submitting ? "Submitting…" : "Submit Review"}
          </button>
        </form>
      )}

      <div className="space-y-6">
        {reviews.length === 0 && <p className="text-brand-400 text-sm">No reviews yet — be the first!</p>}
        {reviews.map((r) => (
          <div key={r.id} className="border-b border-brand-50 pb-6">
            <div className="flex items-center gap-2 mb-1">
              <StarRating rating={r.rating} size={13} />
              {r.verified && (
                <span className="text-[11px] bg-brand-100 text-brand-600 px-2 py-0.5 rounded-full font-medium">
                  Verified Purchase
                </span>
              )}
            </div>
            <p className="font-semibold text-sm text-brand-900">{r.title}</p>
            <p className="text-sm text-brand-600 mt-1">{r.body}</p>
            <p className="text-xs text-brand-300 mt-2">
              {r.name} · {new Date(r.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

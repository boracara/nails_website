"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Something went wrong.");
      setSubmitting(false);
      return;
    }

    const signInRes = await signIn("credentials", { email, password, redirect: false });
    setSubmitting(false);

    if (signInRes?.error) {
      toast.success("Account created! Please sign in.");
      router.push("/account/login");
      return;
    }

    toast.success("Welcome to Blush & Bloom!");
    router.push("/account");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="font-display text-3xl text-brand-900 text-center">Create Account</h1>
      <p className="text-brand-500 text-sm text-center mt-2">
        Join for 15% off your first order, order tracking, and a saved wishlist.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <input
          required
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-brand-200 rounded-full px-4 py-3 text-sm"
        />
        <input
          required
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-brand-200 rounded-full px-4 py-3 text-sm"
        />
        <input
          required
          type="password"
          placeholder="Password (min. 8 characters)"
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-brand-200 rounded-full px-4 py-3 text-sm"
        />
        {error && <p className="text-sm text-red-600 text-center">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-brand-700 hover:bg-brand-800 text-white py-3 text-sm font-semibold transition-colors disabled:opacity-60"
        >
          {submitting ? "Creating account…" : "Create Account"}
        </button>
      </form>

      <p className="text-center text-sm text-brand-500 mt-6">
        Already have an account?{" "}
        <Link href="/account/login" className="text-brand-700 font-semibold hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}

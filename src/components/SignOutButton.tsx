"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="rounded-full border border-brand-300 px-5 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-50 transition-colors"
    >
      Sign Out
    </button>
  );
}

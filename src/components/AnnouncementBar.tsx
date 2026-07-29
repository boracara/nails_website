"use client";

import { useEffect, useState } from "react";

const MESSAGES = [
  "15% OFF YOUR FIRST ORDER — CODE WELCOME15",
  "BUY 3 SETS, GET 1 FREE — CODE BUY3GET1",
  "FREE US SHIPPING ON ORDERS $35+",
];

export default function AnnouncementBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % MESSAGES.length), 3800);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="bg-brand-900 text-cream-50 text-xs sm:text-sm font-medium tracking-wide">
      <div className="mx-auto max-w-7xl px-4 h-9 flex items-center justify-center overflow-hidden">
        <span key={index} className="animate-[fadeIn_0.4s_ease]">
          {MESSAGES[index]}
        </span>
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

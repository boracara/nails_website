const METHODS: { label: string; bg: string; text: string }[] = [
  { label: "VISA", bg: "#1a1f71", text: "#fff" },
  { label: "Mastercard", bg: "#000000", text: "#fff" },
  { label: "AMEX", bg: "#006fcf", text: "#fff" },
  { label: "Discover", bg: "#ff6000", text: "#fff" },
  { label: "PayPal", bg: "#003087", text: "#fff" },
  { label: "Apple Pay", bg: "#000000", text: "#fff" },
  { label: "G Pay", bg: "#4285f4", text: "#fff" },
];

export default function PaymentIcons({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {METHODS.map((m) => (
        <span
          key={m.label}
          style={{ backgroundColor: m.bg, color: m.text }}
          className="text-[10px] font-semibold tracking-wide px-2.5 py-1.5 rounded-md leading-none"
        >
          {m.label}
        </span>
      ))}
    </div>
  );
}

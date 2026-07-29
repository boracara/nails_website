"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import toast from "react-hot-toast";
import { useCartStore, cartSubtotal, evaluatePromo } from "@/lib/cart-store";
import { shippingCost } from "@/lib/pricing";
import PaymentIcons from "@/components/PaymentIcons";
import PayPalCheckoutButton from "@/components/PayPalCheckoutButton";

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD",
  "MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC",
  "SD","TN","TX","UT","VT","VA","WA","WV","WI","WY",
];

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const items = useCartStore((s) => s.items);
  const promoCode = useCartStore((s) => s.promoCode);

  const [email, setEmail] = useState(session?.user?.email ?? "");
  const [name, setName] = useState(session?.user?.name ?? "");
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [phone, setPhone] = useState("");
  const [payWith, setPayWith] = useState<"card" | "paypal">("card");
  const [submitting, setSubmitting] = useState(false);

  const subtotal = cartSubtotal(items);
  const promo = evaluatePromo(promoCode, items);
  const discount = promo.valid ? promo.discount : 0;
  const afterDiscount = Math.max(0, subtotal - discount);
  const shipping = shippingCost(afterDiscount);
  const total = Math.round((afterDiscount + shipping) * 100) / 100;

  const shippingInfo = { name, line1, line2, city, state, zip, phone };
  const formValid = email && name && line1 && city && state.length === 2 && zip;

  async function handleStripeCheckout(e: React.FormEvent) {
    e.preventDefault();
    if (!formValid) {
      toast.error("Please complete all required shipping fields.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, items, promoCode, shipping: shippingInfo }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Checkout failed");
      if (data.url?.startsWith("http")) {
        window.location.href = data.url;
      } else {
        router.push(data.url);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <h1 className="font-display text-3xl text-brand-900 mb-3">Nothing to check out</h1>
        <p className="text-brand-500">Your bag is empty — add a set before checking out.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="font-display text-3xl text-brand-900 mb-8">Checkout</h1>
      <div className="grid lg:grid-cols-3 gap-10">
        <form onSubmit={handleStripeCheckout} className="lg:col-span-2 space-y-8">
          <div>
            <h2 className="font-semibold text-brand-900 mb-3">Contact</h2>
            <input
              required
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-brand-200 rounded-lg px-4 py-2.5 text-sm"
            />
          </div>

          <div>
            <h2 className="font-semibold text-brand-900 mb-3">Shipping Address</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              <input
                required
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="sm:col-span-2 border border-brand-200 rounded-lg px-4 py-2.5 text-sm"
              />
              <input
                required
                placeholder="Address line 1"
                value={line1}
                onChange={(e) => setLine1(e.target.value)}
                className="sm:col-span-2 border border-brand-200 rounded-lg px-4 py-2.5 text-sm"
              />
              <input
                placeholder="Address line 2 (optional)"
                value={line2}
                onChange={(e) => setLine2(e.target.value)}
                className="sm:col-span-2 border border-brand-200 rounded-lg px-4 py-2.5 text-sm"
              />
              <input
                required
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="border border-brand-200 rounded-lg px-4 py-2.5 text-sm"
              />
              <select
                required
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="border border-brand-200 rounded-lg px-4 py-2.5 text-sm bg-white"
              >
                <option value="">State</option>
                {US_STATES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <input
                required
                placeholder="ZIP code"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                className="border border-brand-200 rounded-lg px-4 py-2.5 text-sm"
              />
              <input
                placeholder="Phone (optional)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="border border-brand-200 rounded-lg px-4 py-2.5 text-sm"
              />
              <p className="sm:col-span-2 text-xs text-brand-400">Shipping within the United States only.</p>
            </div>
          </div>

          <div>
            <h2 className="font-semibold text-brand-900 mb-3">Payment</h2>
            <div className="flex gap-2 mb-4">
              <button
                type="button"
                onClick={() => setPayWith("card")}
                className={`flex-1 rounded-lg border py-2.5 text-sm font-medium transition-colors ${
                  payWith === "card" ? "border-brand-600 bg-brand-50 text-brand-800" : "border-brand-200 text-brand-600"
                }`}
              >
                Card / Apple Pay / Google Pay
              </button>
              <button
                type="button"
                onClick={() => setPayWith("paypal")}
                className={`flex-1 rounded-lg border py-2.5 text-sm font-medium transition-colors ${
                  payWith === "paypal" ? "border-brand-600 bg-brand-50 text-brand-800" : "border-brand-200 text-brand-600"
                }`}
              >
                PayPal
              </button>
            </div>
            <PaymentIcons className="mb-4" />

            {payWith === "card" ? (
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-full bg-brand-700 hover:bg-brand-800 text-white py-3.5 text-sm font-semibold transition-colors disabled:opacity-60"
              >
                {submitting ? "Redirecting to secure checkout…" : `Pay $${total.toFixed(2)}`}
              </button>
            ) : (
              <div>
                {!formValid && (
                  <p className="text-xs text-brand-500 mb-2">Complete your shipping address above to enable PayPal.</p>
                )}
                <PayPalCheckoutButton
                  total={total}
                  email={email}
                  items={items}
                  promoCode={promoCode}
                  shipping={shippingInfo}
                  disabled={!formValid}
                />
              </div>
            )}
          </div>
        </form>

        <div className="border border-brand-100 rounded-2xl p-6 h-fit">
          <h2 className="font-display text-xl text-brand-900 mb-4">Order Summary</h2>
          <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
            {items.map((i) => (
              <div key={`${i.productId}-${i.shape}-${i.size}`} className="flex gap-3">
                <div className="relative h-14 w-14 shrink-0 rounded-lg overflow-hidden bg-brand-50">
                  <Image src={i.image} alt={i.name} fill className="object-cover" />
                  <span className="absolute -top-1.5 -right-1.5 bg-brand-700 text-white text-[10px] h-5 w-5 rounded-full flex items-center justify-center">
                    {i.qty}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-brand-900 line-clamp-1">{i.name}</p>
                  <p className="text-xs text-brand-400">
                    {i.shape} · {i.size}
                  </p>
                </div>
                <span className="text-sm text-brand-700">${(i.price * i.qty).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="space-y-2 text-sm border-t border-brand-100 pt-4">
            <div className="flex justify-between text-brand-600">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            {promo.valid && (
              <div className="flex justify-between text-brand-600">
                <span>{promo.label}</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-brand-600">
              <span>Shipping</span>
              <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between font-semibold text-brand-900 text-base border-t border-brand-100 pt-2">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, X } from "lucide-react";
import { useCartStore, cartSubtotal, evaluatePromo } from "@/lib/cart-store";
import PaymentIcons from "@/components/PaymentIcons";

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const updateQty = useCartStore((s) => s.updateQty);
  const removeItem = useCartStore((s) => s.removeItem);
  const promoCode = useCartStore((s) => s.promoCode);
  const applyPromo = useCartStore((s) => s.applyPromo);
  const [codeInput, setCodeInput] = useState(promoCode ?? "");
  const [promoMsg, setPromoMsg] = useState("");

  const subtotal = cartSubtotal(items);
  const promo = evaluatePromo(promoCode, items);
  const total = Math.max(0, subtotal - promo.discount);

  function handleApplyPromo(e: React.FormEvent) {
    e.preventDefault();
    const result = evaluatePromo(codeInput, items);
    if (result.valid) {
      applyPromo(codeInput.trim().toUpperCase());
      setPromoMsg(`Applied: ${result.label}!`);
    } else {
      applyPromo(null);
      setPromoMsg(result.message ?? "Invalid promo code.");
    }
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl text-brand-900 mb-3">Your bag is empty</h1>
        <p className="text-brand-500 mb-6">Explore our press-on collections and find your next set.</p>
        <Link href="/shop" className="rounded-full bg-brand-700 hover:bg-brand-800 text-white px-7 py-3 text-sm font-semibold">
          Shop All Sets
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="font-display text-3xl text-brand-900 mb-8">Your Bag</h1>
      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-5">
          {items.map((i) => (
            <div key={`${i.productId}-${i.shape}-${i.size}`} className="flex gap-4 border-b border-brand-100 pb-5">
              <div className="relative h-24 w-24 shrink-0 rounded-xl overflow-hidden bg-brand-50">
                <Image src={i.image} alt={i.name} fill className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between gap-2">
                  <Link href={`/products/${i.slug}`} className="font-medium text-brand-900 hover:text-brand-600">
                    {i.name}
                  </Link>
                  <button onClick={() => removeItem(i.productId, i.shape, i.size)} className="text-brand-300 hover:text-brand-600" aria-label="Remove">
                    <X size={18} />
                  </button>
                </div>
                <p className="text-sm text-brand-400 mt-1">
                  {i.shape} · Size {i.size}
                </p>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border border-brand-200 rounded-full">
                    <button className="p-2" onClick={() => updateQty(i.productId, i.shape, i.size, i.qty - 1)} aria-label="Decrease quantity">
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center text-sm">{i.qty}</span>
                    <button className="p-2" onClick={() => updateQty(i.productId, i.shape, i.size, i.qty + 1)} aria-label="Increase quantity">
                      <Plus size={14} />
                    </button>
                  </div>
                  <span className="font-semibold text-brand-900">${(i.price * i.qty).toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="border border-brand-100 rounded-2xl p-6 h-fit">
          <h2 className="font-display text-xl text-brand-900 mb-4">Order Summary</h2>

          <form onSubmit={handleApplyPromo} className="flex gap-2 mb-4">
            <input
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value)}
              placeholder="Promo code"
              className="flex-1 border border-brand-200 rounded-full px-4 py-2 text-sm"
            />
            <button type="submit" className="rounded-full border border-brand-300 px-4 py-2 text-sm font-semibold hover:bg-brand-50">
              Apply
            </button>
          </form>
          {promoMsg && <p className="text-xs text-brand-500 mb-4">{promoMsg}</p>}
          <p className="text-xs text-brand-400 mb-4">
            Try <span className="font-semibold">WELCOME15</span> for 15% off or{" "}
            <span className="font-semibold">BUY3GET1</span> when you have 4+ sets in your bag.
          </p>

          <div className="space-y-2 text-sm border-t border-brand-100 pt-4">
            <div className="flex justify-between text-brand-600">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            {promo.valid && (
              <div className="flex justify-between text-brand-600">
                <span>{promo.label}</span>
                <span>-${promo.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-brand-600">
              <span>Shipping</span>
              <span>{total >= 35 ? "Free" : "$4.99"}</span>
            </div>
            <div className="flex justify-between font-semibold text-brand-900 text-base border-t border-brand-100 pt-2">
              <span>Total</span>
              <span>${(total + (total >= 35 ? 0 : 4.99)).toFixed(2)}</span>
            </div>
          </div>

          <Link
            href="/checkout"
            className="block text-center w-full rounded-full bg-brand-700 hover:bg-brand-800 text-white py-3 text-sm font-semibold mt-5 transition-colors"
          >
            Proceed to Checkout
          </Link>
          <div className="mt-4">
            <PaymentIcons className="justify-center" />
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, X } from "lucide-react";
import { useCartStore, cartSubtotal } from "@/lib/cart-store";

export default function CartDrawer() {
  const isOpen = useCartStore((s) => s.isOpen);
  const setOpen = useCartStore((s) => s.setOpen);
  const items = useCartStore((s) => s.items);
  const updateQty = useCartStore((s) => s.updateQty);
  const removeItem = useCartStore((s) => s.removeItem);
  const subtotal = cartSubtotal(items);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
      <div className="absolute right-0 top-0 h-full w-full sm:w-[420px] bg-white shadow-2xl flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-brand-100">
          <h2 className="font-display text-xl text-brand-900">Your Bag ({items.reduce((s, i) => s + i.qty, 0)})</h2>
          <button onClick={() => setOpen(false)} aria-label="Close cart">
            <X size={22} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {items.length === 0 && (
            <div className="text-center text-brand-400 mt-16">
              <p>Your bag is empty.</p>
              <Link
                href="/shop"
                onClick={() => setOpen(false)}
                className="inline-block mt-4 text-brand-600 underline"
              >
                Start shopping
              </Link>
            </div>
          )}
          {items.map((i) => (
            <div key={`${i.productId}-${i.shape}-${i.size}`} className="flex gap-3">
              <div className="relative h-20 w-20 shrink-0 rounded-lg overflow-hidden bg-brand-50">
                <Image src={i.image} alt={i.name} fill className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between gap-2">
                  <Link
                    href={`/products/${i.slug}`}
                    onClick={() => setOpen(false)}
                    className="text-sm font-medium text-brand-900 hover:text-brand-600 line-clamp-1"
                  >
                    {i.name}
                  </Link>
                  <button
                    onClick={() => removeItem(i.productId, i.shape, i.size)}
                    className="text-brand-300 hover:text-brand-600"
                    aria-label="Remove item"
                  >
                    <X size={16} />
                  </button>
                </div>
                <p className="text-xs text-brand-400 mt-0.5">
                  {i.shape} · Size {i.size}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center border border-brand-200 rounded-full">
                    <button
                      className="p-1.5"
                      onClick={() => updateQty(i.productId, i.shape, i.size, i.qty - 1)}
                      aria-label="Decrease quantity"
                    >
                      <Minus size={13} />
                    </button>
                    <span className="w-6 text-center text-sm">{i.qty}</span>
                    <button
                      className="p-1.5"
                      onClick={() => updateQty(i.productId, i.shape, i.size, i.qty + 1)}
                      aria-label="Increase quantity"
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                  <span className="text-sm font-semibold text-brand-900">
                    ${(i.price * i.qty).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {items.length > 0 && (
          <div className="p-5 border-t border-brand-100 space-y-3">
            <div className="flex justify-between text-sm text-brand-500">
              <span>Subtotal</span>
              <span className="font-semibold text-brand-900">${subtotal.toFixed(2)}</span>
            </div>
            <p className="text-xs text-brand-400">Shipping and discounts calculated at checkout.</p>
            <Link
              href="/cart"
              onClick={() => setOpen(false)}
              className="block text-center w-full rounded-full bg-brand-700 text-white py-3 text-sm font-semibold hover:bg-brand-800 transition-colors"
            >
              View Bag &amp; Checkout
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

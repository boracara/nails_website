"use client";

import Link from "next/link";
import Image from "next/image";
import { X } from "lucide-react";
import { useWishlistStore } from "@/lib/wishlist-store";
import { useCartStore } from "@/lib/cart-store";
import toast from "react-hot-toast";

export default function WishlistPage() {
  const items = useWishlistStore((s) => s.items);
  const remove = useWishlistStore((s) => s.remove);
  const addItem = useCartStore((s) => s.addItem);

  return (
    <div className="mx-auto max-w-4xl px-4 py-14">
      <h1 className="font-display text-3xl text-brand-900 mb-2">My Wishlist</h1>
      <p className="text-brand-500 text-sm mb-8">Saved on this device — sign in isn&apos;t required.</p>

      {items.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-brand-400">Your wishlist is empty.</p>
          <Link href="/shop" className="inline-block mt-4 text-brand-600 underline">
            Browse press-on sets
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {items.map((i) => (
            <div key={i.productId} className="flex gap-4 border border-brand-100 rounded-2xl p-4">
              <Link href={`/products/${i.slug}`} className="relative h-24 w-24 shrink-0 rounded-xl overflow-hidden bg-brand-50">
                <Image src={i.image} alt={i.name} fill className="object-cover" />
              </Link>
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between gap-2">
                    <Link href={`/products/${i.slug}`} className="font-medium text-brand-900 hover:text-brand-600 line-clamp-1">
                      {i.name}
                    </Link>
                    <button onClick={() => remove(i.productId)} className="text-brand-300 hover:text-brand-600" aria-label="Remove">
                      <X size={16} />
                    </button>
                  </div>
                  <p className="text-sm text-brand-500 mt-1">${i.price.toFixed(2)}</p>
                </div>
                <button
                  onClick={() => {
                    addItem({
                      productId: i.productId,
                      slug: i.slug,
                      name: i.name,
                      price: i.price,
                      image: i.image,
                      shape: "Short Almond",
                      size: "M",
                    });
                    toast.success("Added to bag");
                  }}
                  className="mt-2 self-start text-xs font-semibold rounded-full bg-brand-700 hover:bg-brand-800 text-white px-4 py-1.5 transition-colors"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

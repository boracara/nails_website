"use client";

import { Heart } from "lucide-react";
import { useWishlistStore } from "@/lib/wishlist-store";
import toast from "react-hot-toast";

export default function WishlistButton({
  product,
  className = "",
}: {
  product: { productId: string; slug: string; name: string; price: number; image: string };
  className?: string;
}) {
  const has = useWishlistStore((s) => s.has(product.productId));
  const toggle = useWishlistStore((s) => s.toggle);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(product);
        toast.success(has ? "Removed from wishlist" : "Added to wishlist");
      }}
      aria-label={has ? "Remove from wishlist" : "Add to wishlist"}
      className={`inline-flex items-center justify-center rounded-full bg-white/90 hover:bg-white shadow-sm transition-colors ${className}`}
    >
      <Heart size={18} className={has ? "fill-brand-600 text-brand-600" : "text-brand-700"} />
    </button>
  );
}

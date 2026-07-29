"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import toast from "react-hot-toast";
import { useCartStore } from "@/lib/cart-store";
import { SIZE_LABELS } from "@/data/size-chart";
import SizeChartModal from "./SizeChartModal";

export default function AddToCartControls({
  product,
  shapes,
}: {
  product: { id: string; slug: string; name: string; price: number; image: string };
  shapes: string[];
}) {
  const [shape, setShape] = useState(shapes[0]);
  const [size, setSize] = useState(shapes[0] === "Kids Nails" ? "One Size" : SIZE_LABELS[2]);
  const [qty, setQty] = useState(1);
  const addItem = useCartStore((s) => s.addItem);

  const sizeOptions = shape === "Kids Nails" ? ["One Size"] : SIZE_LABELS;

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-medium text-brand-900 mb-2">Nail Shape</p>
        <div className="flex flex-wrap gap-2">
          {shapes.map((s) => (
            <button
              key={s}
              onClick={() => {
                setShape(s);
                if (s === "Kids Nails") setSize("One Size");
                else if (size === "One Size") setSize(SIZE_LABELS[2]);
              }}
              className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
                shape === s
                  ? "bg-brand-700 text-white border-brand-700"
                  : "border-brand-200 text-brand-700 hover:border-brand-400"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-brand-900">Size</p>
          <SizeChartModal />
        </div>
        <div className="flex flex-wrap gap-2">
          {sizeOptions.map((s) => (
            <button
              key={s}
              onClick={() => setSize(s)}
              className={`px-4 py-1.5 rounded-full text-xs border transition-colors ${
                size === s
                  ? "bg-brand-700 text-white border-brand-700"
                  : "border-brand-200 text-brand-700 hover:border-brand-400"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center border border-brand-200 rounded-full">
          <button className="p-2.5" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">
            <Minus size={14} />
          </button>
          <span className="w-8 text-center text-sm">{qty}</span>
          <button className="p-2.5" onClick={() => setQty((q) => q + 1)} aria-label="Increase quantity">
            <Plus size={14} />
          </button>
        </div>
        <button
          onClick={() => {
            addItem(
              {
                productId: product.id,
                slug: product.slug,
                name: product.name,
                price: product.price,
                image: product.image,
                shape,
                size,
              },
              qty
            );
            toast.success(`Added ${product.name} to your bag`);
          }}
          className="flex-1 rounded-full bg-brand-700 hover:bg-brand-800 text-white py-3 text-sm font-semibold transition-colors"
        >
          Add to Cart — ${(product.price * qty).toFixed(2)}
        </button>
      </div>
    </div>
  );
}

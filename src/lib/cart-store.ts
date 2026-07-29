import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/lib/pricing";

export type { CartItem };
export { cartSubtotal, cartCount, evaluatePromo } from "@/lib/pricing";
export type { PromoResult } from "@/lib/pricing";

type CartState = {
  items: CartItem[];
  isOpen: boolean;
  promoCode: string | null;
  addItem: (item: Omit<CartItem, "qty">, qty?: number) => void;
  removeItem: (productId: string, shape: string, size: string) => void;
  updateQty: (productId: string, shape: string, size: string, qty: number) => void;
  clear: () => void;
  setOpen: (open: boolean) => void;
  applyPromo: (code: string | null) => void;
};

function lineKey(i: { productId: string; shape: string; size: string }) {
  return `${i.productId}__${i.shape}__${i.size}`;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      promoCode: null,
      addItem: (item, qty = 1) =>
        set((state) => {
          const key = lineKey(item);
          const existing = state.items.find((i) => lineKey(i) === key);
          if (existing) {
            return {
              items: state.items.map((i) =>
                lineKey(i) === key ? { ...i, qty: i.qty + qty } : i
              ),
              isOpen: true,
            };
          }
          return { items: [...state.items, { ...item, qty }], isOpen: true };
        }),
      removeItem: (productId, shape, size) =>
        set((state) => ({
          items: state.items.filter((i) => lineKey(i) !== lineKey({ productId, shape, size })),
        })),
      updateQty: (productId, shape, size, qty) =>
        set((state) => ({
          items: state.items
            .map((i) =>
              lineKey(i) === lineKey({ productId, shape, size }) ? { ...i, qty } : i
            )
            .filter((i) => i.qty > 0),
        })),
      clear: () => set({ items: [], promoCode: null }),
      setOpen: (open) => set({ isOpen: open }),
      applyPromo: (code) => set({ promoCode: code }),
    }),
    {
      name: "nails-cart",
      partialize: (state) => ({ items: state.items, promoCode: state.promoCode }),
    }
  )
);

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  shape: string;
  size: string;
  qty: number;
};

export function cartSubtotal(items: CartItem[]) {
  return items.reduce((sum, i) => sum + i.price * i.qty, 0);
}

export function cartCount(items: CartItem[]) {
  return items.reduce((sum, i) => sum + i.qty, 0);
}

export type PromoResult = {
  valid: boolean;
  label?: string;
  discount: number;
  freeItemQty?: number;
  message?: string;
};

export function evaluatePromo(code: string | null | undefined, items: CartItem[]): PromoResult {
  const subtotal = cartSubtotal(items);
  if (!code) return { valid: false, discount: 0 };

  const normalized = code.trim().toUpperCase();

  if (normalized === "WELCOME15") {
    return {
      valid: true,
      label: "15% off first order",
      discount: Math.round(subtotal * 0.15 * 100) / 100,
    };
  }

  if (normalized === "BUY3GET1") {
    const totalQty = cartCount(items);
    if (totalQty < 4) {
      return {
        valid: false,
        discount: 0,
        message: "Add at least 4 sets to your cart to unlock Buy 3 Get 1 Free.",
      };
    }
    const unitPrices: number[] = [];
    items.forEach((i) => {
      for (let n = 0; n < i.qty; n++) unitPrices.push(i.price);
    });
    unitPrices.sort((a, b) => a - b);
    const freeCount = Math.floor(unitPrices.length / 4);
    const discount = unitPrices.slice(0, freeCount).reduce((s, p) => s + p, 0);
    return {
      valid: true,
      label: "Buy 3 Get 1 Free",
      discount: Math.round(discount * 100) / 100,
      freeItemQty: freeCount,
    };
  }

  return { valid: false, discount: 0, message: "That promo code isn't valid." };
}

export const FREE_SHIPPING_THRESHOLD = 35;
export const FLAT_SHIPPING = 4.99;

export function shippingCost(subtotalAfterDiscount: number) {
  return subtotalAfterDiscount >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING;
}

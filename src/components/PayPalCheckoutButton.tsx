"use client";

import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import type { CartItem } from "@/lib/pricing";
import { useCartStore } from "@/lib/cart-store";

type ShippingInfo = {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
  phone?: string;
};

export default function PayPalCheckoutButton({
  total,
  email,
  items,
  promoCode,
  shipping,
  disabled,
}: {
  total: number;
  email: string;
  items: CartItem[];
  promoCode: string | null;
  shipping: ShippingInfo;
  disabled: boolean;
}) {
  const router = useRouter();
  const clear = useCartStore((s) => s.clear);
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "sb";

  return (
    <PayPalScriptProvider options={{ clientId, currency: "USD" }}>
      <PayPalButtons
        style={{ layout: "vertical", color: "gold", shape: "pill", label: "paypal" }}
        disabled={disabled}
        forceReRender={[total]}
        createOrder={(_, actions) =>
          actions.order.create({
            intent: "CAPTURE",
            purchase_units: [{ amount: { currency_code: "USD", value: total.toFixed(2) } }],
          })
        }
        onApprove={async (_, actions) => {
          if (!actions.order) return;
          const captured = await actions.order.capture();
          const res = await fetch("/api/orders/paypal", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email,
              paypalOrderId: captured.id,
              items,
              promoCode,
              shipping,
            }),
          });
          const data = await res.json();
          if (!res.ok) {
            toast.error("Payment captured but order couldn't be saved. Contact support.");
            return;
          }
          clear();
          router.push(`/checkout/success?order=${data.orderId}`);
        }}
        onError={() => toast.error("PayPal checkout failed. Please try again.")}
      />
    </PayPalScriptProvider>
  );
}

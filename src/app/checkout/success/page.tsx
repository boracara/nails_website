import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { stripe, stripeEnabled } from "@/lib/stripe";
import ClearCartOnMount from "@/components/ClearCartOnMount";

type SearchParams = Promise<{ session_id?: string; order?: string; demo?: string }>;

export default async function CheckoutSuccessPage({ searchParams }: { searchParams: SearchParams }) {
  const { session_id, order: orderId } = await searchParams;

  let order = orderId ? await prisma.order.findUnique({ where: { id: orderId } }) : null;

  if (session_id && stripeEnabled && stripe && order && order.status !== "paid") {
    const checkoutSession = await stripe.checkout.sessions.retrieve(session_id);
    if (checkoutSession.payment_status === "paid") {
      order = await prisma.order.update({ where: { id: order.id }, data: { status: "paid" } });
    }
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <h1 className="font-display text-3xl text-brand-900 mb-3">We couldn&apos;t find that order</h1>
        <Link href="/shop" className="text-brand-600 underline">
          Return to shop
        </Link>
      </div>
    );
  }

  const items = JSON.parse(order.items) as { name: string; qty: number; price: number }[];

  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center">
      <ClearCartOnMount />
      <CheckCircle2 size={56} className="mx-auto text-brand-600" />
      <h1 className="font-display text-3xl text-brand-900 mt-4">Thank you for your order!</h1>
      <p className="text-brand-500 mt-2">
        A confirmation has been sent to <span className="font-medium">{order.email}</span>.
      </p>
      <p className="text-sm text-brand-400 mt-1">Order #{order.id.slice(-8).toUpperCase()}</p>

      <div className="mt-8 border border-brand-100 rounded-2xl p-6 text-left">
        <ul className="space-y-2 text-sm text-brand-700">
          {items.map((it, i) => (
            <li key={i} className="flex justify-between">
              <span>
                {it.qty} × {it.name}
              </span>
              <span>${(it.price * it.qty).toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <div className="border-t border-brand-100 mt-4 pt-4 space-y-1 text-sm">
          <div className="flex justify-between text-brand-500">
            <span>Subtotal</span>
            <span>${order.subtotal.toFixed(2)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-brand-500">
              <span>Discount</span>
              <span>-${order.discount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-brand-500">
            <span>Shipping</span>
            <span>{order.shipping === 0 ? "Free" : `$${order.shipping.toFixed(2)}`}</span>
          </div>
          <div className="flex justify-between font-semibold text-brand-900 text-base pt-1">
            <span>Total</span>
            <span>${order.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <Link
        href="/shop"
        className="inline-block mt-8 rounded-full bg-brand-700 hover:bg-brand-800 text-white px-7 py-3 text-sm font-semibold transition-colors"
      >
        Continue Shopping
      </Link>
    </div>
  );
}

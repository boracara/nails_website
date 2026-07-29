import Link from "next/link";
import { Gift } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { stripe, stripeEnabled } from "@/lib/stripe";

type SearchParams = Promise<{ session_id?: string; order?: string }>;

export default async function GiftCardSuccessPage({ searchParams }: { searchParams: SearchParams }) {
  const { session_id, order: orderId } = await searchParams;
  let order = orderId ? await prisma.order.findUnique({ where: { id: orderId } }) : null;

  if (session_id && stripeEnabled && stripe && order && order.status !== "paid") {
    const checkoutSession = await stripe.checkout.sessions.retrieve(session_id);
    if (checkoutSession.payment_status === "paid") {
      order = await prisma.order.update({ where: { id: order.id }, data: { status: "paid" } });
    }
  }

  const giftCard = order?.giftCardId ? await prisma.giftCard.findUnique({ where: { id: order.giftCardId } }) : null;

  if (!order || !giftCard || order.status !== "paid") {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <h1 className="font-display text-3xl text-brand-900 mb-3">We couldn&apos;t confirm that order</h1>
        <Link href="/gift-cards" className="text-brand-600 underline">
          Back to gift cards
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center">
      <Gift size={52} className="mx-auto text-brand-600" />
      <h1 className="font-display text-3xl text-brand-900 mt-4">Your Gift Card is Ready!</h1>
      <p className="text-brand-500 mt-2">A receipt has been sent to {order.email}.</p>

      <div className="mt-8 bg-gradient-to-br from-brand-100 to-brand-200 rounded-2xl p-8">
        <p className="text-xs uppercase tracking-widest text-brand-600 font-semibold">Blush &amp; Bloom Gift Card</p>
        <p className="font-display text-4xl text-brand-900 mt-3">${giftCard.amount.toFixed(2)}</p>
        <p className="mt-4 font-mono text-lg tracking-widest text-brand-800 bg-white/70 rounded-lg py-2">
          {giftCard.code}
        </p>
        {giftCard.recipientName && (
          <p className="text-sm text-brand-700 mt-4">For: {giftCard.recipientName}</p>
        )}
        {giftCard.message && <p className="text-sm text-brand-700 italic mt-1">&ldquo;{giftCard.message}&rdquo;</p>}
      </div>

      <p className="text-xs text-brand-400 mt-4">
        Save this code — it can be shared with the recipient and redeemed at checkout for store credit.
      </p>

      <Link
        href="/shop"
        className="inline-block mt-8 rounded-full bg-brand-700 hover:bg-brand-800 text-white px-7 py-3 text-sm font-semibold transition-colors"
      >
        Continue Shopping
      </Link>
    </div>
  );
}

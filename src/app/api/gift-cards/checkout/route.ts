import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { stripe, stripeEnabled } from "@/lib/stripe";
import { generateGiftCardCode } from "@/lib/gift-cards";

const schema = z.object({
  amount: z.number().min(10).max(500),
  email: z.string().email(),
  senderName: z.string().min(2).max(80),
  recipientName: z.string().max(80).optional(),
  recipientEmail: z.string().email().optional().or(z.literal("")),
  message: z.string().max(300).optional(),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const { amount, email, senderName, recipientName, recipientEmail, message } = parsed.data;

  const giftCard = await prisma.giftCard.create({
    data: {
      code: generateGiftCardCode(),
      amount,
      balance: amount,
      purchasedEmail: email,
      senderName,
      recipientName: recipientName || null,
      recipientEmail: recipientEmail || null,
      message: message || null,
    },
  });

  const order = await prisma.order.create({
    data: {
      email,
      items: JSON.stringify([{ name: `Gift Card ($${amount})`, price: amount, qty: 1 }]),
      subtotal: amount,
      total: amount,
      status: "pending",
      paymentMethod: "stripe",
      giftCardId: giftCard.id,
    },
  });

  const origin = req.headers.get("origin") ?? new URL(req.url).origin;

  if (stripeEnabled && stripe) {
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: `Blush & Bloom Gift Card — $${amount}` },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/gift-cards/success?session_id={CHECKOUT_SESSION_ID}&order=${order.id}`,
      cancel_url: `${origin}/gift-cards`,
      metadata: { orderId: order.id, giftCardId: giftCard.id },
    });

    await prisma.order.update({ where: { id: order.id }, data: { stripeSessionId: checkoutSession.id } });
    return NextResponse.json({ url: checkoutSession.url });
  }

  await prisma.order.update({ where: { id: order.id }, data: { status: "paid" } });
  return NextResponse.json({ url: `/gift-cards/success?order=${order.id}&demo=1` });
}

import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { stripe, stripeEnabled } from "@/lib/stripe";
import { cartSubtotal, evaluatePromo, shippingCost } from "@/lib/pricing";

const schema = z.object({
  email: z.string().email(),
  items: z
    .array(
      z.object({
        productId: z.string(),
        slug: z.string(),
        name: z.string(),
        price: z.number().positive(),
        image: z.string(),
        shape: z.string(),
        size: z.string(),
        qty: z.number().int().positive(),
      })
    )
    .min(1),
  promoCode: z.string().nullable().optional(),
  shipping: z.object({
    name: z.string().min(2),
    line1: z.string().min(3),
    line2: z.string().optional(),
    city: z.string().min(1),
    state: z.string().min(2),
    zip: z.string().min(3),
    phone: z.string().optional(),
  }),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const { email, items, promoCode, shipping } = parsed.data;
  const session = await auth();

  const subtotal = cartSubtotal(items);
  const promo = evaluatePromo(promoCode, items);
  const discount = promo.valid ? promo.discount : 0;
  const afterDiscount = Math.max(0, subtotal - discount);
  const shippingFee = shippingCost(afterDiscount);
  const total = Math.round((afterDiscount + shippingFee) * 100) / 100;

  const order = await prisma.order.create({
    data: {
      userId: session?.user?.id ?? null,
      email,
      items: JSON.stringify(items),
      subtotal,
      discount,
      shipping: shippingFee,
      total,
      promoCode: promo.valid ? promoCode : null,
      status: "pending",
      paymentMethod: "stripe",
      shippingName: shipping.name,
      shippingAddress: JSON.stringify(shipping),
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
            product_data: { name: "Blush & Bloom Nails — Order" },
            unit_amount: Math.round(total * 100),
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}&order=${order.id}`,
      cancel_url: `${origin}/checkout`,
      metadata: { orderId: order.id },
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { stripeSessionId: checkoutSession.id },
    });

    return NextResponse.json({ url: checkoutSession.url });
  }

  // Demo mode: no Stripe keys configured yet — complete the order so the flow can be tested end to end.
  await prisma.order.update({ where: { id: order.id }, data: { status: "paid" } });
  return NextResponse.json({ url: `/checkout/success?order=${order.id}&demo=1` });
}

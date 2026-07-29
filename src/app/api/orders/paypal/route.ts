import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { cartSubtotal, evaluatePromo, shippingCost } from "@/lib/pricing";

const schema = z.object({
  email: z.string().email(),
  paypalOrderId: z.string().min(1),
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

  const { email, items, promoCode, shipping, paypalOrderId } = parsed.data;
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
      status: "paid",
      paymentMethod: "paypal",
      stripeSessionId: paypalOrderId,
      shippingName: shipping.name,
      shippingAddress: JSON.stringify(shipping),
    },
  });

  return NextResponse.json({ orderId: order.id });
}

import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

const schema = z.object({
  productId: z.string().min(1),
  name: z.string().min(2).max(60),
  rating: z.number().int().min(1).max(5),
  title: z.string().min(2).max(80),
  body: z.string().min(5).max(1000),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const session = await auth();

  const review = await prisma.review.create({
    data: {
      ...parsed.data,
      userId: session?.user?.id ?? null,
      verified: !!session?.user,
    },
  });

  return NextResponse.json(review);
}

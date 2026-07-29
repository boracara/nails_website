import { prisma } from "@/lib/prisma";

export type ProductWithExtras = Awaited<ReturnType<typeof getProductBySlug>>;

export function parseProduct<T extends { images: string; shapes: string }>(p: T) {
  return {
    ...p,
    images: JSON.parse(p.images) as string[],
    shapes: JSON.parse(p.shapes) as string[],
  };
}

export async function getAllProducts() {
  const products = await prisma.product.findMany({
    include: { reviews: true },
    orderBy: { createdAt: "asc" },
  });
  return products.map((p) => ({
    ...parseProduct(p),
    avgRating: avgRating(p.reviews.map((r) => r.rating)),
    reviewCount: p.reviews.length,
  }));
}

export async function getFeaturedProducts() {
  const products = await getAllProducts();
  return products.filter((p) => p.featured);
}

export async function getProductBySlug(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { reviews: { orderBy: { createdAt: "desc" } } },
  });
  if (!product) return null;
  return {
    ...parseProduct(product),
    avgRating: avgRating(product.reviews.map((r) => r.rating)),
    reviewCount: product.reviews.length,
  };
}

export function avgRating(ratings: number[]) {
  if (ratings.length === 0) return 5;
  return Math.round((ratings.reduce((s, r) => s + r, 0) / ratings.length) * 10) / 10;
}

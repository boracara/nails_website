import { COLLECTIONS, NAIL_SHAPES, SEASONS } from "@/data/products";

export function collectionHref(collection: string) {
  return `/shop?collection=${encodeURIComponent(collection)}`;
}

export function shapeHref(shape: string) {
  return `/shop?shape=${encodeURIComponent(shape)}`;
}

export function seasonHref(season: string) {
  return `/shop?season=${encodeURIComponent(season)}`;
}

export { COLLECTIONS, NAIL_SHAPES, SEASONS };

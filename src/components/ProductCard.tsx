import Link from "next/link";
import Image from "next/image";
import StarRating from "./StarRating";
import WishlistButton from "./WishlistButton";

export type ProductCardData = {
  id: string;
  slug: string;
  name: string;
  price: number;
  compareAtPrice?: number | null;
  image: string;
  collection: string;
  style: string;
  avgRating?: number;
  reviewCount?: number;
};

export default function ProductCard({ product }: { product: ProductCardData }) {
  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-brand-50">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
        <WishlistButton
          product={{
            productId: product.id,
            slug: product.slug,
            name: product.name,
            price: product.price,
            image: product.image,
          }}
          className="absolute top-3 right-3 h-9 w-9"
        />
        {product.compareAtPrice && (
          <span className="absolute top-3 left-3 bg-brand-600 text-white text-[11px] font-semibold px-2 py-1 rounded-full">
            SALE
          </span>
        )}
      </div>
      <div className="mt-3">
        <p className="text-[11px] uppercase tracking-wider text-brand-400">{product.collection}</p>
        <h3 className="text-sm font-medium text-brand-900 mt-0.5 group-hover:text-brand-600 transition-colors">
          {product.name}
        </h3>
        {typeof product.avgRating === "number" && (
          <div className="flex items-center gap-1.5 mt-1">
            <StarRating rating={product.avgRating} size={12} />
            <span className="text-[11px] text-brand-400">({product.reviewCount ?? 0})</span>
          </div>
        )}
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm font-semibold text-brand-900">${product.price.toFixed(2)}</span>
          {product.compareAtPrice && (
            <span className="text-xs text-brand-300 line-through">
              ${product.compareAtPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

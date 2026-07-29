import { notFound } from "next/navigation";
import ProductGallery from "@/components/ProductGallery";
import AddToCartControls from "@/components/AddToCartControls";
import ReviewsSection from "@/components/ReviewsSection";
import StarRating from "@/components/StarRating";
import ProductCard from "@/components/ProductCard";
import { getAllProducts, getProductBySlug } from "@/lib/products-data";
import { Truck, ShieldCheck, RefreshCw } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return {
    title: `${product.name} | Blush & Bloom`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const all = await getAllProducts();
  const related = all.filter((p) => p.id !== product.id && p.collection === product.collection).slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="grid md:grid-cols-2 gap-10">
        <ProductGallery images={product.images} name={product.name} />

        <div>
          <p className="text-xs uppercase tracking-wider text-brand-400">{product.collection}</p>
          <h1 className="font-display text-3xl text-brand-900 mt-1">{product.name}</h1>
          <div className="flex items-center gap-2 mt-2">
            <StarRating rating={product.avgRating} />
            <span className="text-sm text-brand-500">
              {product.avgRating.toFixed(1)} ({product.reviewCount} reviews)
            </span>
          </div>
          <div className="flex items-center gap-3 mt-4">
            <span className="text-2xl font-semibold text-brand-900">${product.price.toFixed(2)}</span>
            {product.compareAtPrice && (
              <span className="text-brand-300 line-through">${product.compareAtPrice.toFixed(2)}</span>
            )}
          </div>
          <p className="text-brand-600 mt-4 leading-relaxed text-sm">{product.description}</p>

          <div className="mt-6">
            <AddToCartControls
              product={{
                id: product.id,
                slug: product.slug,
                name: product.name,
                price: product.price,
                image: product.image,
              }}
              shapes={product.shapes}
            />
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3 text-center border-t border-brand-100 pt-6">
            <div className="flex flex-col items-center gap-1.5">
              <Truck size={20} className="text-brand-600" />
              <p className="text-[11px] text-brand-600">Free shipping $35+</p>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <ShieldCheck size={20} className="text-brand-600" />
              <p className="text-[11px] text-brand-600">Damage-free formula</p>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <RefreshCw size={20} className="text-brand-600" />
              <p className="text-[11px] text-brand-600">Reusable up to 3x</p>
            </div>
          </div>
        </div>
      </div>

      <ReviewsSection
        productId={product.id}
        reviews={product.reviews.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() }))}
        avgRating={product.avgRating}
      />

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-2xl text-brand-900 mb-6">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-8">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

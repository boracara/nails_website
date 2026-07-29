import Image from "next/image";
import Link from "next/link";
import { Gift, Palette, ShieldCheck, Truck } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import StarRating from "@/components/StarRating";
import NewsletterForm from "@/components/NewsletterForm";
import { getAllProducts, getFeaturedProducts } from "@/lib/products-data";
import { COLLECTIONS, collectionHref } from "@/lib/nav";

const COLLECTION_BLURBS: Record<string, string> = {
  "Summer Collection": "Bright, beachy, and built for the season.",
  "Solid Color": "Timeless shades for everyday wear.",
  Designs: "Hand-painted art, made to turn heads.",
  Wedding: "Bridal-ready sets for your big day.",
  "Kids Nails": "Safe, fun press-ons for little hands.",
};

export default async function Home() {
  const [featured, all] = await Promise.all([getFeaturedProducts(), getAllProducts()]);
  const bestSellers = (featured.length ? featured : all).slice(0, 4);

  return (
    <div>
      {/* Hero */}
      <section className="relative">
        <div className="relative h-[70vh] min-h-[480px] w-full overflow-hidden">
          <Image src="/hero/hero.svg" alt="Press-on nails hero" fill priority className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="mx-auto max-w-7xl px-4 w-full">
              <div className="max-w-lg">
                <p className="uppercase tracking-[0.25em] text-xs font-semibold text-brand-700 mb-3">
                  Salon Finish · Zero Damage
                </p>
                <h1 className="font-display text-4xl sm:text-5xl text-brand-900 leading-tight">
                  Press-on nails that feel like your own.
                </h1>
                <p className="mt-4 text-brand-800 text-base sm:text-lg">
                  Reusable, damage-free sets in every shape and size — applied in under 15 minutes, no salon required.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href="/shop"
                    className="rounded-full bg-brand-800 hover:bg-brand-900 text-white px-7 py-3 text-sm font-semibold transition-colors"
                  >
                    Shop All Sets
                  </Link>
                  <Link
                    href="/size-guide"
                    className="rounded-full border border-brand-800 text-brand-900 px-7 py-3 text-sm font-semibold hover:bg-white/50 transition-colors"
                  >
                    Find My Size
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* USPs */}
      <section className="mx-auto max-w-7xl px-4 py-10 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
        {[
          { icon: Truck, label: "Free US shipping $35+" },
          { icon: ShieldCheck, label: "Damage-free, reusable" },
          { icon: Palette, label: "13 nail shapes" },
          { icon: Gift, label: "Gift cards available" },
        ].map(({ icon: Icon, label }) => (
          <div key={label} className="flex flex-col items-center gap-2">
            <Icon size={26} className="text-brand-600" />
            <p className="text-xs sm:text-sm text-brand-700 font-medium">{label}</p>
          </div>
        ))}
      </section>

      {/* Collections */}
      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="flex items-end justify-between mb-6">
          <h2 className="font-display text-3xl text-brand-900">Shop by Collection</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {COLLECTIONS.map((c, i) => (
            <Link
              key={c}
              href={collectionHref(c)}
              className="group relative aspect-[3/4] rounded-2xl overflow-hidden bg-brand-100"
            >
              <Image
                src={all.find((p) => p.collection === c)?.image ?? "/hero/hero.svg"}
                alt={c}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/25 group-hover:bg-black/35 transition-colors flex items-end p-4">
                <div>
                  <p className="text-white font-display text-lg leading-tight">{c}</p>
                  <p className="text-white/80 text-[11px] mt-1 hidden sm:block">{COLLECTION_BLURBS[c]}</p>
                </div>
              </div>
              {i === 0 && (
                <span className="absolute top-3 left-3 bg-white text-brand-700 text-[10px] font-semibold px-2 py-1 rounded-full">
                  NEW
                </span>
              )}
            </Link>
          ))}
        </div>
      </section>

      {/* Best sellers */}
      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="flex items-end justify-between mb-6">
          <h2 className="font-display text-3xl text-brand-900">Best Sellers</h2>
          <Link href="/shop" className="text-sm font-medium text-brand-600 hover:text-brand-800">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-8">
          {bestSellers.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Social proof */}
      <section className="bg-brand-50 mt-10 py-14">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <StarRating rating={5} size={20} />
          <p className="font-display text-2xl sm:text-3xl text-brand-900 mt-4 leading-snug">
            &ldquo;These lasted two full weeks and every single person asked where I got my nails done.&rdquo;
          </p>
          <p className="text-sm text-brand-500 mt-3">— Jasmine T., verified customer</p>
        </div>
      </section>

      {/* Newsletter */}
      <section className="mx-auto max-w-7xl px-4 py-16 flex flex-col items-center text-center">
        <h2 className="font-display text-3xl text-brand-900">Get 15% Off Your First Order</h2>
        <p className="text-brand-600 mt-2 max-w-md">
          Sign up for restock alerts, new collection drops, and exclusive discounts.
        </p>
        <div className="mt-6">
          <NewsletterForm />
        </div>
      </section>
    </div>
  );
}

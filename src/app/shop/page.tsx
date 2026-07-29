import ProductCard from "@/components/ProductCard";
import FilterSidebar from "@/components/FilterSidebar";
import SortSelect from "@/components/SortSelect";
import { getAllProducts } from "@/lib/products-data";

export const metadata = { title: "Shop All Press-On Nails | Blush & Bloom" };

type SearchParams = Promise<{
  collection?: string | string[];
  season?: string | string[];
  style?: string | string[];
  shape?: string | string[];
  sort?: string;
}>;

function toArray(v?: string | string[]) {
  if (!v) return [];
  return Array.isArray(v) ? v : [v];
}

export default async function ShopPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const products = await getAllProducts();

  const collections = toArray(params.collection);
  const seasons = toArray(params.season);
  const stylesFilter = toArray(params.style);
  const shapesFilter = toArray(params.shape);

  const allStyles = Array.from(new Set(products.map((p) => p.style))).sort();
  const allShapes = Array.from(new Set(products.flatMap((p) => p.shapes))).sort();

  let filtered = products.filter((p) => {
    if (collections.length && !collections.includes(p.collection)) return false;
    if (seasons.length && !seasons.includes(p.season)) return false;
    if (stylesFilter.length && !stylesFilter.includes(p.style)) return false;
    if (shapesFilter.length && !p.shapes.some((s) => shapesFilter.includes(s))) return false;
    return true;
  });

  switch (params.sort) {
    case "price-asc":
      filtered = filtered.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      filtered = filtered.sort((a, b) => b.price - a.price);
      break;
    case "newest":
      filtered = filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
    case "rating":
      filtered = filtered.sort((a, b) => b.avgRating - a.avgRating);
      break;
    default:
      filtered = filtered.sort((a, b) => Number(b.featured) - Number(a.featured));
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl sm:text-4xl text-brand-900">Shop All Press-On Nails</h1>
        <p className="text-brand-500 mt-2 text-sm">{filtered.length} sets available</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <FilterSidebar shapes={allShapes} styles={allStyles} />

        <div className="flex-1">
          <div className="flex justify-end mb-5">
            <SortSelect />
          </div>

          {filtered.length === 0 ? (
            <p className="text-brand-400 py-20 text-center">No sets match these filters yet — try clearing a few.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-5 gap-y-8">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

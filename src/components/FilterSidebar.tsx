"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDown, X } from "lucide-react";
import { COLLECTIONS, SEASONS } from "@/lib/nav";

function useMultiParam(key: string) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const values = searchParams.getAll(key);

  function toggle(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    const current = params.getAll(key);
    params.delete(key);
    if (current.includes(value)) {
      current.filter((v) => v !== value).forEach((v) => params.append(key, v));
    } else {
      [...current, value].forEach((v) => params.append(key, v));
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return { values, toggle };
}

function FacetGroup({ title, options, paramKey }: { title: string; options: readonly string[]; paramKey: string }) {
  const [open, setOpen] = useState(true);
  const { values, toggle } = useMultiParam(paramKey);

  return (
    <div className="border-b border-brand-100 py-4">
      <button className="w-full flex items-center justify-between text-sm font-semibold text-brand-900" onClick={() => setOpen((v) => !v)}>
        {title}
        <ChevronDown size={16} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="mt-3 space-y-2">
          {options.map((opt) => (
            <label key={opt} className="flex items-center gap-2 text-sm text-brand-700 cursor-pointer">
              <input
                type="checkbox"
                checked={values.includes(opt)}
                onChange={() => toggle(opt)}
                className="rounded border-brand-300 text-brand-600 focus:ring-brand-400"
              />
              {opt}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

export default function FilterSidebar({ shapes, styles }: { shapes: string[]; styles: string[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const hasFilters = ["collection", "season", "shape", "style"].some((k) => searchParams.getAll(k).length > 0);

  return (
    <aside className="w-full lg:w-56 shrink-0">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-semibold text-brand-900">Filter</p>
        {hasFilters && (
          <button
            onClick={() => router.push(pathname, { scroll: false })}
            className="flex items-center gap-1 text-xs text-brand-500 hover:text-brand-700"
          >
            <X size={12} /> Clear all
          </button>
        )}
      </div>
      <FacetGroup title="Collection" options={COLLECTIONS} paramKey="collection" />
      <FacetGroup title="Season" options={SEASONS} paramKey="season" />
      <FacetGroup title="Style" options={styles} paramKey="style" />
      <FacetGroup title="Nail Shape" options={shapes} paramKey="shape" />
    </aside>
  );
}

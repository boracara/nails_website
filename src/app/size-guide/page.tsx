import Image from "next/image";
import Link from "next/link";
import { SIZE_CHART_MM } from "@/data/size-chart";
import { NAIL_SHAPES } from "@/data/products";

export const metadata = { title: "Size Guide | Blush & Bloom Nails" };

export default function SizeGuidePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-14">
      <div className="text-center mb-10">
        <h1 className="font-display text-4xl text-brand-900">Nail Size Guide</h1>
        <p className="text-brand-600 mt-3 max-w-xl mx-auto">
          Getting the right fit means a set that lasts. Measure your nail beds in millimeters and
          match them to the chart below — it only takes a minute.
        </p>
      </div>

      <div className="relative w-full aspect-[700/420] rounded-2xl overflow-hidden bg-brand-50 mb-10">
        <Image src="/hero/size-guide.svg" alt="How to measure your nail width" fill className="object-contain" />
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-12 text-sm text-brand-700">
        <div className="bg-brand-50 rounded-xl p-4">
          <p className="font-semibold text-brand-900 mb-1">Step 1</p>
          Using a soft measuring tape or ruler, measure the widest part of each nail bed, from cuticle
          edge to cuticle edge.
        </div>
        <div className="bg-brand-50 rounded-xl p-4">
          <p className="font-semibold text-brand-900 mb-1">Step 2</p>
          Record each measurement in millimeters for your thumb, index, middle, ring, and pinky
          finger.
        </div>
        <div className="bg-brand-50 rounded-xl p-4">
          <p className="font-semibold text-brand-900 mb-1">Step 3</p>
          Match your measurements to the closest size below. Between sizes? Size up for comfort.
        </div>
      </div>

      <div className="overflow-x-auto mb-6">
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr className="border-b border-brand-200 text-brand-500">
              <th className="py-3 pr-3 font-semibold">Size</th>
              <th className="py-3 pr-3 font-semibold">Thumb</th>
              <th className="py-3 pr-3 font-semibold">Index</th>
              <th className="py-3 pr-3 font-semibold">Middle</th>
              <th className="py-3 pr-3 font-semibold">Ring</th>
              <th className="py-3 pr-3 font-semibold">Pinky</th>
            </tr>
          </thead>
          <tbody>
            {SIZE_CHART_MM.map((row) => (
              <tr key={row.size} className="border-b border-brand-100">
                <td className="py-3 pr-3 font-semibold text-brand-900">{row.size}</td>
                <td className="py-3 pr-3">{row.thumb} mm</td>
                <td className="py-3 pr-3">{row.index} mm</td>
                <td className="py-3 pr-3">{row.middle} mm</td>
                <td className="py-3 pr-3">{row.ring} mm</td>
                <td className="py-3 pr-3">{row.pinky} mm</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-brand-50 rounded-xl p-5 text-sm text-brand-700 mb-14">
        <span className="font-semibold">Between sizes?</span> Choose the larger size for the best
        fit, or{" "}
        <Link href="/custom-designs" className="underline font-medium">
          order a custom set
        </Link>{" "}
        by sending your exact nail measurements in millimeters.
      </div>

      <h2 className="font-display text-2xl text-brand-900 mb-4">Shop by Nail Shape</h2>
      <div className="flex flex-wrap gap-2">
        {NAIL_SHAPES.map((shape) => (
          <Link
            key={shape}
            href={`/shop?shape=${encodeURIComponent(shape)}`}
            className="px-4 py-2 rounded-full border border-brand-200 text-sm text-brand-700 hover:border-brand-500 hover:text-brand-900 transition-colors"
          >
            {shape}
          </Link>
        ))}
      </div>
    </div>
  );
}

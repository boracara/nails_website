"use client";

import { useState } from "react";
import Image from "next/image";
import { Ruler, X } from "lucide-react";
import { SIZE_CHART_MM } from "@/data/size-chart";

export default function SizeChartModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 text-sm text-brand-600 hover:text-brand-800 underline underline-offset-2"
      >
        <Ruler size={15} />
        Size chart
      </button>

      {open && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-brand-100 sticky top-0 bg-white">
              <h3 className="font-display text-xl text-brand-900">Nail Size Guide</h3>
              <button onClick={() => setOpen(false)} aria-label="Close">
                <X size={20} />
              </button>
            </div>
            <div className="p-5 space-y-5">
              <div className="relative w-full aspect-[700/420] rounded-xl overflow-hidden bg-brand-50">
                <Image src="/hero/size-guide.svg" alt="How to measure your nail width" fill className="object-contain" />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse">
                  <thead>
                    <tr className="border-b border-brand-100 text-brand-500">
                      <th className="py-2 pr-3 font-semibold">Size</th>
                      <th className="py-2 pr-3 font-semibold">Thumb</th>
                      <th className="py-2 pr-3 font-semibold">Index</th>
                      <th className="py-2 pr-3 font-semibold">Middle</th>
                      <th className="py-2 pr-3 font-semibold">Ring</th>
                      <th className="py-2 pr-3 font-semibold">Pinky</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SIZE_CHART_MM.map((row) => (
                      <tr key={row.size} className="border-b border-brand-50">
                        <td className="py-2 pr-3 font-semibold text-brand-900">{row.size}</td>
                        <td className="py-2 pr-3">{row.thumb} mm</td>
                        <td className="py-2 pr-3">{row.index} mm</td>
                        <td className="py-2 pr-3">{row.middle} mm</td>
                        <td className="py-2 pr-3">{row.ring} mm</td>
                        <td className="py-2 pr-3">{row.pinky} mm</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="bg-brand-50 rounded-xl p-4 text-sm text-brand-700">
                <span className="font-semibold">Between sizes?</span> Choose the larger size for the
                best fit, or order a custom set by sending your nail measurements in millimeters on our{" "}
                <a href="/custom-designs" className="underline">
                  Custom Designs
                </a>{" "}
                page.
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

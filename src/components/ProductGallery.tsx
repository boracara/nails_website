"use client";

import { useState } from "react";
import Image from "next/image";

export default function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-brand-50">
        <Image src={images[active]} alt={name} fill priority className="object-cover" />
      </div>
      {images.length > 1 && (
        <div className="flex gap-3 mt-3">
          {images.map((img, i) => (
            <button
              key={img}
              onClick={() => setActive(i)}
              className={`relative h-20 w-20 rounded-xl overflow-hidden border-2 transition-colors ${
                active === i ? "border-brand-600" : "border-transparent"
              }`}
            >
              <Image src={img} alt={`${name} view ${i + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

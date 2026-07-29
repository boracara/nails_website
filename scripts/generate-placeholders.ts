import { writeFileSync, mkdirSync } from "node:fs";
import { PRODUCTS } from "../src/data/products";

mkdirSync("public/products", { recursive: true });
mkdirSync("public/hero", { recursive: true });

function hexToRgb(hex: string) {
  const v = hex.replace("#", "");
  return {
    r: parseInt(v.substring(0, 2), 16),
    g: parseInt(v.substring(2, 4), 16),
    b: parseInt(v.substring(4, 6), 16),
  };
}

function darken(hex: string, amount: number) {
  const { r, g, b } = hexToRgb(hex);
  const d = (c: number) => Math.max(0, Math.round(c * (1 - amount)));
  return `rgb(${d(r)},${d(g)},${d(b)})`;
}

// A single hand-with-nails glyph, tinted per-product, centered in a soft gradient card.
// Local coordinate space is self-centered around the wrist/palm area (roughly x:[-105,112], y:[-157,166]).
// Wrap the result in a <g transform="translate(x,y) scale(s)"> at the call site to position it.
function handGlyph(accent: string) {
  const dark = darken(accent, 0.35);
  return `
    <ellipse cx="0" cy="150" rx="150" ry="26" fill="rgba(0,0,0,0.06)" />
    <path d="M -95 140
             C -105 40, -100 -30, -78 -95
             C -70 -118, -40 -122, -34 -98
             C -30 -80, -32 -40, -30 -10
             L -30 -120
             C -30 -145, 4 -145, 4 -120
             L 4 -20
             L 4 -132
             C 4 -157, 38 -157, 38 -132
             L 38 -20
             L 38 -118
             C 38 -140, 68 -140, 68 -118
             L 68 -5
             C 82 -18, 100 -14, 104 4
             C 112 46, 112 96, 95 140
             Z"
      fill="${accent}" stroke="${dark}" stroke-width="3" stroke-linejoin="round" />
    <g fill="${dark}" opacity="0.85">
      <rect x="-40" y="-124" width="34" height="16" rx="7" />
      <rect x="-2" y="-149" width="34" height="16" rx="7" />
      <rect x="30" y="-136" width="34" height="16" rx="7" />
      <rect x="62" y="-122" width="30" height="16" rx="7" />
    </g>`;
}

function card({
  name,
  price,
  gradient,
  accent,
  tag,
  id,
}: {
  name: string;
  price: number;
  gradient: [string, string];
  accent: string;
  tag: string;
  id: string;
}) {
  const [g1, g2] = gradient;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
  <defs>
    <linearGradient id="bg-${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${g1}" />
      <stop offset="1" stop-color="${g2}" />
    </linearGradient>
  </defs>
  <rect width="600" height="600" fill="url(#bg-${id})" />
  <g transform="translate(300,255)">${handGlyph(accent)}</g>
  <rect x="24" y="24" width="150" height="34" rx="17" fill="rgba(255,255,255,0.75)" />
  <text x="99" y="46" font-family="Helvetica, Arial, sans-serif" font-size="15" font-weight="600" fill="#5b4636" text-anchor="middle" letter-spacing="0.5">${tag}</text>
  <rect x="0" y="500" width="600" height="100" fill="rgba(255,255,255,0.85)" />
  <text x="300" y="540" font-family="Helvetica, Arial, sans-serif" font-size="26" font-weight="700" fill="#3a2c2c" text-anchor="middle">${name}</text>
  <text x="300" y="572" font-family="Helvetica, Arial, sans-serif" font-size="18" fill="#8a7a72" text-anchor="middle">$${price.toFixed(2)} &#183; Placeholder photo</text>
</svg>`;
}

PRODUCTS.forEach((p, i) => {
  const svg = card({
    name: p.name,
    price: p.price,
    gradient: p.gradient,
    accent: p.accent,
    tag: `SAMPLE PHOTO ${i + 1}/10`,
    id: p.slug,
  });
  writeFileSync(`public/products/${p.slug}.svg`, svg);
  // A couple of extra angle placeholders per product for the gallery
  writeFileSync(
    `public/products/${p.slug}-2.svg`,
    card({ name: p.name, price: p.price, gradient: [p.gradient[1], p.gradient[0]], accent: p.accent, tag: "ANGLE 2", id: p.slug + "-2" })
  );
  writeFileSync(
    `public/products/${p.slug}-3.svg`,
    card({ name: p.name, price: p.price, gradient: p.gradient, accent: darken(p.accent, 0.15), tag: "ON HAND", id: p.slug + "-3" })
  );
});

// Hero banner
const heroSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">
  <defs>
    <linearGradient id="hero" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#fbe7ef" />
      <stop offset="1" stop-color="#f3c9d8" />
    </linearGradient>
  </defs>
  <rect width="1600" height="900" fill="url(#hero)" />
  <g transform="translate(1220,460) scale(2.1)">${handGlyph("#e7a6c2")}</g>
  <g transform="translate(1480,300) scale(1.5)">${handGlyph("#c98aa8")}</g>
  <rect x="40" y="40" width="270" height="34" rx="17" fill="rgba(255,255,255,0.7)" />
  <text x="60" y="63" font-family="Helvetica, Arial, sans-serif" font-size="15" font-weight="600" fill="#5b4636">PLACEHOLDER HERO PHOTO</text>
</svg>`;
writeFileSync("public/hero/hero.svg", heroSvg);

// Size guide measuring illustration
const fingers = [
  { name: "Thumb", cx: -110, w: 70, h: 190 },
  { name: "Index", cx: -50, w: 54, h: 230 },
  { name: "Middle", cx: 10, w: 54, h: 250 },
  { name: "Ring", cx: 70, w: 52, h: 232 },
  { name: "Pinky", cx: 126, w: 44, h: 190 },
];

const fingerShapes = fingers
  .map((f) => {
    const x = f.cx - f.w / 2;
    const y = 260 - f.h;
    return `<rect x="${x}" y="${y}" width="${f.w}" height="${f.h}" rx="${f.w / 2}" fill="#f6cddb" stroke="#b23e64" stroke-width="3" />
    <line x1="${x - 10}" y1="${y + 18}" x2="${x + f.w + 10}" y2="${y + 18}" stroke="#922f50" stroke-width="2" stroke-dasharray="4 4" />`;
  })
  .join("\n");

const fingerLabels = fingers
  .map(
    (f) =>
      `<text x="${f.cx}" y="290" font-family="Helvetica, Arial, sans-serif" font-size="18" fill="#4a1a2c" text-anchor="middle" font-weight="600">${f.name}</text>`
  )
  .join("\n");

const sizeGuideSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="700" height="420" viewBox="0 0 700 420">
  <defs>
    <linearGradient id="sg-bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#fffaf7" />
      <stop offset="1" stop-color="#fbe6ed" />
    </linearGradient>
  </defs>
  <rect width="700" height="420" fill="url(#sg-bg)" rx="24" />
  <text x="350" y="45" font-family="Georgia, 'Times New Roman', serif" font-size="24" fill="#4a1a2c" text-anchor="middle">How to measure your nail width</text>
  <g transform="translate(350,60)">
    <path d="M -170 260 C -190 150, -150 40, -30 20 L 170 20 C 210 30, 210 90, 190 120 L -140 260 Z" fill="#fdeef3" opacity="0.6" />
    ${fingerShapes}
    ${fingerLabels}
  </g>
  <text x="350" y="400" font-family="Helvetica, Arial, sans-serif" font-size="15" fill="#8a5a6c" text-anchor="middle">Measure the widest part of each nail bed in millimeters, then match to the chart below.</text>
</svg>`;
writeFileSync("public/hero/size-guide.svg", sizeGuideSvg);

console.log(`Generated ${PRODUCTS.length * 3} product placeholder images + hero banner + size guide image.`);

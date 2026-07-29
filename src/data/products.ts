export type ProductSeed = {
  slug: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  collection: "Summer Collection" | "Solid Color" | "Designs" | "Wedding" | "Kids Nails";
  style: string;
  season: "Spring" | "Summer" | "Fall" | "Winter" | "All Season";
  shapes: string[];
  coverage?: "Full Cover" | "Kids";
  featured?: boolean;
  gradient: [string, string];
  accent: string;
};

export const NAIL_SHAPES = [
  "Extra Short Oval",
  "Short Oval",
  "Short Almond",
  "Medium Almond",
  "Long Stiletto",
  "Extra Short Coffin",
  "Short Coffin",
  "Medium Coffin",
  "Long Coffin",
  "Short Square",
  "Medium Square",
  "Extra Short Squoval",
  "Kids Nails",
] as const;

export const COLLECTIONS = ["Summer Collection", "Solid Color", "Designs", "Wedding", "Kids Nails"] as const;
export const SEASONS = ["Spring", "Summer", "Fall", "Winter", "All Season"] as const;

const ALL_ADULT_SHAPES = [
  "Extra Short Oval",
  "Short Oval",
  "Short Almond",
  "Medium Almond",
  "Long Stiletto",
  "Extra Short Coffin",
  "Short Coffin",
  "Medium Coffin",
  "Long Coffin",
  "Short Square",
  "Medium Square",
  "Extra Short Squoval",
];

export const PRODUCTS: ProductSeed[] = [
  {
    slug: "glazed-donut-chrome",
    name: "Glazed Donut Chrome",
    description:
      "Our best-selling milky chrome press-on set inspired by the viral glazed donut nail trend. A soft pearlescent finish that catches the light from every angle. Hand-painted and buffed to a mirror shine.",
    price: 24,
    compareAtPrice: 30,
    collection: "Summer Collection",
    style: "Chrome",
    season: "Summer",
    shapes: ALL_ADULT_SHAPES,
    featured: true,
    gradient: ["#f5e6e8", "#d8c3d1"],
    accent: "#b98ea7",
  },
  {
    slug: "french-tip-classic",
    name: "Classic French Tip",
    description:
      "The timeless French manicure, reinvented in a durable press-on set. Sheer nude base with a crisp white tip that never chips. Perfect for every day or every occasion.",
    price: 20,
    collection: "Solid Color",
    style: "French",
    season: "All Season",
    shapes: ALL_ADULT_SHAPES,
    featured: true,
    gradient: ["#fdf6f0", "#f3d9c4"],
    accent: "#e8b98f",
  },
  {
    slug: "stained-glass-floral",
    name: "Stained Glass Floral",
    description:
      "Hand-painted floral art layered over a translucent stained-glass effect. A show-stopping statement set for weddings, engagements, and special occasions.",
    price: 28,
    compareAtPrice: 34,
    collection: "Wedding",
    style: "Floral",
    season: "Spring",
    shapes: ALL_ADULT_SHAPES,
    featured: true,
    gradient: ["#efe4f7", "#cbb3e0"],
    accent: "#9a6bc2",
  },
  {
    slug: "butterfly-kisses",
    name: "Butterfly Kisses",
    description:
      "Delicate butterfly accents on a glossy clear-to-nude ombre base. Lightweight, whimsical, and perfect for festival season or summer nights out.",
    price: 26,
    collection: "Summer Collection",
    style: "Ombre",
    season: "Summer",
    shapes: ALL_ADULT_SHAPES,
    gradient: ["#e6f4f1", "#b7ddd3"],
    accent: "#5fae9b",
  },
  {
    slug: "cherry-red-gloss",
    name: "Cherry Red Gloss",
    description:
      "A rich, high-gloss cherry red in a classic solid finish. Bold, elegant, and endlessly versatile — the one set every nail wardrobe needs.",
    price: 20,
    collection: "Solid Color",
    style: "Solid",
    season: "Winter",
    shapes: ALL_ADULT_SHAPES,
    featured: true,
    gradient: ["#fbe1e1", "#e58c8c"],
    accent: "#c94d4d",
  },
  {
    slug: "ocean-marble-wave",
    name: "Ocean Marble Wave",
    description:
      "Swirling blue and white marble inspired by ocean waves. Each nail is uniquely marbled for a one-of-a-kind finish with a glassy top coat.",
    price: 27,
    collection: "Summer Collection",
    style: "Marble",
    season: "Summer",
    shapes: ALL_ADULT_SHAPES,
    gradient: ["#e3f0fb", "#a9cdec"],
    accent: "#4f8bc9",
  },
  {
    slug: "nude-on-nude",
    name: "Nude on Nude Set",
    description:
      "Five versatile nude tones in a soft matte-to-satin finish. Understated, sophisticated, and designed to flatter every skin tone.",
    price: 22,
    collection: "Solid Color",
    style: "Solid",
    season: "All Season",
    shapes: ALL_ADULT_SHAPES,
    gradient: ["#f2e7de", "#d9bd9f"],
    accent: "#b48b64",
  },
  {
    slug: "autumn-leopard",
    name: "Autumn Leopard",
    description:
      "Warm caramel and chocolate leopard print hand-painted over a glossy tan base. Cozy, chic, and made for sweater weather.",
    price: 25,
    collection: "Designs",
    style: "Animal Print",
    season: "Fall",
    shapes: ALL_ADULT_SHAPES,
    gradient: ["#f3e6d3", "#cf9f6c"],
    accent: "#8a5a2b",
  },
  {
    slug: "snowflake-sparkle",
    name: "Snowflake Sparkle",
    description:
      "Icy blue glitter fade with hand-placed snowflake accents. A holiday favorite that sparkles from the dance floor to the slopes.",
    price: 26,
    compareAtPrice: 32,
    collection: "Designs",
    style: "Glitter",
    season: "Winter",
    shapes: ALL_ADULT_SHAPES,
    gradient: ["#e8f1fb", "#bcd6f0"],
    accent: "#6fa2d8",
  },
  {
    slug: "pastel-swirl-kids",
    name: "Pastel Swirl Kids Set",
    description:
      "Gentle, easy-apply press-ons sized just for little hands. Fun pastel swirls in a safe, short length designed for kids' nail play.",
    price: 14,
    collection: "Kids Nails",
    style: "Swirl",
    season: "All Season",
    shapes: ["Kids Nails"],
    coverage: "Kids",
    gradient: ["#fdeaf5", "#f6c7e3"],
    accent: "#e587c0",
  },
];

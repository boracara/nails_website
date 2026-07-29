import { PrismaClient } from "@prisma/client";
import { PRODUCTS, NAIL_SHAPES } from "../src/data/products";

const prisma = new PrismaClient();

const REVIEW_NAMES = [
  "Jasmine T.", "Maria G.", "Ashley K.", "Brianna L.", "Courtney P.",
  "Destiny R.", "Emily S.", "Faith W.", "Grace H.", "Hannah M.",
];

const REVIEW_TITLES = [
  "Obsessed!", "Lasted 2 weeks!", "So easy to apply", "Better than the salon",
  "Perfect fit", "Compliments everywhere", "Great quality", "Will buy again",
];

const REVIEW_BODIES = [
  "These stayed on through everything — showers, dishes, the gym. Application took less than 15 minutes with the included glue.",
  "The shape and size guide was spot on, found my perfect fit on the first try. So comfortable I forgot I was wearing them.",
  "I get compliments every single time I wear this set. The finish looks so much more expensive than the price.",
  "First time trying press-ons and I'm never going back to the salon. Easy application and they look so natural.",
  "Good length, not too long, not too short. The design is even more beautiful in person.",
];

function rand<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function main() {
  console.log("Seeding database...");

  for (const p of PRODUCTS) {
    const images = [
      `/products/${p.slug}.svg`,
      `/products/${p.slug}-2.svg`,
      `/products/${p.slug}-3.svg`,
    ];

    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        description: p.description,
        price: p.price,
        compareAtPrice: p.compareAtPrice,
        image: images[0],
        images: JSON.stringify(images),
        collection: p.collection,
        style: p.style,
        season: p.season,
        shapes: JSON.stringify(p.shapes),
        coverage: p.coverage ?? "Full Cover",
        featured: !!p.featured,
      },
      create: {
        slug: p.slug,
        name: p.name,
        description: p.description,
        price: p.price,
        compareAtPrice: p.compareAtPrice,
        image: images[0],
        images: JSON.stringify(images),
        collection: p.collection,
        style: p.style,
        season: p.season,
        shapes: JSON.stringify(p.shapes),
        coverage: p.coverage ?? "Full Cover",
        featured: !!p.featured,
        stock: 100,
      },
    });

    const existingReviews = await prisma.review.count({ where: { productId: product.id } });
    if (existingReviews === 0) {
      const count = 3 + Math.floor(Math.random() * 3);
      for (let i = 0; i < count; i++) {
        await prisma.review.create({
          data: {
            productId: product.id,
            name: rand(REVIEW_NAMES),
            rating: Math.random() < 0.75 ? 5 : 4,
            title: rand(REVIEW_TITLES),
            body: rand(REVIEW_BODIES),
            verified: true,
          },
        });
      }
    }
  }

  console.log(`Seeded ${PRODUCTS.length} products with reviews.`);
  console.log(`Nail shapes available: ${NAIL_SHAPES.length}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

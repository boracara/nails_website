# Blush & Bloom — Press-On Nails E-Commerce

A full storefront for a US-based press-on nails business, built with Next.js (App
Router), Prisma/SQLite, NextAuth, Stripe, and PayPal.

## Features

- Product catalog with 10 seeded sets (placeholder photos — see below), filterable
  by collection (Summer Collection, Solid Color, Designs, Wedding, Kids Nails),
  season, style, and all 13 nail shapes
- Product pages with shape/size selectors, an mm-based size chart modal, reviews,
  wishlist, and related products
- Cart with promo codes: `WELCOME15` (15% off first order) and `BUY3GET1` (buy 3,
  get 1 free)
- First-visit popup promoting 15% off + buy-3-get-1, and a rotating announcement bar
- Account creation/login (email + password via NextAuth), order history, wishlist
- Checkout with Stripe Checkout (card, Apple Pay, Google Pay) and PayPal, plus a
  demo mode that completes orders even before real payment keys are configured
- Gift cards (any amount, emailed code shown on a success page) and a custom design
  request form
- Newsletter signup, customer reviews with a submission form, and footer payment
  icons (Visa, Mastercard, Amex, Discover, PayPal, Apple Pay, Google Pay)

## Getting Started

```bash
npm install
npm run db:setup   # creates the SQLite database and seeds 10 products + reviews
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

Copy `.env.example` to `.env` (already done in this repo for local development) and fill in:

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | SQLite file path (defaults to `file:./dev.db`) |
| `AUTH_SECRET` | Random secret for NextAuth session signing |
| `STRIPE_SECRET_KEY` / `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | From your [Stripe test dashboard](https://dashboard.stripe.com/test/apikeys). Without these, checkout runs in **demo mode**: orders are recorded as paid immediately so you can test the full flow. |
| `NEXT_PUBLIC_PAYPAL_CLIENT_ID` | From your [PayPal developer dashboard](https://developer.paypal.com/dashboard/applications). Defaults to PayPal's public sandbox client id (`sb`) so the button works out of the box in testing. |

No email service is configured, so gift card codes and order confirmations are
shown on-screen rather than emailed — wire up a provider (Resend, Postmark, SES)
when you're ready to go live.

## Placeholder Images

All 10 products, the homepage hero, and the size-guide illustration currently use
generated placeholder SVGs (`public/products/*.svg`, `public/hero/*.svg`) so the
site is fully browsable before real photography is ready. Regenerate them anytime
with:

```bash
npm run gen:placeholders
```

To swap in real photos, replace the files referenced by each product's `images`
field in `prisma/seed.ts` (or update the DB directly) with real image paths/URLs.

## Useful Scripts

- `npm run db:push` — sync the Prisma schema to the database
- `npm run db:seed` — reseed products/reviews
- `npm run db:setup` — push + seed in one step
- `npm run lint` — ESLint
- `npm run build` — production build

## Tech Stack

Next.js 16 (App Router, TypeScript) · Tailwind CSS v4 · Prisma + SQLite ·
NextAuth v5 (credentials) · Zustand (cart/wishlist) · Stripe · PayPal JS SDK

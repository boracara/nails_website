"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { useCartStore, cartCount } from "@/lib/cart-store";
import { useWishlistStore } from "@/lib/wishlist-store";
import { COLLECTIONS, NAIL_SHAPES, collectionHref, shapeHref } from "@/lib/nav";
import AnnouncementBar from "./AnnouncementBar";

const NAV_LINKS = [
  { label: "Shop All", href: "/shop" },
  { label: "Size Guide", href: "/size-guide" },
  { label: "Custom Designs", href: "/custom-designs" },
  { label: "Gift Cards", href: "/gift-cards" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const items = useCartStore((s) => s.items);
  const setCartOpen = useCartStore((s) => s.setOpen);
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const { data: session } = useSession();
  const count = cartCount(items);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-brand-100">
      <AnnouncementBar />
      <div className="mx-auto max-w-7xl px-4">
        <div className="h-16 flex items-center justify-between gap-4">
          <button
            className="lg:hidden p-2 -ml-2"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>

          <Link href="/" className="font-display text-2xl sm:text-3xl tracking-wide text-brand-800">
            Blush &amp; Bloom
          </Link>

          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-brand-900">
            <div
              className="relative"
              onMouseEnter={() => setShopOpen(true)}
              onMouseLeave={() => setShopOpen(false)}
            >
              <Link href="/shop" className="hover:text-brand-600 transition-colors">
                Shop
              </Link>
              {shopOpen && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full pt-4 w-[560px]">
                  <div className="bg-white rounded-2xl shadow-xl border border-brand-100 p-6 grid grid-cols-2 gap-8">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-brand-400 mb-3">
                        Collections
                      </p>
                      <ul className="space-y-2">
                        {COLLECTIONS.map((c) => (
                          <li key={c}>
                            <Link href={collectionHref(c)} className="hover:text-brand-600">
                              {c}
                            </Link>
                          </li>
                        ))}
                        <li>
                          <Link href="/shop" className="text-brand-500 hover:text-brand-700">
                            View all sets →
                          </Link>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-brand-400 mb-3">
                        Shop by Nail Shape
                      </p>
                      <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-[13px]">
                        {NAIL_SHAPES.slice(0, 8).map((s) => (
                          <li key={s}>
                            <Link href={shapeHref(s)} className="hover:text-brand-600">
                              {s}
                            </Link>
                          </li>
                        ))}
                      </ul>
                      <Link href="/size-guide" className="inline-block mt-3 text-brand-500 hover:text-brand-700 text-[13px]">
                        See full size guide →
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {NAV_LINKS.slice(1).map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-brand-600 transition-colors">
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1 sm:gap-3">
            <Link
              href="/shop"
              className="hidden sm:inline-flex p-2 hover:text-brand-600"
              aria-label="Search products"
            >
              <Search size={20} />
            </Link>
            {session ? (
              <div className="relative group">
                <Link href="/account" className="p-2 hover:text-brand-600 inline-flex" aria-label="Account">
                  <User size={20} />
                </Link>
                <div className="absolute right-0 top-full pt-2 hidden group-hover:block">
                  <div className="bg-white shadow-xl border border-brand-100 rounded-xl p-3 w-48 text-sm">
                    <p className="px-2 py-1 text-brand-400 text-xs truncate">{session.user?.email}</p>
                    <Link href="/account" className="block px-2 py-1.5 rounded-lg hover:bg-brand-50">
                      My Account
                    </Link>
                    <Link href="/account/wishlist" className="block px-2 py-1.5 rounded-lg hover:bg-brand-50">
                      Wishlist
                    </Link>
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-brand-50 text-brand-600"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link href="/account/login" className="p-2 hover:text-brand-600 inline-flex" aria-label="Account">
                <User size={20} />
              </Link>
            )}
            <Link href="/account/wishlist" className="relative p-2 hover:text-brand-600 inline-flex" aria-label="Wishlist">
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-brand-600 text-white text-[10px] leading-none rounded-full h-4 w-4 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2 hover:text-brand-600"
              aria-label="Cart"
            >
              <ShoppingBag size={20} />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-brand-600 text-white text-[10px] leading-none rounded-full h-4 w-4 flex items-center justify-center">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72 bg-white shadow-xl p-6 flex flex-col gap-1">
            <div className="flex items-center justify-between mb-4">
              <span className="font-display text-xl text-brand-800">Menu</span>
              <button onClick={() => setMobileOpen(false)} aria-label="Close menu">
                <X size={22} />
              </button>
            </div>
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="py-2.5 text-brand-900 border-b border-brand-50 text-sm font-medium"
              >
                {l.label}
              </Link>
            ))}
            <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-brand-400">
              Collections
            </p>
            {COLLECTIONS.map((c) => (
              <Link
                key={c}
                href={collectionHref(c)}
                onClick={() => setMobileOpen(false)}
                className="py-2 text-sm text-brand-800"
              >
                {c}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

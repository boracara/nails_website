import Link from "next/link";
import NewsletterForm from "./NewsletterForm";
import PaymentIcons from "./PaymentIcons";
import { COLLECTIONS } from "@/lib/nav";

export default function Footer() {
  return (
    <footer className="bg-brand-900 text-brand-100 mt-24">
      <div className="mx-auto max-w-7xl px-4 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
        <div className="lg:col-span-2">
          <p className="font-display text-2xl text-white mb-3">Blush &amp; Bloom</p>
          <p className="text-sm text-brand-200 max-w-xs mb-4">
            Salon-quality press-on nails, designed and shipped from the USA. Reusable, damage-free,
            and ready in under 15 minutes.
          </p>
          <p className="text-xs uppercase tracking-widest text-brand-300 mb-2">Join the list</p>
          <NewsletterForm dark />
          <p className="text-xs text-brand-300 mt-2">15% off your first order, unsubscribe anytime.</p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-widest text-brand-300 mb-3">Shop</p>
          <ul className="space-y-2 text-sm">
            <li><Link href="/shop" className="hover:text-white">All Products</Link></li>
            {COLLECTIONS.map((c) => (
              <li key={c}>
                <Link href={`/shop?collection=${encodeURIComponent(c)}`} className="hover:text-white">
                  {c}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs uppercase tracking-widest text-brand-300 mb-3">Help</p>
          <ul className="space-y-2 text-sm">
            <li><Link href="/size-guide" className="hover:text-white">Size Guide</Link></li>
            <li><Link href="/custom-designs" className="hover:text-white">Custom Designs</Link></li>
            <li><Link href="/gift-cards" className="hover:text-white">Gift Cards</Link></li>
            <li><Link href="/account" className="hover:text-white">My Account</Link></li>
            <li><Link href="/account/wishlist" className="hover:text-white">Wishlist</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-xs uppercase tracking-widest text-brand-300 mb-3">Follow Us</p>
          <div className="flex gap-3 mb-6">
            <a
              href="#"
              aria-label="Instagram"
              className="h-9 w-9 flex items-center justify-center bg-white/10 rounded-full hover:bg-white/20 text-xs font-semibold"
            >
              IG
            </a>
            <a
              href="#"
              aria-label="TikTok"
              className="h-9 w-9 flex items-center justify-center bg-white/10 rounded-full hover:bg-white/20 text-xs font-semibold"
            >
              TT
            </a>
            <a
              href="#"
              aria-label="Facebook"
              className="h-9 w-9 flex items-center justify-center bg-white/10 rounded-full hover:bg-white/20 text-xs font-semibold"
            >
              FB
            </a>
          </div>
          <p className="text-xs uppercase tracking-widest text-brand-300 mb-3">We Accept</p>
          <PaymentIcons />
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-brand-300">
          <p>© {new Date().getFullYear()} Blush &amp; Bloom Nails. All rights reserved. Made in the USA.</p>
          <div className="flex gap-4">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Shipping &amp; Returns</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

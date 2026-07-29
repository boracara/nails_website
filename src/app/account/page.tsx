import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import SignOutButton from "@/components/SignOutButton";

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user) redirect("/account/login?callbackUrl=/account");

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-14">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl text-brand-900">My Account</h1>
          <p className="text-brand-500 text-sm mt-1">
            {session.user.name} · {session.user.email}
          </p>
        </div>
        <SignOutButton />
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        <Link href="/account/wishlist" className="rounded-2xl border border-brand-100 p-5 hover:border-brand-300 transition-colors">
          <p className="font-semibold text-brand-900">My Wishlist</p>
          <p className="text-sm text-brand-500 mt-1">View items you&apos;ve saved for later.</p>
        </Link>
        <Link href="/shop" className="rounded-2xl border border-brand-100 p-5 hover:border-brand-300 transition-colors">
          <p className="font-semibold text-brand-900">Continue Shopping</p>
          <p className="text-sm text-brand-500 mt-1">Browse the latest press-on nail sets.</p>
        </Link>
      </div>

      <h2 className="font-display text-2xl text-brand-900 mb-4">Order History</h2>
      {orders.length === 0 ? (
        <p className="text-brand-400 text-sm">You haven&apos;t placed any orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => {
            const items = JSON.parse(o.items) as { name: string; qty: number }[];
            return (
              <div key={o.id} className="border border-brand-100 rounded-2xl p-5">
                <div className="flex justify-between flex-wrap gap-2">
                  <div>
                    <p className="font-semibold text-brand-900 text-sm">Order #{o.id.slice(-8).toUpperCase()}</p>
                    <p className="text-xs text-brand-400">
                      {new Date(o.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                    </p>
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wide bg-brand-50 text-brand-700 px-3 py-1 rounded-full h-fit">
                    {o.status}
                  </span>
                </div>
                <ul className="text-sm text-brand-600 mt-3 space-y-1">
                  {items.map((it, i) => (
                    <li key={i}>
                      {it.qty} × {it.name}
                    </li>
                  ))}
                </ul>
                <p className="text-sm font-semibold text-brand-900 mt-3">Total: ${o.total.toFixed(2)}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

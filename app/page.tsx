import Script from "next/script";
import { CART, TOTAL } from "@/lib/midtrans";
import CheckoutForm from "./checkout-form";

// Read MIDTRANS_CLIENT_KEY at request time, not build time.
export const dynamic = "force-dynamic";

const rp =(n: number) => `Rp${n.toLocaleString("id-ID")}`;

export default function Home() {
  const rows = [
    [CART.menu, CART.price],
    ["Biaya Admin", CART.adminFee],
    ["Ongkir", CART.shippingFee],
  ] as const;

  return (
    <main className="mx-auto max-w-md space-y-6 p-6">
      <Script src="https://app.sandbox.midtrans.com/snap/snap.js" data-client-key={process.env.MIDTRANS_CLIENT_KEY} />
      <h1 className="text-2xl font-bold">Keranjang</h1>

      <section className="rounded-lg border border-stone-200 bg-white p-4">
        {rows.map(([label, amount]) => (
          <div key={label} className="flex justify-between py-1">
            <span>{label}</span>
            <span>{rp(amount)}</span>
          </div>
        ))}
        <div className="mt-2 flex justify-between border-t border-stone-200 pt-2 font-bold">
          <span>Total</span>
          <span>{rp(TOTAL)}</span>
        </div>
      </section>

      <CheckoutForm />
    </main>
  );
}

import { prisma } from "@/lib/prisma";

// Always read fresh from DB so a refresh shows the latest status.
export const dynamic = "force-dynamic";

const rp = (n: number) => `Rp${n.toLocaleString("id-ID")}`;

export default async function Admin() {
  const orders = await prisma.order.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <main className="p-6">
      <h1 className="mb-4 text-2xl font-bold">Daftar Order</h1>
      <table className="w-full border-collapse bg-white text-sm">
        <thead>
          <tr className="bg-stone-100 text-left">
            {["Order ID", "Nama Customer", "Detail Pesanan", "Total Harga", "Status"].map((h) => (
              <th key={h} className="border border-stone-200 p-2">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td className="border border-stone-200 p-2 font-mono">{o.id}</td>
              <td className="border border-stone-200 p-2">{o.customerName}</td>
              <td className="border border-stone-200 p-2">
                {o.orderDetails}
                <br />Biaya Admin: {rp(o.adminFee)}
                <br />Ongkir: {rp(o.shippingFee)}
              </td>
              <td className="border border-stone-200 p-2">{rp(o.totalAmount)}</td>
              <td className="border border-stone-200 p-2">
                <span className={`rounded px-2 py-1 font-semibold ${o.status === "Paid" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                  {o.status}
                </span>
              </td>
            </tr>
          ))}
          {!orders.length && (
            <tr>
              <td colSpan={5} className="p-4 text-center text-stone-500">Belum ada order.</td>
            </tr>
          )}
        </tbody>
      </table>
    </main>
  );
}

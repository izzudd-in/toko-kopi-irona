import { prisma } from "@/lib/prisma";
import { snap, CART, TOTAL } from "@/lib/midtrans";

export async function POST(req: Request) {
  const { name, email, phone, address } = await req.json();
  if (![name, email, phone, address].every((v) => typeof v === "string" && v.trim()) || !email.includes("@")) {
    return Response.json({ error: "Data checkout tidak lengkap" }, { status: 400 });
  }

  const order = await prisma.order.create({
    data: {
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      address,
      orderDetails: CART.menu,
      adminFee: CART.adminFee,
      shippingFee: CART.shippingFee,
      totalAmount: TOTAL,
    },
  });

  try {
    const { token } = await snap.createTransaction({
      transaction_details: { order_id: order.id, gross_amount: TOTAL },
      item_details: [
        { id: "kopi-a", name: CART.menu, price: CART.price, quantity: 1 },
        { id: "admin", name: "Biaya Admin", price: CART.adminFee, quantity: 1 },
        { id: "ongkir", name: "Ongkir", price: CART.shippingFee, quantity: 1 },
      ],
      customer_details: { first_name: name, email, phone, shipping_address: { address } },
    });
    return Response.json({ orderId: order.id, snapToken: token });
  } catch (e) {
    console.error("Midtrans error:", e);
    return Response.json({ error: "Gagal membuat transaksi Midtrans. Cek MIDTRANS_SERVER_KEY." }, { status: 502 });
  }
}

import nodemailer from "nodemailer";
import { prisma } from "@/lib/prisma";
import { snap } from "@/lib/midtrans";

// jsonTransport = Nodemailer builds the email but never sends it.
const mailer = nodemailer.createTransport({ jsonTransport: true });

async function sendReceiptEmail(to: string, orderId: string, total: number) {
  await mailer.sendMail({
    from: "Toko Kopi Irona <no-reply@irona.test>",
    to,
    subject: `Resi pembayaran ${orderId}`,
    text: `Pembayaran Rp${total.toLocaleString("id-ID")} untuk order ${orderId} berhasil.`,
  });
  console.log(`Email resi terkirim ke ${to}`);
}

export async function POST(req: Request) {
  const { orderId } = await req.json();
  if (typeof orderId !== "string") return Response.json({ error: "orderId wajib" }, { status: 400 });

  // Browser callback can be forged; ask Midtrans for the real status before marking Paid.
  const tx = await snap.transaction.status(orderId).catch(() => null);
  const paid = tx?.transaction_status === "settlement" || (tx?.transaction_status === "capture" && tx?.fraud_status === "accept");
  if (!paid) return Response.json({ error: "Pembayaran belum terverifikasi" }, { status: 402 });

  // Only the Unpaid -> Paid transition sends the email, so repeat calls stay idempotent.
  const { count } = await prisma.order.updateMany({ where: { id: orderId, status: "Unpaid" }, data: { status: "Paid" } });
  if (count) {
    const order = await prisma.order.findUniqueOrThrow({ where: { id: orderId } });
    await sendReceiptEmail(order.customerEmail, order.id, order.totalAmount);
  }
  return Response.json({ status: "Paid" });
}

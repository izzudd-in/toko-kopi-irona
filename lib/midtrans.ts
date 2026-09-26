import midtransClient from "midtrans-client";

// Sandbox mode. Snap instance also exposes transaction.status() for server-side verification.
export const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY!,
  clientKey: process.env.MIDTRANS_CLIENT_KEY!,
});

// Hardcoded cart. Server is the source of truth for prices, never the browser.
export const CART = {
  menu: "Pesan Kopi A",
  price: 40000,
  adminFee: 1000,
  shippingFee: 9000,
};
export const TOTAL = CART.price + CART.adminFee + CART.shippingFee;

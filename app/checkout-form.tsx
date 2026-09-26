"use client";

import { useState } from "react";

type SnapCallbacks = { onSuccess?: () => void; onPending?: () => void; onError?: () => void; onClose?: () => void };
declare global {
  interface Window {
    snap: { pay: (token: string, callbacks: SnapCallbacks) => void };
  }
}

const fields = [
  { name: "name", label: "Nama", type: "text" },
  { name: "email", label: "Email", type: "email" },
  { name: "phone", label: "No. WhatsApp", type: "tel" },
  { name: "address", label: "Alamat", type: "text" },
];

export default function CheckoutForm() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function checkout(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(new FormData(e.currentTarget))),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) return setMessage(data.error);

    window.snap.pay(data.snapToken, {
      onSuccess: async () => {
        const r = await fetch("/api/update-status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId: data.orderId }),
        });
        setMessage(r.ok ? `Pembayaran berhasil! Order ${data.orderId} sudah Paid.` : (await r.json()).error);
      },
      onPending: () => setMessage("Menunggu pembayaran..."),
      onError: () => setMessage("Pembayaran gagal."),
      onClose: () => setMessage("Pop-up ditutup sebelum pembayaran selesai."),
    });
  }

  return (
    <form onSubmit={checkout} className="space-y-3 rounded-lg border border-stone-200 bg-white p-4">
      <h2 className="text-lg font-semibold">Checkout</h2>
      {fields.map((f) => (
        <label key={f.name} className="block text-sm">
          {f.label}
          <input name={f.name} type={f.type} required className="mt-1 w-full rounded border border-stone-300 px-3 py-2" />
        </label>
      ))}
      <button disabled={loading} className="w-full rounded bg-amber-800 py-2 font-semibold text-white disabled:opacity-50">
        {loading ? "Memproses..." : "Checkout"}
      </button>
      {message && <p className="text-sm" role="status">{message}</p>}
    </form>
  );
}

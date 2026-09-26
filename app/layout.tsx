import "./globals.css";

export const metadata = { title: "Toko Kopi Irona" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="bg-stone-50 text-stone-900 antialiased">{children}</body>
    </html>
  );
}

// src/app/carapesan/page.tsx

import Navbar from "@/components/Navbar";

export default function CaraPesan() {
  return (
    <div className="bg-[#FFF8EF] min-h-screen">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-4 text-[#F7931A]">Cara Pemesanan</h1>
        <ol className="list-decimal pl-6 space-y-2 text-gray-700">
          <li>Pilih produk yang kamu inginkan dan klik tombol <b>Pesan</b>.</li>
          <li>Hubungi admin via WhatsApp untuk konfirmasi dan pembayaran.</li>
          <li>Admin akan memproses pesanan kamu secepatnya.</li>
          <li>Produk digital akan dikirim ke email/akun yang kamu daftarkan.</li>
        </ol>
      </main>
    </div>
  );
}

'use client'
import { useSearchParams } from 'next/navigation'
import React, { useMemo, useState, useEffect } from 'react'
import { PRODUCT_CATEGORIES } from '@/lib/products'
import Image from "next/image"

const ALL_PRODUCTS = PRODUCT_CATEGORIES.flatMap(category => category.products)

type PaymentResult = {
  qr_url: string;
  expiredAt?: string;
  paymenturl: string;
  [key: string]: unknown;
};

function fee(amount: number): number {
  return Math.round(amount * 0.0039);
}

export default function CheckoutContent() {
  const params = useSearchParams();
  const productId = params?.get('product') || ALL_PRODUCTS[0].id;

  const selectedProduct = useMemo(
    () => ALL_PRODUCTS.find(p => p.id === productId) || ALL_PRODUCTS[0],
    [productId]
  );

  const [typeId, setTypeId] = useState(
    params?.get('type') || selectedProduct.types[0].id
  );

  useEffect(() => {
    setTypeId(selectedProduct.types[0].id);
  }, [selectedProduct]);

  const selectedType = useMemo(
    () => selectedProduct.types.find(t => t.id === typeId) || selectedProduct.types[0],
    [selectedProduct, typeId]
  );

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PaymentResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: selectedType.price,
          method: 'qris',
          email: email || undefined
        })
      });
      const data = await res.json();
      if (data.success) setResult(data);
      else setError(data.message || 'Gagal membuat transaksi');
    } catch {
      setError('Terjadi error jaringan');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center pt-12">
      <h1 className="text-2xl font-bold text-[#F7931A] mb-4">Checkout</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-[#232323] p-8 rounded-xl shadow-xl flex flex-col gap-5 w-full max-w-md"
      >
        {/* Info Produk */}
        <div className="bg-[#383838] rounded-lg p-4 mb-3 text-white">
          <div className="font-bold text-lg text-[#F7931A]">
            Produk: <span className="text-white">{selectedProduct.name}</span>
          </div>
        </div>
        {/* Pilihan type */}
        <label className="text-[#F7931A] font-semibold">Tipe</label>
        <select
          className="px-3 py-2 rounded bg-black text-white border border-[#F7931A]/40"
          value={typeId}
          onChange={e => setTypeId(e.target.value)}
        >
          {selectedProduct.types.map((t) => (
            <option key={t.id} value={t.id}>
              {t.type}
            </option>
          ))}
        </select>
        {/* Ringkasan harga */}
        <div className="bg-[#383838] rounded-lg p-4 mb-3 text-white">
          <div className="font-semibold text-[#F7931A]">
            Harga: <span className="text-white">
              Rp {selectedType.price.toLocaleString()}
              {selectedType.subtitle && <span className="ml-1 text-xs text-gray-400">{selectedType.subtitle}</span>}
            </span>
          </div>
        </div>
        {/* Email */}
        <label className="text-[#F7931A] font-semibold">Email Bukti Pembelian (opsional)</label>
        <input
          type="email"
          className="px-3 py-2 rounded bg-black text-white border border-[#F7931A]/40"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Kosongkan jika tidak ingin bukti ke email"
        />
        {/* Payment method hanya QRIS */}
        <label className="text-[#F7931A] font-semibold">Metode Pembayaran</label>
        <input
          type="text"
          value="QRIS (Semua Bank/E-wallet)"
          disabled
          className="px-3 py-2 rounded bg-black text-white border border-[#F7931A]/40 opacity-60"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-[#F7931A] text-white font-bold py-3 rounded-lg hover:bg-orange-500 mt-2"
        >
          {loading ? 'Memproses...' : 'Bayar Sekarang'}
        </button>
      </form>
      {/* Hasil transaksi */}
      {error && <div className="mt-5 text-red-500">{error}</div>}
      {result && (
        <div className="mt-8 bg-white p-5 rounded-lg max-w-md w-full shadow">
          <div className="text-[#F7931A] font-bold mb-3 text-center">
            QRIS Pembayaran
          </div>
          <Image
            src={result.qr_url}
            alt="QRIS"
            width={208}
            height={208}
            className="w-52 h-52 object-contain rounded-lg border mx-auto"
          />
          <div className="mt-5 text-[#232323] text-base">
            <div className="mb-2">
              <span className="font-semibold text-[#F7931A]">Nama Produk:</span>{" "}
              {selectedProduct.name}
            </div>
            <div className="mb-2">
              <span className="font-semibold text-[#F7931A]">Tipe:</span>{" "}
              {selectedType.type}
            </div>
            <div className="mb-2">
              <span className="font-semibold text-[#F7931A]">Harga:</span>{" "}
              Rp {selectedType.price.toLocaleString()}
            </div>
            <div className="mb-2">
              <span className="font-semibold text-[#F7931A]">Pembayaran via:</span>{" "}
              QRIS (semua e-wallet/bank)
            </div>
            <div className="mb-2">
              <span className="font-semibold text-[#F7931A]">Fee:</span>{" "}
              Rp {fee(selectedType.price).toLocaleString()}
            </div>
            <div className="mb-2">
              <span className="font-semibold text-[#F7931A]">Total Bayar:</span>{" "}
              <b>
                Rp {(selectedType.price + fee(selectedType.price)).toLocaleString()}
              </b>
            </div>
            <div className="mb-2 text-xs text-gray-500">
              <span className="font-semibold">Expired:</span>{" "}
              {result.expiredAt && new Date(result.expiredAt).toLocaleString()}
            </div>
          </div>
          <div className="text-xs text-gray-500 mt-2 text-center">
            * Bukti akan dikirim ke email: <b>{email || "(tidak dikirim)"}</b>
          </div>
        </div>
      )}
    </div>
  );
}

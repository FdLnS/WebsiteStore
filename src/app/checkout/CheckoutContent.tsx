// src/app/checkout/CheckoutContent.tsx

"use client";
import { useSearchParams } from "next/navigation";
import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";

// --- Ganti URL Sheet sesuai yang kamu pakai!
const SHEET_URL =
  "https://gsx2json.com/api?id=1q9C9FtdXKOihpzjysQlDB2YTRVpSB8JuMNdVmBAzK6c&sheet=Sheet1";

type ProductType = {
  type_id: string;
  type_name: string;
  price: number;
  subtitle?: string;
};

type Product = {
  product_id: string;
  product_name: string;
  logo?: string;
  types: ProductType[];
};

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
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Untuk form
  const [typeId, setTypeId] = useState<string>("");
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<PaymentResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // --- Fetch produk dari Sheet
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      const res = await fetch(SHEET_URL, { cache: "no-store" });
      const { rows } = await res.json();
      // Group by product_id
      const prodMap: Record<string, Product> = {};
      rows.forEach((row: any) => {
        if (!prodMap[row.product_id]) {
          prodMap[row.product_id] = {
            product_id: row.product_id,
            product_name: row.product_name,
            logo: row.logo,
            types: [],
          };
        }
        prodMap[row.product_id].types.push({
          type_id: row.type_id,
          type_name: row.type_name,
          price: Number(row.price),
          subtitle: row.subtitle,
        });
      });
      setProducts(Object.values(prodMap));
      setLoading(false);
    }
    fetchProducts();
  }, []);

  // --- Get param
  const productId = params?.get("product") || products[0]?.product_id;
  // --- Temukan produk sesuai productId
  const selectedProduct = useMemo(
    () =>
      products.find((p) => p.product_id === productId) ||
      products[0] ||
      {
        product_id: "",
        product_name: "",
        logo: "",
        types: [],
      },
    [productId, products]
  );

  // --- typeId dari param, jika tidak ada pakai default type pertama
  useEffect(() => {
    if (selectedProduct && selectedProduct.types.length > 0) {
      setTypeId(params?.get("type") || selectedProduct.types[0].type_id);
    }
  }, [selectedProduct, params]);

  // --- Temukan tipe produk terpilih
  const selectedType =
    selectedProduct?.types.find((t) => t.type_id === typeId) ||
    selectedProduct?.types[0];

  // --- Handle pembayaran
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selectedType) {
      setError("Tipe produk tidak valid.");
      return;
    }
    setSubmitting(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: selectedType.price,
          method: "qris",
          email: email || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) setResult(data);
      else setError(data.message || "Gagal membuat transaksi");
    } catch {
      setError("Terjadi error jaringan");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white text-lg">
        Memuat data produk...
      </div>
    );
  }

  if (!selectedProduct || !selectedType) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Produk tidak ditemukan.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center pt-12">
      <h1 className="text-2xl font-bold text-[#F7931A] mb-4">Checkout</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-[#232323] p-8 rounded-xl shadow-xl flex flex-col gap-5 w-full max-w-md"
      >
        {/* Info Produk */}
        <div className="bg-[#383838] rounded-lg p-4 mb-3 text-white flex items-center gap-4">
          {selectedProduct.logo && (
            <Image
              src={selectedProduct.logo}
              alt={selectedProduct.product_name}
              width={48}
              height={48}
              className="w-12 h-12 rounded-lg object-contain border border-[#F7931A]/20 bg-[#FFF8EF]"
            />
          )}
          <div className="font-bold text-lg text-[#F7931A]">
            {selectedProduct.product_name}
          </div>
        </div>
        {/* Pilihan type */}
        <label className="text-[#F7931A] font-semibold">Tipe</label>
        <select
          className="px-3 py-2 rounded bg-black text-white border border-[#F7931A]/40"
          value={typeId}
          onChange={(e) => setTypeId(e.target.value)}
        >
          {selectedProduct.types.map((t) => (
            <option key={t.type_id} value={t.type_id}>
              {t.type_name}
            </option>
          ))}
        </select>
        {/* Ringkasan harga */}
        <div className="bg-[#383838] rounded-lg p-4 mb-3 text-white">
          <div className="font-semibold text-[#F7931A]">
            Harga:{" "}
            <span className="text-white">
              Rp {selectedType.price.toLocaleString()}
              {selectedType.subtitle && (
                <span className="ml-1 text-xs text-gray-400">
                  {selectedType.subtitle}
                </span>
              )}
            </span>
          </div>
        </div>
        {/* Email */}
        <label className="text-[#F7931A] font-semibold">
          Email Bukti Pembelian (opsional)
        </label>
        <input
          type="email"
          className="px-3 py-2 rounded bg-black text-white border border-[#F7931A]/40"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Kosongkan jika tidak ingin bukti ke email"
        />
        {/* Payment method hanya QRIS */}
        <label className="text-[#F7931A] font-semibold">
          Metode Pembayaran
        </label>
        <input
          type="text"
          value="QRIS (Semua Bank/E-wallet)"
          disabled
          className="px-3 py-2 rounded bg-black text-white border border-[#F7931A]/40 opacity-60"
        />
        <button
          type="submit"
          disabled={submitting}
          className="bg-[#F7931A] text-white font-bold py-3 rounded-lg hover:bg-orange-500 mt-2"
        >
          {submitting ? "Memproses..." : "Bayar Sekarang"}
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
              {selectedProduct.product_name}
            </div>
            <div className="mb-2">
              <span className="font-semibold text-[#F7931A]">Tipe:</span>{" "}
              {selectedType.type_name}
            </div>
            <div className="mb-2">
              <span className="font-semibold text-[#F7931A]">Harga:</span>{" "}
              Rp {selectedType.price.toLocaleString()}
            </div>
            <div className="mb-2">
              <span className="font-semibold text-[#F7931A]">
                Pembayaran via:
              </span>{" "}
              QRIS (semua e-wallet/bank)
            </div>
            <div className="mb-2">
              <span className="font-semibold text-[#F7931A]">Fee:</span>{" "}
              Rp {fee(selectedType.price).toLocaleString()}
            </div>
            <div className="mb-2">
              <span className="font-semibold text-[#F7931A]">
                Total Bayar:
              </span>{" "}
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

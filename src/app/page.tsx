// src/app/page.tsx

"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";
import { PRODUCT_CATEGORIES } from "@/lib/products";
import Footer from "@/components/Footer";

export default function Home() {
  const [search, setSearch] = useState("");

  return (
    <div className="bg-[#FFF8EF] min-h-screen">
      <Navbar search={search} setSearch={setSearch} />
      <main className="max-w-6xl mx-auto px-2 pb-10">
        <h1 className="text-3xl font-bold text-[#F7931A] text-center my-6">
          Berlangganan Produk Digital
        </h1>
        {/* Loop kategori */}
        {PRODUCT_CATEGORIES.map((category) => {
          // Filter produk di kategori berdasarkan pencarian
          const filtered = category.products.filter((p) =>
            p.name.toLowerCase().includes(search.toLowerCase())
          );
          if (filtered.length === 0) return null;
          return (
            <div key={category.id} className="mb-10">
              <h2 className="text-2xl font-bold text-[#F7931A] flex items-center mb-2">
                <span className="mr-2">|</span> {category.name}
              </h2>
              {/* SLIDER */}
              <div className="flex gap-6 overflow-x-auto pb-3 scrollbar-thin">
                {filtered.map((p) => (
                  <div
                    key={p.id}
                    className="bg-white min-w-[200px] w-[200px] flex-shrink-0 rounded-2xl shadow-lg p-6 flex flex-col items-center transition-all duration-200 hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.03]"
                  >
                    {/* Logo produk */}
                    {p.logo && (
                      <Image
                        src={p.logo}
                        alt={p.name}
                        width={64}
                        height={64}
                        className="w-32 h-32 mb-3 rounded-lg object-contain border-2 border-[#F7931A]/10 bg-[#FFF8EF] shadow-sm"
                      />
                    )}
                    <div className="font-bold text-lg text-[#F7931A] mb-2">{p.name}</div>
                    <div className="w-full">
                      {p.types.map((t) => (
                        <div
                          key={t.id}
                          className="flex items-center justify-between gap-2 w-full mb-2"
                        >
                          <span className="text-gray-600 text-xs">{t.type}</span>
                          <span className="font-semibold text-[#F7931A] text-xs">
                            Rp {t.price.toLocaleString()}
                            {t.subtitle && <span className="ml-1 text-xs text-gray-500">{t.subtitle}</span>}
                          </span>
                          {t.label && (
                            <span className="bg-[#FFF2D9] text-[#F7931A] px-2 py-1 rounded text-xs">
                              {t.label}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                    <Link
                      href={`/checkout?product=${p.id}&type=${p.types[0].id}`}
                      className="mt-3 w-full bg-[#F7931A] hover:bg-orange-500 text-white font-bold py-2 rounded-lg transition text-center"
                    >
                      Pesan
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </main>
      <Footer />
    </div>
  );
}

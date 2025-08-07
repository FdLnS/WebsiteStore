"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { fetchProductsFromSheet, groupProducts } from "@/lib/fetchProductsFromSheet";
import BannerSlider from "@/components/BannerSlider";

export default function Home() {
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    fetchProductsFromSheet().then((rows) => {
      setCategories(groupProducts(rows));
    });
  }, []);

  return (
    <div className="bg-[#FFF8EF] min-h-screen">
      <Navbar search={search} setSearch={setSearch} />
      <main className="max-w-6xl mx-auto px-2 pb-10 pt-5">
        <BannerSlider />
        <h1 className="text-3xl font-bold text-[#F7931A] text-center my-4">
          Berlangganan Produk Digital
        </h1>
        {categories.map((category: any) => {
          // Filter produk per kategori berdasarkan search
          const filtered = category.products.filter((p: any) =>
            p.product_name.toLowerCase().includes(search.toLowerCase())
          );
          if (filtered.length === 0) return null;
          return (
            <div key={category.category_id} className="mb-10">
              <h2 className="text-2xl font-bold text-[#F7931A] flex items-center mb-2">
                <span className="mr-2">|</span> {category.category_name}
              </h2>
              <div className="flex gap-6 overflow-x-auto pb-3 scrollbar-thin">
                {filtered.map((p: any) => (
                  <div
                    key={p.product_id}
                    className="bg-white min-w-[200px] w-[200px] flex-shrink-0 rounded-2xl shadow-lg p-6 flex flex-col items-center transition-all duration-200 hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.03]"
                  >
                    {p.logo && (
                      <Image
                        src={p.logo}
                        alt={p.product_name}
                        width={64}
                        height={64}
                        className="w-32 h-32 mb-3 rounded-lg object-contain border-2 border-[#F7931A]/10 bg-[#FFF8EF] shadow-sm"
                      />
                    )}
                    <div className="font-bold text-lg text-[#F7931A] mb-2 text-center">{p.product_name}</div>
                    <Link
                      href={`/checkout?product=${p.product_id}&type=${p.types[0].type_id}`}
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

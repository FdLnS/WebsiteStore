'use client';
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Hamburger from "@/components/Hamburger";
import { useDelayedUnmount } from "@/lib/useDelayedUnmount";

// --- Tipe props dibuat optional ---
type NavbarProps = {
  search?: string;
  setSearch?: (v: string) => void;
};

export default function Navbar({ search, setSearch }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const shouldShowDrawer = useDelayedUnmount(menuOpen, 300);

  return (
    <header className="bg-white shadow-sm w-full sticky top-0 z-40">
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3">
        {/* Logo + Nama */}
        <div className="flex items-center gap-2">
          <Image
            src="/logo.jpg"
            alt="Logo"
            width={36}
            height={36}
            className="w-9 h-9 rounded-full object-cover border-2 border-[#F7931A]/40 bg-[#FFF8EF]"
            priority
          />
          <span className="text-lg sm:text-xl font-bold text-[#F7931A] whitespace-nowrap">FDLN STORE</span>
        </div>

        {/* Desktop: Menu + Search */}
        <div className="hidden md:flex items-center gap-4">
          {/* Hanya tampil jika ada search & setSearch */}
          {typeof search === "string" && setSearch && (
            <input
              type="text"
              placeholder="Cari produk"
              className="border border-[#F7931A]/30 rounded-lg px-3 py-2 w-44 text-[#383838] placeholder-gray-400 focus:outline-none focus:border-[#F7931A] transition"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          )}
          <ul className="flex gap-6 font-medium text-gray-700">
            <li>
              <Link href="/" className="hover:text-[#F7931A]">Produk</Link>
            </li>
            <li>
              <Link href="/carapesan" className="hover:text-[#F7931A]">Cara Pesan</Link>
            </li>
            <li>
              <Link href="/testimoni" className="hover:text-[#F7931A]">Testimoni</Link>
            </li>
            <li>
              <a
                href="https://link.gformkamu"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#F7931A]"
              >Laporkan Kendala</a>
            </li>
          </ul>
        </div>

        {/* Mobile: Icon Search & Hamburger */}
        <div className="flex md:hidden gap-2 items-center">
          {typeof search === "string" && setSearch && (
            <button
              aria-label="search"
              className="p-2 rounded-full hover:bg-[#FFF2D9] transition"
              onClick={() => setSearchOpen(true)}
            >
              <svg width="24" height="24" fill="none" stroke="#F7931A" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/></svg>
            </button>
          )}
          <Hamburger open={menuOpen} onClick={() => setMenuOpen((o) => !o)} />
        </div>
      </nav>

      {/* Mobile Search Bar */}
      {searchOpen && typeof search === "string" && setSearch && (
        <div className="md:hidden px-4 py-3 bg-white shadow flex items-center gap-2">
          <button
            className="text-[#F7931A] p-1"
            onClick={() => {
              setSearch(""); // hapus teks pencarian
              setSearchOpen(false); // tutup search bar
            }}
            aria-label="Tutup & hapus pencarian"
          >
            <svg width="24" height="24" fill="none" stroke="#F7931A" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
          <input
            autoFocus
            type="text"
            placeholder="Cari produk"
            className="border border-[#F7931A]/30 rounded-lg px-4 py-2 w-full text-[#383838] placeholder-gray-400 focus:outline-none focus:border-[#F7931A] transition"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      )}

      {/* Mobile Menu Drawer (animated) */}
      {shouldShowDrawer && (
        <>
          <div
            className={`
              fixed top-0 right-0 w-5/6 max-w-xs h-full bg-white shadow-lg z-50
              transform transition-transform duration-300
              ${menuOpen ? 'translate-x-0' : 'translate-x-full'}
            `}
          >
            <div className="flex items-center justify-between py-4 px-4 border-b">
              <span className="font-bold text-[#F7931A] text-lg">Menu</span>
              <Hamburger open={true} onClick={() => setMenuOpen(false)} />
            </div>
            <div className="flex flex-col py-5 px-6 gap-3 font-medium text-gray-700">
              <Link href="/" className="hover:text-[#F7931A]" onClick={()=>setMenuOpen(false)}>Produk</Link>
              <Link href="/carapesan" className="hover:text-[#F7931A]" onClick={()=>setMenuOpen(false)}>Cara Pesan</Link>
              <Link href="/testimoni" className="hover:text-[#F7931A]" onClick={()=>setMenuOpen(false)}>Testimoni</Link>
              <a
                href="https://link.gformkamu"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#F7931A]"
                onClick={()=>setMenuOpen(false)}
              >Laporkan Kendala</a>
            </div>
          </div>
          {/* Overlay */}
          <div
            className={`fixed inset-0 bg-black/10 z-40 transition-opacity duration-300 ${menuOpen ? "opacity-100" : "opacity-0"}`}
            onClick={()=>setMenuOpen(false)}
          />
        </>
      )}
    </header>
  );
}

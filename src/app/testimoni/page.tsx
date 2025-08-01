"use client";
import { useEffect, useState, ChangeEvent } from "react";
import { supabase } from "@/lib/supabaseClient";
import Navbar from "@/components/Navbar";

type Testimoni = {
  id: number;
  name: string;
  message: string;
  image_url: string | null;
  created_at: string;
};

function EmojiGrid({ onPick }: { onPick: (e: string) => void }) {
  const EMOJI_LIST = [
    "👍","🔥","😎","😉","🥰","🤩","🎉","😁","😭","🙌","🙏","🤑"
  ];
  return (
    <div className="bg-white rounded-xl shadow-lg p-2 flex flex-wrap gap-1 max-w-[210px] z-50 border border-[#F7931A]">
      {EMOJI_LIST.map(e => (
        <button
          type="button"
          key={e}
          className="text-2xl hover:bg-[#F7931A]/10 rounded p-1 transition"
          onClick={() => onPick(e)}
        >
          {e}
        </button>
      ))}
    </div>
  );
}

export default function TestimoniPage() {
  const [testimonials, setTestimonials] = useState<Testimoni[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [sending, setSending] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [modalImage, setModalImage] = useState<string | null>(null);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  async function fetchTestimonials() {
    const { data } = await supabase
      .from("testimonials")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setTestimonials(data as Testimoni[]);
  }

  async function uploadImage(file: File) {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const { error } = await supabase.storage
      .from("testimoni")
      .upload(fileName, file, { upsert: true });
    if (error) throw error;
    const { data: publicUrlData } = supabase.storage
      .from("testimoni")
      .getPublicUrl(fileName);
    return publicUrlData.publicUrl;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    let imageUrl = null;
    if (image) {
      imageUrl = await uploadImage(image);
    }
    await supabase.from("testimonials").insert([
      {
        name,
        message,
        image_url: imageUrl,
      },
    ]);
    setSending(false);
    setName("");
    setMessage("");
    setImage(null);
    setShowEmoji(false);
    fetchTestimonials();
  }

  return (
    <div className="bg-[#FFF8EF] min-h-screen">
      <Navbar />
      <main className="max-w-2xl mx-auto px-3 py-8">
        <h1 className="text-2xl font-bold text-[#F7931A] mb-6 text-center">
          Testimoni Pelanggan
        </h1>

        {/* Modal Gambar */}
        {modalImage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
            onClick={() => setModalImage(null)}
          >
            {/* Karena gambar dari supabase (url eksternal), tetap pakai <img> */}
            <img
              src={modalImage}
              alt="Preview"
              className="max-h-[80vh] max-w-[90vw] rounded-lg shadow-2xl border-3 border-[#F7931A]"
              onClick={e => e.stopPropagation()}
            />
          </div>
        )}

        {/* List Testimoni */}
        <div className="flex flex-col gap-6 mb-10">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-xl shadow-lg p-4 flex flex-col items-center"
            >
              {/* Gambar besar di tengah dan bisa klik */}
              {t.image_url && (
                <img
                  src={t.image_url}
                  alt={t.name}
                  className="w-full max-w-xs h-60 object-cover rounded-lg border border-[#F7931A]/30 mb-4 cursor-pointer transition hover:opacity-80"
                  onClick={() => setModalImage(t.image_url!)}
                />
              )}
              {/* Teks di bawah gambar, rata kiri */}
              <div className="w-full flex flex-col items-start">
                <div className="font-bold text-[#F7931A]">{t.name}</div>
                <div className="text-gray-700 whitespace-pre-line">{t.message}</div>
                <div className="text-xs text-gray-400 mt-1">{new Date(t.created_at).toLocaleString()}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Form Testimoni */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-lg p-4 flex flex-col gap-3"
        >
          <input
            type="text"
            placeholder="Nama Anda"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full px-3 py-2 mb-2 rounded border border-[#F7931A]/40 bg-white placeholder-gray-400 text-[#383838] focus:outline-[#F7931A] text-base"
            required
          />
          <div className="relative flex items-start">
            <textarea
              placeholder="Pesan testimoni..."
              value={message}
              onChange={e => setMessage(e.target.value)}
              className="w-full px-3 py-2 rounded border border-[#F7931A]/40 bg-white placeholder-gray-400 text-[#383838] focus:outline-[#F7931A] text-base resize-none"
              rows={3}
              required
            />
            <button
              type="button"
              className="text-2xl absolute right-2 top-2"
              onClick={() => setShowEmoji((s) => !s)}
              tabIndex={-1}
            >
              😊
            </button>
            {showEmoji && (
              <div className="absolute z-50 right-0 top-10">
                <EmojiGrid onPick={emoji => { setMessage(prev => prev + emoji); setShowEmoji(false); }} />
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <label className="bg-[#F7931A] text-white px-4 py-2 rounded cursor-pointer hover:bg-orange-500 transition font-semibold">
              Upload Gambar
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setImage(e.target.files ? e.target.files[0] : null)
                }
                disabled={sending}
              />
            </label>
            <span className="text-gray-500 text-sm">
              {image ? image.name : "Tidak ada file yang dipilih"}
            </span>
          </div>
          <button
            className="bg-[#F7931A] text-white font-semibold rounded py-2 hover:bg-orange-500 transition"
            type="submit"
            disabled={sending}
          >
            {sending ? "Mengirim..." : "Kirim"}
          </button>
        </form>
      </main>
    </div>
  );
}

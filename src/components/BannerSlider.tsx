import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import { useRef, useEffect } from "react";

const banners = [
  { id: 1, image: "/banner1.jpg", alt: "Promo Merdeka", caption: "Promo Spesial Merdeka! Diskon 17%", link: "/" },
  { id: 2, image: "/banner2.jpg", alt: "Bonus OVO", caption: "Langganan dapat saldo OVO hingga 10k!", link: "/" },
  { id: 3, image: "/banner3.jpg", alt: "Testimoni", caption: "500+ pelanggan puas sejak 2022.", link: "/testimoni" }
];

export default function BannerSlider() {
  const [sliderRef, slider] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slides: { perView: 1 },
    drag: true,
    renderMode: "performance",
  });

  // Auto slide kanan tiap 3 detik
  useEffect(() => {
    if (!slider) return;
    let timer: NodeJS.Timeout;
    function next() {
      timer = setTimeout(() => {
        slider.current?.next();
        next();
      }, 3000);
    }
    next();
    return () => clearTimeout(timer);
  }, [slider]);

  return (
    <div ref={sliderRef} className="keen-slider w-full rounded-xl overflow-hidden mb-7 shadow">
      {banners.map((b, i) => (
        <a
          href={b.link}
          key={b.id}
          className="keen-slider__slide relative block"
          style={{ aspectRatio: "3/1", width: "100%" }}
        >
          {/* Container dengan aspect ratio 3:1 */}
          <div className="relative w-full aspect-[3/1]">
            <img
              src={b.image}
              alt={b.alt}
              className="absolute inset-0 w-full h-full object-cover rounded-xl"
            />
            {/* Caption/teks, jika perlu */}
            <span className="absolute left-0 right-0 bottom-2 text-center font-semibold text-[#F7931A] text-lg drop-shadow">
              {b.caption}
            </span>
          </div>
        </a>
      ))}
    </div>
  );
}

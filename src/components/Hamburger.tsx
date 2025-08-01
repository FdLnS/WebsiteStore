// src/components/Hamburger.tsx
export default function Hamburger({ open, onClick }: { open: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label="menu"
      className="w-10 h-10 flex flex-col justify-center items-center group"
      onClick={onClick}
    >
      <span
        className={`block h-0.5 w-7 my-1 rounded-full bg-[#F7931A] transition-transform duration-300 ${open ? "rotate-45 translate-y-2" : ""}`}
      />
      <span
        className={`block h-0.5 w-7 my-1 rounded-full bg-[#F7931A] transition-all duration-300 ${open ? "opacity-0" : ""}`}
      />
      <span
        className={`block h-0.5 w-7 my-1 rounded-full bg-[#F7931A] transition-transform duration-300 ${open ? "-rotate-45 -translate-y-3" : ""}`}
      />
    </button>
  );
}

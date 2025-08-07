export default function Hamburger({
  open,
  onClick,
}: {
  open: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label="menu"
      className="w-10 h-10 flex flex-col justify-center items-center group relative z-50"
      onClick={onClick}
    >
      {/* Garis 1 */}
      <span
        className={`
          block h-0.5 w-7 my-1 rounded-full bg-[#F7931A]
          transition-all duration-300 ease-in-out
          ${open ? "rotate-45 translate-y-2" : ""}
        `}
      />
      {/* Garis 2 */}
      <span
        className={`
          block h-0.5 w-7 my-1 rounded-full bg-[#F7931A]
          transition-all duration-300 ease-in-out
          ${open ? "opacity-0 scale-75" : ""}
        `}
      />
      {/* Garis 3 */}
      <span
        className={`
          block h-0.5 w-7 my-1 rounded-full bg-[#F7931A]
          transition-all duration-300 ease-in-out
          ${open ? "-rotate-45 -translate-y-3" : ""}
        `}
      />
    </button>
  );
}

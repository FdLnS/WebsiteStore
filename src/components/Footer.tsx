export default function Footer() {
  return (
    <footer className="w-full bg-[#FFF2D9] text-[#F7931A] py-6 mt-8 text-center text-sm rounded-t-2xl shadow-inner">
      <div>
        © {new Date().getFullYear()} FdLn Store. All rights reserved.
      </div>
      <div className="mt-2">
        Dibuat dengan <span className="text-red-500">♥</span> oleh Fadlan
      </div>
    </footer>
  );
}

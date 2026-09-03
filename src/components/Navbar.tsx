import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useCart } from "@/context/CartContext";

const LINKS = [
  { href: "#home", label: "الرئيسية" },
  { href: "#about", label: "عن المصنع" },
  { href: "#shop", label: "المتجر" },
  { href: "#reviews", label: "آراء العملاء" },
  { href: "#contact", label: "تواصل معنا" },
];

export default function Navbar() {
  const { count, openCart } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled ? "glass shadow-lg shadow-black/5" : "bg-[#faf6ef]/60"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {/* logo */}
        <a href="#home" className="flex items-center gap-3">
          <img
            src="/images/logo.jpeg"
            alt="TAJ"
            className="h-11 w-11 rounded-full object-cover ring-2 ring-[#c6a15b]/60"
          />
          <div className="leading-tight">
            <span className="font-display text-xl font-bold tracking-[0.25em] text-[#191920]">
              TAJ
            </span>
            <span className="block text-[11px] font-semibold text-[#7a6f60]">
              مصنع تاج لساعات الحائط والديكور
            </span>
          </div>
        </a>

        {/* desktop links */}
        <nav className="hidden items-center gap-7 lg:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="relative text-sm font-semibold text-[#3d3830] transition-colors hover:text-[#a8853f] after:absolute after:-bottom-1 after:right-0 after:h-0.5 after:w-0 after:bg-[#c6a15b] after:transition-all hover:after:w-full"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {/* cart */}
          <button
            onClick={openCart}
            className="relative rounded-full bg-[#191920] p-2.5 text-[#e6c987] transition-transform hover:scale-105"
            aria-label="سلة المشتريات"
          >
            <ShoppingBag className="h-5 w-5" />
            <AnimatePresence>
              {count > 0 && (
                <motion.span
                  key={count}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -left-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#c6a15b] px-1 text-[11px] font-bold text-white"
                >
                  {count}
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          {/* mobile toggle */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="rounded-full border border-[#d9cfba] p-2.5 text-[#191920] lg:hidden"
            aria-label="القائمة"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="glass overflow-hidden border-t border-[#e7ddc8] lg:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-3">
              {LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3 py-2.5 text-sm font-semibold text-[#3d3830] transition-colors hover:bg-[#efe6d3] hover:text-[#a8853f]"
                >
                  {l.label}
                </a>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

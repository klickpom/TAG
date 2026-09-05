import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, MessageCircle, X } from "lucide-react";
import BrandMark from "./BrandMark";
import { WA_LINK } from "./TopBar";

const LINKS = [
  { href: "#home", label: "الرئيسية" },
  { href: "#about", label: "عن المصنع" },
  { href: "#shop", label: "المعرض" },
  { href: "#faq", label: "الأسئلة" },
  { href: "/catalog", label: "الكاتلوج" },
  { href: "#reviews", label: "آراء العملاء" },
  { href: "#contact", label: "تواصل معنا" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-[#c6a15b]/20 glass-dark">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-2 px-4 py-2 sm:py-2.5">
        <a href="#home" className="flex min-w-0 flex-1 items-center" aria-label="مصنع تاج — الرئيسية">
          <BrandMark tone="dark" />
        </a>

        <nav className="hidden items-center gap-7 lg:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="relative text-sm font-semibold text-[#e9e2d4] transition-colors hover:text-[#e6c987] after:absolute after:-bottom-1 after:right-0 after:h-0.5 after:w-0 after:bg-[#c6a15b] after:transition-all hover:after:w-full"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <a
            href={WA_LINK}
            target="_blank"
            rel="noreferrer"
            className="relative rounded-full bg-[#c6a15b] p-2.5 text-[#191920] transition-transform hover:scale-105"
            aria-label="واتساب"
          >
            <MessageCircle className="h-5 w-5" />
          </a>
          <button
            onClick={() => setOpen((v) => !v)}
            className="rounded-full border border-[#c6a15b]/40 p-2.5 text-[#e6c987] lg:hidden"
            aria-label="القائمة"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-[#c6a15b]/20 bg-[#111116] lg:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-3">
              {LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3 py-2.5 text-sm font-semibold text-[#e9e2d4] transition-colors hover:bg-white/5 hover:text-[#e6c987]"
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

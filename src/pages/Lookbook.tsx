import { useMemo, useState } from "react";
import { Link } from "react-router";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpLeft, MessageCircle, X } from "lucide-react";
import { LOOK_LABELS, type LookItem, type LookKind } from "@/data/lookbook";
import { useCatalog } from "@/context/CatalogContext";
import { WA_LINK } from "@/components/TopBar";

function waItem(name: string, size: string) {
  const msg = `السلام عليكم، محتاج تفاصيل من الكتالوج عن: ${name} — ${size}`;
  return `${WA_LINK}?text=${encodeURIComponent(msg)}`;
}

export default function Lookbook() {
  const { lookbook } = useCatalog();
  const [kind, setKind] = useState<LookKind | "all">("all");
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState<LookItem | null>(null);

  const list = useMemo(
    () => lookbook.filter((p) => kind === "all" || p.kind === kind),
    [lookbook, kind]
  );

  const featured = list[Math.min(active, Math.max(0, list.length - 1))] ?? list[0];

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#12100e] text-[#f3ead8]">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#12100e]/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="leading-tight">
            <p className="font-display text-xl tracking-[0.35em] text-white">TAJ</p>
            <p className="text-[10px] font-semibold tracking-[0.28em] text-[#c6a15b]">LOOKBOOK</p>
          </div>
          <Link
            to="/"
            className="flex items-center gap-2 text-xs font-bold text-[#cfc7b4] transition-colors hover:text-[#e6c987]"
          >
            الموقع الرئيسي
            <ArrowUpLeft className="h-4 w-4" />
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 pb-8 pt-10 sm:pt-14">
        <p className="text-[11px] font-bold tracking-[0.35em] text-[#c6a15b]">كتالوج تاج</p>
        <h1 className="mt-3 max-w-xl text-4xl font-black leading-[1.2] text-white sm:text-5xl">
          تشكيلة تتقلب
          <span className="text-gold-gradient"> زي المجلات</span>
        </h1>
        <p className="mt-4 max-w-lg text-sm leading-7 text-[#b8ae9a]">
          دوس على أي صورة يمين — الصورة الكبيرة تتبدل فورًا. المقاس ظاهر.
          للتفاصيل كلمنا واتساب.
        </p>
      </section>

      {featured && (
        <section className="mx-auto grid max-w-6xl items-stretch gap-4 px-4 pb-12 lg:grid-cols-12">
          <motion.button
            type="button"
            layout
            onClick={() => setOpen(featured)}
            className="relative min-h-[52vh] overflow-hidden rounded-[2rem] bg-[#1c1916] lg:col-span-8"
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={featured.id}
                src={featured.image}
                alt={featured.name}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45 }}
                className="absolute inset-0 h-full w-full object-cover object-top"
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
            <div className="absolute bottom-0 right-0 p-6 text-right">
              <p className="text-[11px] font-bold tracking-wide text-[#e6c987]">{LOOK_LABELS[featured.kind]}</p>
              <h2 className="mt-1 text-2xl font-black text-white sm:text-3xl">{featured.name}</h2>
              <p className="mt-2 inline-block rounded-full border border-[#c6a15b]/50 bg-black/40 px-3 py-1 text-xs font-semibold text-[#e6c987] backdrop-blur">
                {featured.size}
              </p>
            </div>
          </motion.button>

          <div className="flex gap-3 overflow-x-auto pb-2 lg:col-span-4 lg:flex-col lg:overflow-y-auto lg:overflow-x-hidden lg:pb-0">
            {list.map((item, i) => {
              const on = item.id === featured.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActive(i)}
                  className={`relative h-28 w-40 shrink-0 overflow-hidden rounded-2xl border transition-all lg:h-24 lg:w-full ${
                    on ? "border-[#c6a15b] ring-2 ring-[#c6a15b]/40" : "border-white/10 opacity-80 hover:opacity-100"
                  }`}
                >
                  <img src={item.image} alt="" className="h-full w-full object-cover object-top" />
                  <span className="absolute bottom-1 right-2 text-[10px] font-bold text-white drop-shadow">
                    {item.name}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-6xl px-4 pb-6">
        <div className="flex flex-wrap gap-2">
          {(["all", "clocks", "pots"] as const).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => {
                setKind(k);
                setActive(0);
              }}
              className={`rounded-full px-5 py-2 text-xs font-bold ${
                kind === k ? "bg-gold-gradient text-[#191920]" : "border border-white/15 text-[#cfc7b4]"
              }`}
            >
              {LOOK_LABELS[k]}
            </button>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-24">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {list.map((item, i) => (
            <motion.button
              key={item.id}
              type="button"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 8) * 0.04 }}
              onClick={() => {
                setActive(i);
                setOpen(item);
              }}
              className="group overflow-hidden rounded-3xl border border-white/10 bg-[#1c1916] text-right"
            >
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-3">
                <h3 className="line-clamp-2 text-sm font-bold text-white">{item.name}</h3>
                <p className="mt-1 text-[11px] font-semibold text-[#c6a15b]">{item.size}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 p-3 backdrop-blur-sm sm:items-center"
            onClick={() => setOpen(null)}
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="grid w-full max-w-3xl overflow-hidden rounded-[1.75rem] bg-[#1a1815] shadow-2xl md:grid-cols-2"
            >
              <img src={open.image} alt={open.name} className="aspect-square w-full object-cover object-top md:aspect-auto md:h-full" />
              <div className="relative p-6">
                <button
                  type="button"
                  onClick={() => setOpen(null)}
                  className="absolute left-4 top-4 rounded-full bg-white/10 p-2 text-white"
                  aria-label="إغلاق"
                >
                  <X className="h-4 w-4" />
                </button>
                <p className="text-[11px] font-bold text-[#c6a15b]">{LOOK_LABELS[open.kind]}</p>
                <h3 className="mt-2 text-2xl font-black text-white">{open.name}</h3>
                <p className="mt-3 text-sm font-semibold text-[#e6c987]">{open.size}</p>
                <a
                  href={waItem(open.name, open.size)}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-gold-gradient mt-8 flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-black text-[#191920]"
                >
                  <MessageCircle className="h-4 w-4" />
                  اسأل على واتساب
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

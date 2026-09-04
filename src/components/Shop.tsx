import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, MessageCircle, Search, X } from "lucide-react";
import { LOOKBOOK, LOOK_LABELS, catalogPhoto, type LookItem, type LookKind } from "@/data/lookbook";
import { useCatalog } from "@/context/CatalogContext";
import { WA_LINK } from "./TopBar";

type Filter = LookKind | "all";
const FILTERS: Filter[] = ["all", "clocks", "pots"];

function waItem(name: string, size: string) {
  return `${WA_LINK}?text=${encodeURIComponent(`السلام عليكم، محتاج تفاصيل عن: ${name} — ${size}`)}`;
}

function GalleryPhoto({ item, className }: { item: LookItem; className?: string }) {
  const fallback = LOOKBOOK.find((row) => row.id === item.id)?.image || item.image;
  const [src, setSrc] = useState(catalogPhoto(item));
  useEffect(() => {
    setSrc(catalogPhoto(item));
  }, [item]);
  return (
    <img
      src={src}
      alt={item.name}
      loading="lazy"
      className={className}
      onError={() => {
        if (src !== fallback) setSrc(fallback);
      }}
    />
  );
}

function ProductCard({
  item,
  onOpen,
}: {
  item: LookItem;
  onOpen: (item: LookItem) => void;
}) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.32 }}
      className="group min-w-0 overflow-hidden border border-[#eadfc9] bg-white"
    >
      <button
        type="button"
        onClick={() => onOpen(item)}
        className="relative aspect-[4/5] w-full overflow-hidden bg-[#111113] text-right"
      >
        <GalleryPhoto
          item={item}
          className="h-full w-full object-contain object-center p-3 transition-transform duration-700 group-hover:scale-[1.04]"
        />
        <span className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/45 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      </button>
      <div className="border-t border-[#eadfc9] p-4">
        <p className="text-[10px] font-bold tracking-[0.22em] text-[#a8853f]">{LOOK_LABELS[item.kind]}</p>
        <h3 className="mt-1 line-clamp-2 min-h-[2.6rem] text-sm font-black text-[#191920] sm:text-[15px]">
          {item.name}
        </h3>
        <p className="mt-2 text-xs font-semibold text-[#7a6f60]">{item.size}</p>
        <a
          href={waItem(item.name, item.size)}
          target="_blank"
          rel="noreferrer"
          className="mt-3 flex w-full items-center justify-center gap-1.5 bg-[#191920] px-3 py-2.5 text-[11px] font-bold text-[#e6c987] transition-colors hover:bg-[#2a2a33] sm:text-xs"
        >
          <MessageCircle className="h-4 w-4" />
          اسأل على واتساب
        </a>
      </div>
    </motion.article>
  );
}

function QuickView({ item, onClose }: { item: LookItem; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.94, y: 24 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.94, y: 24 }}
        transition={{ type: "spring", damping: 24 }}
        onClick={(e) => e.stopPropagation()}
        className="grid w-[min(100%,52rem)] max-h-[90dvh] overflow-y-auto overflow-x-hidden bg-[#faf6ef] shadow-2xl md:grid-cols-2"
      >
        <div className="relative min-h-[280px] bg-[#111113] md:min-h-[420px]">
          <GalleryPhoto item={item} className="h-full w-full object-contain object-center p-5" />
        </div>
        <div className="relative flex flex-col p-6 sm:p-8">
          <button
            type="button"
            onClick={onClose}
            className="absolute left-4 top-4 rounded-full bg-white p-2 text-[#191920]"
            aria-label="إغلاق"
          >
            <X className="h-4 w-4" />
          </button>
          <p className="text-[11px] font-bold tracking-[0.28em] text-[#a8853f]">{LOOK_LABELS[item.kind]}</p>
          <h3 className="mt-2 text-2xl font-black text-[#191920]">{item.name}</h3>
          <div className="mt-5 inline-block self-start border border-[#c6a15b]/70 px-3 py-1.5 text-sm font-bold text-[#a8853f]">
            {item.size}
          </div>
          <p className="mt-5 text-sm leading-7 text-[#5d554a]">
            صناعة المصنع في طنطا. السعر والتفاصيل الكاملة في الكاتلوج، أو اسأل مباشرة على واتساب.
          </p>
          <div className="mt-auto flex flex-col gap-3 pt-8">
            <a
              href={waItem(item.name, item.size)}
              target="_blank"
              rel="noreferrer"
              className="bg-gold-gradient flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold text-[#191920]"
            >
              <MessageCircle className="h-4 w-4" />
              اسأل على واتساب
            </a>
            <Link
              to="/catalog"
              className="flex items-center justify-center gap-2 border border-[#191920] px-6 py-3 text-sm font-bold text-[#191920]"
            >
              فتح الكاتلوج بالأسعار
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ProductGrid({
  items,
  onOpen,
}: {
  items: LookItem[];
  onOpen: (item: LookItem) => void;
}) {
  return (
    <div className="grid min-w-0 grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
      <AnimatePresence mode="popLayout">
        {items.map((item) => (
          <ProductCard key={item.id} item={item} onOpen={onOpen} />
        ))}
      </AnimatePresence>
    </div>
  );
}

export default function Shop() {
  const { lookbook } = useCatalog();
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [quick, setQuick] = useState<LookItem | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim();
    return lookbook.filter((item) => {
      const okKind = filter === "all" || item.kind === filter;
      const okQ = !q || item.name.includes(q) || item.size.includes(q);
      return okKind && okQ;
    });
  }, [filter, query, lookbook]);

  const clocks = filtered.filter((item) => item.kind === "clocks");
  const decor = filtered.filter((item) => item.kind !== "clocks");
  const grouped = filter === "all" && !query.trim();

  return (
    <section id="shop" className="bg-[#faf6ef] py-20">
      <div className="mx-auto max-w-7xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end"
        >
          <div>
            <p className="text-[11px] font-bold tracking-[0.32em] text-[#a8853f]">THE COLLECTION</p>
            <h2 className="mt-3 text-3xl font-black text-[#191920] sm:text-4xl">
              معرض ساعات الحائط <span className="text-gold-gradient">وتحف الديكور</span>
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-[#7a6f60]">
              ساعات حائط وتحف ديكور من مصنع تاج في طنطا. الأسعار داخل الكاتلوج فقط، والطلب عبر واتساب.
            </p>
          </div>
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 border border-[#191920] px-5 py-2.5 text-xs font-black text-[#191920] transition-colors hover:bg-[#191920] hover:text-[#e6c987]"
          >
            فتح الكاتلوج بالأسعار
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </motion.div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex flex-wrap justify-center gap-2">
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`px-5 py-2.5 text-sm font-bold transition-all ${
                  filter === f
                    ? "bg-[#191920] text-[#e6c987]"
                    : "border border-[#eadfc9] bg-white text-[#5d554a] hover:border-[#c6a15b]"
                }`}
              >
                {LOOK_LABELS[f]}
              </button>
            ))}
          </div>
          <div className="relative w-full max-w-xs">
            <Search className="absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#a89a80]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحث عن قطعة…"
              className="w-full rounded-none border border-[#eadfc9] bg-white py-2.5 pl-4 pr-10 text-sm outline-none placeholder:text-[#a89a80] focus:border-[#c6a15b]"
            />
          </div>
        </div>

        {grouped ? (
          <div className="mt-12 space-y-14">
            {clocks.length > 0 ? (
              <section>
                <div className="mb-6 flex items-baseline justify-between gap-3 border-b border-[#eadfc9] pb-3">
                  <h3 className="text-xl font-black text-[#191920]">ساعات</h3>
                  <span className="font-display text-sm text-[#a8853f]">{String(clocks.length).padStart(2, "0")}</span>
                </div>
                <ProductGrid items={clocks} onOpen={setQuick} />
              </section>
            ) : null}
            {decor.length > 0 ? (
              <section>
                <div className="mb-6 flex items-baseline justify-between gap-3 border-b border-[#eadfc9] pb-3">
                  <h3 className="text-xl font-black text-[#191920]">تحف وديكور</h3>
                  <span className="font-display text-sm text-[#a8853f]">{String(decor.length).padStart(2, "0")}</span>
                </div>
                <ProductGrid items={decor} onOpen={setQuick} />
              </section>
            ) : null}
          </div>
        ) : (
          <div className="mt-10">
            <ProductGrid items={filtered} onOpen={setQuick} />
          </div>
        )}

        {filtered.length === 0 && (
          <p className="mt-16 text-center text-sm font-semibold text-[#a89a80]">لا توجد قطع مطابقة لبحثك</p>
        )}
      </div>

      <AnimatePresence>{quick ? <QuickView item={quick} onClose={() => setQuick(null)} /> : null}</AnimatePresence>
    </section>
  );
}

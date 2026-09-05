import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Eye, MessageCircle, Search, X } from "lucide-react";
import { LOOK_LABELS, type LookItem, type LookKind } from "@/data/lookbook";
import { useCatalog } from "@/context/CatalogContext";
import { WA_LINK } from "./TopBar";

type Filter = LookKind | "all";
const FILTERS: Filter[] = ["all", "clocks", "pots"];

function waProduct(name: string, size: string) {
  const msg = `السلام عليكم، محتاج تفاصيل عن المنتج: ${name} — ${size}`;
  return `${WA_LINK}?text=${encodeURIComponent(msg)}`;
}

function ProductCard({
  product,
  onQuickView,
}: {
  product: LookItem;
  onQuickView: (p: LookItem) => void;
}) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={{ duration: 0.35 }}
      className="group min-w-0 overflow-hidden rounded-2xl border border-[#eadfc9] bg-white shadow-sm transition-shadow hover:shadow-xl hover:shadow-[#c6a15b]/10"
    >
      <button
        type="button"
        onClick={() => onQuickView(product)}
        className="relative aspect-square w-full overflow-hidden bg-[#f5efe4] text-right"
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 p-2 text-[#191920] opacity-0 shadow-md backdrop-blur transition-all group-hover:opacity-100">
          <Eye className="h-4 w-4" />
        </span>
      </button>

      <div className="p-4">
        <span className="text-[11px] font-bold text-[#a8853f]">{LOOK_LABELS[product.kind]}</span>
        <h3 className="mt-1 line-clamp-2 min-h-[2.5rem] text-sm font-bold text-[#191920] sm:text-base">
          {product.name}
        </h3>
        <p className="mt-1 text-xs font-semibold text-[#8a7a5c]">{product.size}</p>
        <a
          href={waProduct(product.name, product.size)}
          target="_blank"
          rel="noreferrer"
          className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-full bg-[#191920] px-3 py-2 text-[11px] font-bold text-[#e6c987] transition-all hover:scale-[1.02] hover:bg-[#2a2a33] sm:text-xs"
        >
          <MessageCircle className="h-4 w-4" />
          اسأل على واتساب
        </a>
      </div>
    </motion.article>
  );
}

function QuickView({
  product,
  onClose,
}: {
  product: LookItem;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 30 }}
        transition={{ type: "spring", damping: 22 }}
        onClick={(e) => e.stopPropagation()}
        className="grid w-[min(100%,48rem)] max-h-[90dvh] overflow-y-auto overflow-x-hidden rounded-3xl bg-white shadow-2xl md:grid-cols-2"
      >
        <div className="relative aspect-square bg-[#f5efe4]">
          <img src={product.image} alt={product.name} className="h-full w-full object-cover object-top" />
        </div>
        <div className="relative flex flex-col p-6 sm:p-8">
          <button
            onClick={onClose}
            className="absolute left-4 top-4 rounded-full bg-[#f5efe4] p-2 text-[#191920] hover:bg-[#eadfc9]"
            aria-label="إغلاق"
          >
            <X className="h-4 w-4" />
          </button>
          <span className="text-xs font-bold text-[#a8853f]">{LOOK_LABELS[product.kind]}</span>
          <h3 className="mt-2 text-2xl font-black text-[#191920]">{product.name}</h3>
          <p className="mt-4 text-sm font-semibold text-[#5d554a]">{product.size}</p>
          <a
            href={waProduct(product.name, product.size)}
            target="_blank"
            rel="noreferrer"
            className="bg-gold-gradient mt-6 flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-[#191920] shadow-lg shadow-[#c6a15b]/30 transition-transform hover:scale-[1.03]"
          >
            <MessageCircle className="h-4 w-4" />
            اسأل عن المنتج على واتساب
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Shop() {
  const { lookbook } = useCatalog();
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [quick, setQuick] = useState<LookItem | null>(null);

  const list = useMemo(() => {
    return lookbook.filter((p) => {
      const okCat = filter === "all" || p.kind === filter;
      const q = query.trim();
      const okQ = q === "" || p.name.includes(q) || p.size.includes(q);
      return okCat && okQ;
    });
  }, [filter, query, lookbook]);

  return (
    <section id="shop" className="bg-[#faf6ef] py-20">
      <div className="mx-auto max-w-7xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="text-sm font-bold tracking-wide text-[#a8853f]">المعرض</span>
          <h2 className="mt-3 text-3xl font-black text-[#191920] sm:text-4xl">
            اختار قطعتك <span className="text-gold-gradient">المفضلة</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[#7a6f60]">
            كل المنتجات من مصنعنا مباشرة — للتفاصيل والطلب كلمنا على واتساب.
          </p>
        </motion.div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex flex-wrap justify-center gap-2">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-full px-5 py-2.5 text-sm font-bold transition-all ${
                  filter === f
                    ? "bg-gold-gradient text-white shadow-lg shadow-[#c6a15b]/30"
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
              placeholder="ابحث عن منتج…"
              className="w-full rounded-full border border-[#eadfc9] bg-white py-2.5 pl-4 pr-10 text-sm outline-none transition-colors placeholder:text-[#a89a80] focus:border-[#c6a15b]"
            />
          </div>
        </div>

        <motion.div layout className="mt-10 grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {list.map((p) => (
              <ProductCard key={p.id} product={p} onQuickView={setQuick} />
            ))}
          </AnimatePresence>
        </motion.div>

        {list.length === 0 && (
          <p className="mt-16 text-center text-sm font-semibold text-[#a89a80]">
            لا توجد منتجات مطابقة لبحثك
          </p>
        )}
      </div>

      <AnimatePresence>
        {quick && <QuickView product={quick} onClose={() => setQuick(null)} />}
      </AnimatePresence>
    </section>
  );
}

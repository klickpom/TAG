import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";
import { LOOK_LABELS, type LookItem } from "@/data/lookbook";
import { useCatalog } from "@/context/CatalogContext";
import { WA_LINK } from "@/components/TopBar";

function waItem(name: string, size: string, price: string) {
  const extra = price ? ` — السعر ${price}` : "";
  return `${WA_LINK}?text=${encodeURIComponent(`السلام عليكم، محتاج تفاصيل من كتالوج تاج عن: ${name} — ${size}${extra}`)}`;
}

type Leaf =
  | { type: "cover" }
  | { type: "index"; items: LookItem[] }
  | { type: "product"; item: LookItem; no: number };

export default function Lookbook() {
  const { lookbook } = useCatalog();
  const reduce = useReducedMotion();
  const [leaf, setLeaf] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const touchX = useRef(0);

  const leaves: Leaf[] = useMemo(
    () => [
      { type: "cover" },
      { type: "index", items: lookbook },
      ...lookbook.map((item, i) => ({ type: "product" as const, item, no: i + 1 })),
    ],
    [lookbook]
  );

  const total = leaves.length;
  const current = leaves[leaf] ?? leaves[0];

  const go = useCallback(
    (next: number) => {
      if (next < 0 || next >= total || next === leaf) return;
      setDir(next > leaf ? 1 : -1);
      setLeaf(next);
    },
    [leaf, total]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(leaf + 1);
      if (e.key === "ArrowRight") go(leaf - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, leaf]);

  const flip = reduce
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { rotateY: dir * 78, opacity: 0.35 },
        animate: { rotateY: 0, opacity: 1 },
        exit: { rotateY: dir * -78, opacity: 0.35 },
      };

  return (
    <div className="relative min-h-dvh overflow-hidden bg-[#1a140f]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#5a4028_0%,_#24180f_55%,_#100c09_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(to_top,rgba(0,0,0,.55),transparent)]" />

      <header className="relative z-20 mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link to="/" className="text-xs font-bold text-[#d9cbb0]/80 hover:text-[#e6c987]">
          الموقع الرئيسي
        </Link>
        <p className="font-display tracking-[0.45em] text-[#f4ead8]">TAJ</p>
        <span className="text-[11px] font-semibold text-[#c6a15b]">
          {leaf + 1} / {total}
        </span>
      </header>

      <div className="relative z-10 mx-auto flex min-h-[calc(100dvh-5.5rem)] max-w-[1120px] items-center justify-center px-3 pb-8">
        <button
          type="button"
          onClick={() => go(leaf + 1)}
          disabled={leaf >= total - 1}
          className="absolute left-2 top-1/2 z-30 hidden -translate-y-1/2 rounded-full border border-[#c6a15b]/40 bg-black/30 p-3 text-[#e6c987] disabled:opacity-30 md:flex"
          aria-label="الصفحة التالية"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          type="button"
          onClick={() => go(leaf - 1)}
          disabled={leaf <= 0}
          className="absolute right-2 top-1/2 z-30 hidden -translate-y-1/2 rounded-full border border-[#c6a15b]/40 bg-black/30 p-3 text-[#e6c987] disabled:opacity-30 md:flex"
          aria-label="الصفحة السابقة"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        <div className="relative w-full max-w-[940px]" style={{ perspective: "2400px" }}>
          <div className="book-stack pointer-events-none absolute -left-2 top-5 bottom-5 w-3 rounded-l-sm opacity-90" />
          <div className="book-spine pointer-events-none absolute -right-3 top-0 bottom-0 w-3 rounded-r-[3px]" />

          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={leaf}
              custom={dir}
              initial={flip.initial}
              animate={flip.animate}
              exit={flip.exit}
              transition={{ duration: reduce ? 0.2 : 0.58, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: "right center", transformStyle: "preserve-3d" }}
              className="relative mx-auto aspect-[3/4] w-full max-h-[78vh] overflow-hidden rounded-sm shadow-[18px_28px_70px_rgba(0,0,0,.55)] sm:aspect-[4/3] md:max-h-[82vh]"
              onPointerDown={(e) => {
                touchX.current = e.clientX;
              }}
              onPointerUp={(e) => {
                const dx = e.clientX - touchX.current;
                if (Math.abs(dx) > 48) {
                  if (dx < 0) go(leaf + 1);
                  else go(leaf - 1);
                  return;
                }
                const box = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
                const x = e.clientX - box.left;
                if (x < box.width * 0.28) go(leaf + 1);
                else if (x > box.width * 0.72) go(leaf - 1);
              }}
            >
              {current.type === "cover" && <Cover onOpen={() => go(1)} count={lookbook.length} />}
              {current.type === "index" && (
                <IndexPage items={current.items} onPick={(i) => go(i + 2)} />
              )}
              {current.type === "product" && (
                <ProductSpread item={current.item} no={current.no} total={lookbook.length} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="relative z-20 flex justify-center gap-6 pb-5 md:hidden">
        <button
          type="button"
          onClick={() => go(leaf - 1)}
          className="rounded-full border border-[#c6a15b]/50 px-5 py-2 text-sm font-bold text-[#e6c987]"
        >
          السابق
        </button>
        <button
          type="button"
          onClick={() => go(leaf + 1)}
          className="rounded-full bg-[#c6a15b] px-5 py-2 text-sm font-bold text-[#1a140f]"
        >
          التالي
        </button>
      </div>
    </div>
  );
}

function Cover({ onOpen, count }: { onOpen: () => void; count: number }) {
  return (
    <div className="book-leather flex h-full flex-col justify-between p-8 text-[#f4ead8] sm:p-12">
      <div>
        <p className="text-[11px] font-bold tracking-[0.55em] text-[#e6c987]">TAJ FACTORY · TANTA</p>
        <div className="mt-8 h-px w-16 bg-[#c6a15b]" />
      </div>
      <div>
        <h1 className="font-display text-6xl leading-none tracking-[0.22em] text-[#f8f0de] sm:text-8xl">TAJ</h1>
        <p className="mt-5 text-2xl font-black text-white sm:text-4xl">كتالوج المصنع</p>
        <p className="mt-4 max-w-sm text-sm leading-7 text-[#d9cbb0]">
          كتاب ساعات وبوتات. اقلب الصفحة زي الكتالوج الورقي. {count} قطعة في الدفعة الحالية.
        </p>
      </div>
      <button
        type="button"
        onPointerUp={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          onOpen();
        }}
        className="self-start rounded-full border border-[#e6c987] px-6 py-3 text-sm font-black text-[#e6c987]"
      >
        افتح الكتاب
      </button>
    </div>
  );
}

function IndexPage({ items, onPick }: { items: LookItem[]; onPick: (i: number) => void }) {
  return (
    <div className="book-paper h-full overflow-y-auto p-6 text-[#2a2118] sm:p-10">
      <p className="text-[11px] font-bold tracking-[0.3em] text-[#a8853f]">الفهرس</p>
      <h2 className="mt-2 font-display text-3xl italic text-[#2a2118]">محتويات الكتالوج</h2>
      <ol className="mt-6 columns-1 gap-x-10 sm:columns-2">
        {items.map((item, i) => (
          <li key={item.id} className="mb-2 break-inside-avoid">
            <button
              type="button"
              onPointerUp={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                onPick(i);
              }}
              className="flex w-full items-baseline justify-between gap-3 border-b border-dotted border-[#c6b79a] py-1.5 text-right text-sm font-bold hover:text-[#a8853f]"
            >
              <span className="min-w-0 truncate">
                {item.name}
                <span className="mr-2 font-semibold text-[#8a7a5c]"> — {item.size}</span>
                {item.price ? <span className="mr-2 font-black text-[#a8853f]"> — {item.price}</span> : null}
              </span>
              <span className="shrink-0 font-display text-[#a8853f]">{String(i + 1).padStart(2, "0")}</span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

function ProductSpread({ item, no, total }: { item: LookItem; no: number; total: number }) {
  return (
    <div className="grid h-full grid-rows-[1.15fr_0.85fr] bg-[#f4ead8] sm:grid-cols-2 sm:grid-rows-1">
      <div className="relative min-h-0 overflow-hidden bg-[#ddd3c2]">
        <img src={item.image} alt={item.name} className="h-full w-full object-cover object-top" />
      </div>
      <div className="book-paper relative flex flex-col justify-between p-6 sm:border-r sm:border-[#e2d4b8] sm:p-10">
        <div>
          <p className="text-[11px] font-bold tracking-[0.28em] text-[#a8853f]">{LOOK_LABELS[item.kind]}</p>
          <h2 className="mt-3 text-2xl font-black leading-snug text-[#2a2118] sm:text-4xl">{item.name}</h2>
          <div className="mt-6 inline-block border border-[#c6a15b] px-4 py-2 text-sm font-bold text-[#6b542e]">
            {item.size}
          </div>
          {item.price ? (
            <p className="mt-5 font-display text-3xl font-bold text-[#a8853f]">{item.price}</p>
          ) : null}
        </div>
        <div className="flex items-end justify-between gap-3">
          <a
            href={waItem(item.name, item.size, item.price)}
            target="_blank"
            rel="noreferrer"
            onPointerUp={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-2 rounded-full bg-[#2a2118] px-4 py-2.5 text-xs font-bold text-[#e6c987]"
          >
            <MessageCircle className="h-4 w-4" />
            واتساب
          </a>
          <p className="font-display text-sm text-[#a8853f]">
            {no} / {total}
          </p>
        </div>
      </div>
    </div>
  );
}

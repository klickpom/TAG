import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import useEmblaCarousel from "embla-carousel-react";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";
import { LOOK_LABELS, type LookItem } from "@/data/lookbook";
import { useCatalog } from "@/context/CatalogContext";
import { WA_LINK } from "@/components/TopBar";

function waItem(name: string, size: string) {
  return `${WA_LINK}?text=${encodeURIComponent(`السلام عليكم، محتاج تفاصيل من كاتلوج تاج عن: ${name} — ${size}`)}`;
}

export default function Lookbook() {
  const { lookbook } = useCatalog();
  const reduce = useReducedMotion();
  const [selected, setSelected] = useState(0);

  const clocks = useMemo(() => lookbook.filter((item) => item.kind === "clocks"), [lookbook]);
  const decor = useMemo(() => lookbook.filter((item) => item.kind !== "clocks"), [lookbook]);
  const hasChapter = clocks.length > 0 && decor.length > 0;
  const extra = 2 + (hasChapter ? 1 : 0);
  const total = lookbook.length + extra;
  const chapterIndex = hasChapter ? 2 + clocks.length : -1;

  const productSlide = useCallback(
    (i: number) => 2 + i + (hasChapter && i >= clocks.length ? 1 : 0),
    [hasChapter, clocks.length]
  );

  const [viewportRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "start",
    containScroll: "trimSnaps",
    duration: reduce ? 8 : 28,
    direction: "ltr",
    skipSnaps: false,
    dragThreshold: 6,
    watchDrag: (_api, event) => {
      const el = event.target as HTMLElement | null;
      if (!el) return true;
      if (el.closest("a, button, input, textarea, select")) return false;
      return true;
    },
  });

  useEffect(() => {
    document.documentElement.classList.add("catalog-open");
    document.body.classList.add("catalog-open");
    return () => {
      document.documentElement.classList.remove("catalog-open");
      document.body.classList.remove("catalog-open");
    };
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    const sync = () => setSelected(emblaApi.selectedScrollSnap());
    const onResize = () => emblaApi.reInit();
    emblaApi.on("select", sync);
    emblaApi.on("reInit", sync);
    window.addEventListener("resize", onResize);
    sync();
    return () => {
      emblaApi.off("select", sync);
      emblaApi.off("reInit", sync);
      window.removeEventListener("resize", onResize);
    };
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const slides = emblaApi.slideNodes();
    const tween = () => {
      const snaps = emblaApi.scrollSnapList();
      const progress = emblaApi.scrollProgress();
      const factor = Math.max(snaps.length, 1);
      snaps.forEach((snap, i) => {
        const inner = slides[i]?.querySelector(".catalog-slide-inner") as HTMLElement | null;
        if (!inner) return;
        if (reduce) {
          inner.style.transform = "";
          inner.style.opacity = "1";
          inner.style.filter = "";
          return;
        }
        const t = Math.min(1, Math.abs(snap - progress) * factor * 0.92);
        const scale = 1 - t * 0.07;
        const opacity = 1 - t * 0.38;
        const x = (snap - progress) * factor * -22;
        inner.style.transform = `translate3d(${x}px, 0, 0) scale(${scale})`;
        inner.style.opacity = String(Math.max(0.42, opacity));
        inner.style.filter = t > 0.12 ? `blur(${Math.min(8, t * 7)}px)` : "blur(0px)";
      });
    };
    emblaApi.on("scroll", tween);
    emblaApi.on("reInit", tween);
    emblaApi.on("select", tween);
    tween();
    return () => {
      emblaApi.off("scroll", tween);
      emblaApi.off("reInit", tween);
      emblaApi.off("select", tween);
    };
  }, [emblaApi, reduce, total]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") emblaApi?.scrollNext();
      if (e.key === "ArrowRight") emblaApi?.scrollPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [emblaApi]);

  const go = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi]);

  return (
    <div className="catalog-root relative flex h-dvh w-full flex-col overflow-hidden bg-[#070708] text-[#f4ead8]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#241c14_0%,_#070708_62%)]" />
      <div className="catalog-sheen pointer-events-none absolute inset-x-0 top-0 h-px" />

      <header className="relative z-20 flex items-center justify-between gap-3 px-4 py-3">
        <Link to="/" className="text-[11px] font-bold tracking-wide text-[#d9cbb0]/80 hover:text-[#e6c987]">
          الموقع الرئيسي
        </Link>
        <p className="font-display text-sm tracking-[0.42em] text-[#f8f0de]">TAJ</p>
        <span className="min-w-10 text-left text-[11px] font-semibold text-[#c6a15b]">
          {selected + 1} / {total}
        </span>
      </header>

      <div className="relative z-20 h-[2px] w-full bg-white/10">
        <motion.div
          className="h-full bg-[#c6a15b]"
          animate={{ width: `${((selected + 1) / total) * 100}%` }}
          transition={{ duration: reduce ? 0.12 : 0.32, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>

      <div className="relative z-10 flex min-h-0 flex-1">
        <button
          type="button"
          onClick={() => emblaApi?.scrollPrev()}
          disabled={selected <= 0}
          className="absolute left-2 top-1/2 z-30 hidden -translate-y-1/2 rounded-full border border-[#c6a15b]/35 bg-black/45 p-3 text-[#e6c987] backdrop-blur disabled:opacity-25 md:flex"
          aria-label="السابق"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          type="button"
          onClick={() => emblaApi?.scrollNext()}
          disabled={selected >= total - 1}
          className="absolute right-2 top-1/2 z-30 hidden -translate-y-1/2 rounded-full border border-[#c6a15b]/35 bg-black/45 p-3 text-[#e6c987] backdrop-blur disabled:opacity-25 md:flex"
          aria-label="التالي"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        <div className="catalog-viewport h-full min-h-0 w-full" ref={viewportRef} dir="ltr">
          <div className="catalog-track">
            <div className="catalog-slide" dir="rtl">
              <div className="catalog-slide-inner">
                <Cover onOpen={() => go(1)} clocks={clocks.length} decor={decor.length} />
              </div>
            </div>
            <div className="catalog-slide" dir="rtl">
              <div className="catalog-slide-inner">
                <IndexPage
                  clocks={clocks}
                  decor={decor}
                  onPick={(i) => go(productSlide(i))}
                />
              </div>
            </div>
            {clocks.map((item, i) => (
              <div className="catalog-slide" dir="rtl" key={item.id}>
                <div className="catalog-slide-inner">
                  <ProductSpread
                    item={item}
                    no={i + 1}
                    total={clocks.length}
                    active={selected === productSlide(i)}
                  />
                </div>
              </div>
            ))}
            {hasChapter ? (
              <div className="catalog-slide" dir="rtl">
                <div className="catalog-slide-inner">
                  <Chapter
                    title="تحف وديكور"
                    count={decor.length}
                    onOpen={() => go(chapterIndex + 1)}
                  />
                </div>
              </div>
            ) : null}
            {decor.map((item, i) => (
              <div className="catalog-slide" dir="rtl" key={item.id}>
                <div className="catalog-slide-inner">
                  <ProductSpread
                    item={item}
                    no={i + 1}
                    total={decor.length}
                    active={selected === productSlide(clocks.length + i)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-20 flex items-center justify-between gap-3 px-4 pb-[max(0.8rem,env(safe-area-inset-bottom))] pt-2 md:hidden">
        <button
          type="button"
          onClick={() => emblaApi?.scrollPrev()}
          disabled={selected <= 0}
          className="flex-1 rounded-full border border-[#c6a15b]/45 py-3 text-sm font-bold text-[#e6c987] disabled:opacity-30"
        >
          السابق
        </button>
        <div className="catalog-swipe-hint flex shrink-0 items-center gap-1 text-[#c6a15b]">
          <ChevronLeft className="h-4 w-4" />
          <span className="text-[10px] font-semibold tracking-wide text-[#a89a80]">اسحب</span>
          <ChevronRight className="h-4 w-4" />
        </div>
        <button
          type="button"
          onClick={() => emblaApi?.scrollNext()}
          disabled={selected >= total - 1}
          className="flex-1 rounded-full bg-[#c6a15b] py-3 text-sm font-black text-[#141216] disabled:opacity-30"
        >
          التالي
        </button>
      </div>
    </div>
  );
}

function Cover({
  onOpen,
  clocks,
  decor,
}: {
  onOpen: () => void;
  clocks: number;
  decor: number;
}) {
  return (
    <div className="relative flex h-full w-full flex-col justify-between overflow-hidden px-7 py-8 sm:px-14 sm:py-12">
      <div className="catalog-mesh pointer-events-none absolute inset-0" />
      <div className="relative">
        <p className="text-[11px] font-bold tracking-[0.48em] text-[#e6c987]">TAJ · TANTA</p>
        <div className="mt-6 h-px w-14 bg-[#c6a15b]" />
      </div>
      <div className="relative">
        <p className="text-xs font-bold tracking-[0.35em] text-[#c6a15b]">CATALOG</p>
        <h1 className="mt-3 font-display text-6xl leading-none tracking-[0.18em] text-[#f8f0de] sm:text-8xl">TAJ</h1>
        <p className="mt-5 text-3xl font-black text-white sm:text-4xl">كاتلوج المصنع</p>
        <p className="mt-4 max-w-sm text-sm leading-7 text-[#d9cbb0]">
          الساعات أولاً، وبعدين التحف والديكور. اسحب بيدك بين القطع. {clocks} ساعة و {decor} تحفة.
        </p>
      </div>
      <div className="relative flex items-center gap-4">
        <button
          type="button"
          onClick={onOpen}
          className="rounded-full bg-[#c6a15b] px-7 py-3 text-sm font-black text-[#141216]"
        >
          ادخل الكاتلوج
        </button>
        <span className="catalog-swipe-hint hidden items-center gap-1 text-xs font-bold text-[#c6a15b] sm:flex">
          اسحب للتمرير
        </span>
      </div>
    </div>
  );
}

function Chapter({ title, count, onOpen }: { title: string; count: number; onOpen: () => void }) {
  return (
    <div className="relative flex h-full w-full flex-col justify-between overflow-hidden bg-[#0c0b0a] px-7 py-10 sm:px-14">
      <div className="catalog-mesh pointer-events-none absolute inset-0" />
      <p className="relative text-[11px] font-bold tracking-[0.4em] text-[#c6a15b]">NEXT CHAPTER</p>
      <div className="relative">
        <p className="text-xs font-bold tracking-[0.32em] text-[#e6c987]">TAJ</p>
        <h2 className="mt-4 text-5xl font-black text-white sm:text-6xl">{title}</h2>
        <p className="mt-4 max-w-sm text-sm leading-7 text-[#d9cbb0]">
          بوتات وأصص وتحف الديكور. {count} قطعة. اسحب للدخول.
        </p>
      </div>
      <button
        type="button"
        onClick={onOpen}
        className="relative self-start rounded-full bg-[#c6a15b] px-7 py-3 text-sm font-black text-[#141216]"
      >
        عرض التحف
      </button>
    </div>
  );
}

function IndexPage({
  clocks,
  decor,
  onPick,
}: {
  clocks: LookItem[];
  decor: LookItem[];
  onPick: (i: number) => void;
}) {
  return (
    <div
      data-catalog-scroll
      className="h-full overflow-y-auto overscroll-contain bg-[#f6efe3] p-5 text-[#2a2118] sm:p-10"
    >
      <p className="text-[11px] font-bold tracking-[0.32em] text-[#a8853f]">CATALOG INDEX</p>
      <h2 className="mt-2 text-3xl font-black">محتويات الكاتلوج</h2>
      <IndexGroup title="ساعات" items={clocks} start={0} onPick={onPick} />
      <IndexGroup title="تحف وديكور" items={decor} start={clocks.length} onPick={onPick} />
    </div>
  );
}

function IndexGroup({
  title,
  items,
  start,
  onPick,
}: {
  title: string;
  items: LookItem[];
  start: number;
  onPick: (i: number) => void;
}) {
  if (!items.length) return null;
  return (
    <section className="mt-8">
      <p className="text-[11px] font-black tracking-[0.28em] text-[#a8853f]">{title}</p>
      <ol className="mt-3 space-y-0">
        {items.map((item, i) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => onPick(start + i)}
              className="flex w-full items-baseline justify-between gap-3 border-b border-[#e2d4b8] py-2.5 text-right"
            >
              <span className="min-w-0 truncate text-sm font-bold">
                {item.name}
                <span className="mr-2 font-semibold text-[#8a7a5c]"> — {item.size}</span>
              </span>
              <span className="shrink-0 font-display text-sm text-[#a8853f]">{String(i + 1).padStart(2, "0")}</span>
            </button>
          </li>
        ))}
      </ol>
    </section>
  );
}

function CatalogPhoto({ item, active }: { item: LookItem; active: boolean }) {
  return (
    <img
      src={item.image}
      alt={item.name}
      draggable={false}
      loading={active ? "eager" : "lazy"}
      decoding="async"
      className={active ? "catalog-photo-live" : undefined}
    />
  );
}

function ProductSpread({
  item,
  no,
  total,
  active,
}: {
  item: LookItem;
  no: number;
  total: number;
  active: boolean;
}) {
  return (
    <article className="grid h-full min-h-0 w-full grid-rows-[minmax(0,1fr)_auto] bg-[#08080a] lg:grid-cols-[minmax(0,1.55fr)_minmax(280px,0.85fr)] lg:grid-rows-1">
      <div className="catalog-photo relative min-h-0 w-full">
        <CatalogPhoto item={item} active={active} />
      </div>
      <motion.div
        className="relative flex flex-col justify-between gap-3 border-t border-white/5 px-5 py-4 sm:px-8 sm:py-7 lg:border-r lg:border-t-0 lg:border-white/10"
        animate={active ? { opacity: 1, y: 0 } : { opacity: 0.72, y: 10 }}
        transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
      >
        <div>
          <p className="text-[11px] font-bold tracking-[0.28em] text-[#c6a15b]">{LOOK_LABELS[item.kind]}</p>
          <h2 className="mt-2 text-2xl font-black leading-snug text-white sm:text-4xl">{item.name}</h2>
          <div className="mt-4 inline-block border border-[#c6a15b]/70 px-3 py-1.5 text-sm font-bold text-[#e6c987]">
            {item.size}
          </div>
        </div>
        <div className="flex items-center justify-between gap-3">
          <a
            href={waItem(item.name, item.size)}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-full bg-[#c6a15b] px-4 py-2.5 text-xs font-black text-[#141216]"
          >
            <MessageCircle className="h-4 w-4" />
            واتساب
          </a>
          <p className="font-display text-sm text-[#c6a15b]">
            {no} / {total}
          </p>
        </div>
      </motion.div>
    </article>
  );
}

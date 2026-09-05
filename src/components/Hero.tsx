import { motion } from "framer-motion";
import { ArrowDown, MessageCircle } from "lucide-react";
import { FEATURED } from "@/lib/site";
import { WA_LINK } from "./TopBar";

const STATS = [
  { value: "+42K", label: "متابع على فيسبوك" },
  { value: "+200", label: "منتج أصلي" },
  { value: "27", label: "محافظة نشحن لها" },
  { value: "100%", label: "دفع عند الاستلام" },
];

export default function Hero() {
  return (
    <section id="home" className="relative overflow-hidden bg-[#191920]">
      <div className="absolute inset-0 grid grid-cols-4 gap-px opacity-[0.22] sm:grid-cols-4">
        {FEATURED.mosaic.map((src) => (
          <img key={src} src={src} alt="" className="h-full w-full object-cover object-top" />
        ))}
      </div>
      <div className="absolute inset-0 bg-gradient-to-l from-[#191920] via-[#191920]/88 to-[#191920]/55" />
      <div className="absolute -left-32 -top-32 hidden h-96 w-96 rounded-full bg-[#c6a15b]/20 blur-3xl sm:block" />
      <div className="absolute -bottom-24 right-1/4 hidden h-72 w-72 rounded-full bg-[#e6c987]/10 blur-3xl sm:block" />

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-8 px-4 pb-14 pt-10 sm:gap-10 sm:pb-16 sm:pt-20 lg:grid-cols-2 lg:pb-24 lg:pt-24">
        <div className="min-w-0 text-center lg:text-right">
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block max-w-full rounded-full border border-[#c6a15b]/40 bg-[#c6a15b]/10 px-3 py-1.5 text-[11px] font-bold text-[#e6c987] sm:px-4 sm:text-sm"
          >
            مصنع تاج — طنطا، الغربية
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-5 text-[1.85rem] font-black leading-[1.3] text-white sm:text-5xl lg:text-6xl"
          >
            مصنع تاج لساعات الحائط
            <br />
            <span className="text-gold-gradient">والديكور</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-5 max-w-xl break-words text-sm leading-7 text-[#cfc7b4] sm:text-base sm:leading-8 md:text-lg lg:mx-0"
          >
            <strong className="font-black text-white">مصنع تاج</strong> مصنع مصري في طنطا متخصص في
            تصنيع ساعات الحائط وتحف الديكور. الصناعة من المصنع مباشرة، والشحن لكل محافظات مصر،
            والدفع عند الاستلام. للتفاصيل والطلب كلمنا على واتساب.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-7 flex w-full flex-col items-stretch justify-center gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4 lg:justify-start"
          >
            <a
              href="#shop"
              className="bg-gold-gradient rounded-full px-6 py-3 text-center text-sm font-bold text-[#191920] shadow-lg shadow-[#c6a15b]/30 transition-transform hover:scale-105 sm:px-8 sm:py-3.5 sm:text-base"
            >
              تسوّق الآن
            </a>
            <a
              href={WA_LINK}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 rounded-full border border-[#c6a15b]/50 px-6 py-3 text-sm font-bold text-[#e6c987] transition-colors hover:bg-[#c6a15b]/10 sm:px-7 sm:py-3.5 sm:text-base"
            >
              <MessageCircle className="h-5 w-5 shrink-0" />
              اطلب عبر واتساب
            </a>
          </motion.div>
        </div>

        <div className="relative mx-auto w-full max-w-sm md:max-w-md lg:max-w-lg">
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="overflow-hidden rounded-[2rem] bg-[#111113] shadow-2xl shadow-black/50 ring-1 ring-[#c6a15b]/40"
          >
            <img
              src={FEATURED.hero}
              alt={FEATURED.heroAlt}
              className="aspect-[4/5] w-full object-contain object-top p-3 sm:p-4"
            />
          </motion.div>
        </div>
      </div>

      <div className="relative border-t border-white/10 bg-black/25 pb-16 backdrop-blur-sm sm:pb-0">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-7 sm:grid-cols-4">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="text-center"
            >
              <div className="font-display text-3xl font-bold text-[#e6c987]" dir="ltr">
                {s.value}
              </div>
              <div className="mt-1 px-1 text-[11px] font-semibold leading-5 text-[#cfc7b4] sm:text-sm">
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <a
        href="#features"
        className="absolute bottom-24 left-1/2 hidden -translate-x-1/2 text-[#c6a15b] lg:block"
        aria-label="انزل لأسفل"
      >
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>
          <ArrowDown className="h-6 w-6" />
        </motion.div>
      </a>
    </section>
  );
}

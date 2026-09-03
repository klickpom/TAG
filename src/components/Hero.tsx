import { motion } from "framer-motion";
import { ArrowDown, MessageCircle } from "lucide-react";
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
      {/* background */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: "url(/images/products/cover.jpg)" }}
      />
      <div className="absolute inset-0 bg-gradient-to-l from-[#191920] via-[#191920]/85 to-[#191920]/40" />
      <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#c6a15b]/20 blur-3xl" />
      <div className="absolute -bottom-24 right-1/4 h-72 w-72 rounded-full bg-[#e6c987]/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 pb-16 pt-14 sm:pt-20 lg:grid-cols-2 lg:pb-24 lg:pt-24">
        {/* text */}
        <div className="text-center lg:text-right">
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block rounded-full border border-[#c6a15b]/40 bg-[#c6a15b]/10 px-4 py-1.5 text-xs font-bold text-[#e6c987] sm:text-sm"
          >
            مصنع تاج — طنطا، الغربية
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-5 text-4xl font-black leading-[1.25] text-white sm:text-5xl lg:text-6xl"
          >
            فخامة تليق
            <br />
            <span className="text-gold-gradient">ببيتك</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-5 max-w-xl text-base leading-8 text-[#cfc7b4] sm:text-lg lg:mx-0"
          >
            ساعات حائط فاخرة، مزهريات سيراميك، وأطقم ديكور — صناعة مباشرة من
            المصنع بجودة عالية وأسعار لا تُنافس، مع شحن لكل محافظات مصر ودفع
            عند الاستلام.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-4 lg:justify-start"
          >
            <a
              href="#shop"
              className="bg-gold-gradient rounded-full px-8 py-3.5 text-base font-bold text-[#191920] shadow-lg shadow-[#c6a15b]/30 transition-transform hover:scale-105"
            >
              تسوّق الآن
            </a>
            <a
              href={WA_LINK}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-full border border-[#c6a15b]/50 px-7 py-3.5 text-base font-bold text-[#e6c987] transition-colors hover:bg-[#c6a15b]/10"
            >
              <MessageCircle className="h-5 w-5" />
              اطلب عبر واتساب
            </a>
          </motion.div>
        </div>

        {/* floating crown */}
        <div className="relative mx-auto hidden w-full max-w-md sm:block lg:max-w-lg">
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.img
              src="/images/logo.jpeg"
              alt="تاج TAJ"
              animate={{ y: [0, -16, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="w-full rounded-[2rem] object-cover shadow-2xl shadow-black/50 ring-1 ring-[#c6a15b]/40"
            />
          </motion.div>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute -right-6 -top-6 h-24 w-24 rounded-full border-2 border-dashed border-[#c6a15b]/50"
          />
        </div>
      </div>

      {/* stats */}
      <div className="relative border-t border-white/10 bg-black/25 backdrop-blur-sm">
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
              <div className="mt-1 text-xs font-semibold text-[#cfc7b4] sm:text-sm">
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

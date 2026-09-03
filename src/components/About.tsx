import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const POINTS = [
  "تصنيع محلي بخامات مختارة وتشطيبات فاخرة",
  "تشكيلة متجددة من الساعات والمزهريات وأطقم الديكور",
  "من المصنع مباشرة بدون وسطاء",
  "أكثر من 42 ألف متابع يثقون بنا على فيسبوك",
];

export default function About() {
  return (
    <section id="about" className="overflow-x-clip bg-[#f5efe4] py-16 sm:py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 lg:grid-cols-2">
        {/* image */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="relative min-w-0 pb-8"
        >
          <div className="overflow-hidden rounded-[2rem] shadow-2xl shadow-[#191920]/15 ring-1 ring-[#c6a15b]/30">
            <img
              src="/images/products/cover.jpg"
              alt="داخل مصنع تاج"
              className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
          <div className="bg-gold-gradient absolute -bottom-4 right-4 rounded-2xl px-5 py-3 text-center shadow-xl shadow-[#c6a15b]/30 sm:-bottom-6 sm:right-6 sm:px-6 sm:py-4">
            <div className="font-display text-3xl font-bold text-[#191920]" dir="ltr">TAJ</div>
            <div className="text-xs font-bold text-[#191920]/80">صناعة بحب في طنطا</div>
          </div>
        </motion.div>

        {/* text */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
        >
          <span className="text-sm font-bold tracking-wide text-[#a8853f]">عن المصنع</span>
          <h2 className="mt-3 text-3xl font-black leading-snug text-[#191920] sm:text-4xl">
            مصنع تاج…
            <span className="text-gold-gradient"> حيث تبدأ الفخامة</span>
          </h2>
          <p className="mt-5 text-base leading-8 text-[#5d554a]">
            «نحن نسعى في مصنع تاج للوصول لأعلى جودة لإرضاء عملائنا» — من قلب
            طنطا نصنع ساعات الحائط ولوازم الديكور بخامات مختارة وتشطيبات
            دقيقة، ونوصلها لكل محافظات مصر من المصنع مباشرة.
          </p>
          <ul className="mt-6 space-y-3">
            {POINTS.map((p, i) => (
              <motion.li
                key={p}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="flex items-center gap-3 text-sm font-semibold text-[#3d3830]"
              >
                <CheckCircle2 className="h-5 w-5 shrink-0 text-[#c6a15b]" />
                {p}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}

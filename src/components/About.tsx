import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { FEATURED, SITE } from "@/lib/site";

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
          <div className="grid grid-cols-2 gap-3">
            {FEATURED.about.map((shot) => (
              <div
                key={shot.src}
                className="overflow-hidden rounded-[1.4rem] bg-[#111113] shadow-xl shadow-[#191920]/10 ring-1 ring-[#c6a15b]/25"
              >
                <img
                  src={shot.src}
                  alt={shot.alt}
                  className="aspect-[4/5] w-full object-cover object-center"
                />
              </div>
            ))}
          </div>
          <div className="bg-gold-gradient absolute -bottom-4 right-4 rounded-2xl px-5 py-3 text-center shadow-xl shadow-[#c6a15b]/30 sm:-bottom-6 sm:right-6 sm:px-6 sm:py-4">
            <div className="font-display text-3xl font-bold text-[#191920]" dir="ltr">TAJ</div>
            <div className="text-xs font-bold text-[#191920]/80">صناعة بحب في بسيون</div>
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
            مصنع تاج في بسيون
            <span className="text-gold-gradient"> لصناعة ساعات الحائط والديكور</span>
          </h2>
          <p className="mt-5 text-base leading-8 text-[#5d554a]">
            <strong>مصنع تاج</strong> هو مصنع مصري في بسيون بمحافظة الغربية يصنّع ساعات الحائط وتحف
            الديكور والبوتات السيراميك من المصنع مباشرة بدون وسطاء. المقر على الخريطة عند{" "}
            <span dir="ltr">31.013279, 30.8531894</span>، والشحن لكل محافظات مصر مع الدفع عند الاستلام.
          </p>
          <dl className="mt-6 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
            <div className="rounded-2xl border border-[#eadfc9] bg-white px-3 py-3">
              <dt className="text-[11px] font-bold text-[#a8853f]">المقر</dt>
              <dd className="mt-1 font-black text-[#191920]">{SITE.addressAr}</dd>
            </div>
            <div className="rounded-2xl border border-[#eadfc9] bg-white px-3 py-3">
              <dt className="text-[11px] font-bold text-[#a8853f]">التواصل</dt>
              <dd className="mt-1 font-black text-[#191920]" dir="ltr">
                {SITE.phoneDisplay}
              </dd>
            </div>
            <div className="rounded-2xl border border-[#eadfc9] bg-white px-3 py-3">
              <dt className="text-[11px] font-bold text-[#a8853f]">المواعيد</dt>
              <dd className="mt-1 font-black text-[#191920]">10ص – 10م يومياً</dd>
            </div>
            <div className="rounded-2xl border border-[#eadfc9] bg-white px-3 py-3">
              <dt className="text-[11px] font-bold text-[#a8853f]">الشحن</dt>
              <dd className="mt-1 font-black text-[#191920]">كل محافظات مصر</dd>
            </div>
          </dl>
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

import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

const REVIEWS = [
  { name: "أ. محمد السيد", city: "القاهرة", text: "الساعة الشمسية وصلت بحالة ممتازة والتغليف كان محترم جداً. الجودة فاقت توقعاتي بصراحة." },
  { name: "أ. منى عبد الرحمن", city: "طنطا", text: "طلبت طقم فازات هدية لبيتي الجديد، الخامة والتشطيب تحفة والسعر أرخص بكتير من بره." },
  { name: "أ. أحمد الشريف", city: "الإسكندرية", text: "تعامل راقي ورد سريع على الواتساب. ساعة القلب الذهبية شكلها في الحقيقة أجمل من الصور." },
  { name: "أ. هالة محمود", city: "المنصورة", text: "ثاني مرة أطلب منهم — الأصص بالستاندات ظبطت الركن عندي تماماً. شكراً مصنع تاج!" },
];

export default function Testimonials() {
  return (
    <section id="reviews" className="bg-[#191920] py-20">
      <div className="mx-auto max-w-7xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="text-sm font-bold tracking-wide text-[#e6c987]">آراء العملاء</span>
          <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">
            عملاؤنا <span className="text-gold-gradient">يتكلمون</span>
          </h2>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {REVIEWS.map((r, i) => (
            <motion.figure
              key={r.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex flex-col rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur transition-colors hover:border-[#c6a15b]/40"
            >
              <Quote className="h-7 w-7 text-[#c6a15b]" />
              <blockquote className="mt-4 flex-1 text-sm leading-8 text-[#d8d0bf]">
                {r.text}
              </blockquote>
              <div className="mt-4 flex gap-1 text-[#e6c987]">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <figcaption className="mt-3 border-t border-white/10 pt-3">
                <div className="text-sm font-bold text-white">{r.name}</div>
                <div className="text-xs text-[#a89a80]">{r.city}</div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}

import { motion } from "framer-motion";
import { Clock3, Facebook, MapPin, MessageCircle, Music2, Phone } from "lucide-react";
import { FB_LINK, PHONE_DISPLAY, PHONE_TEL, TIKTOK_LINK, WA_LINK } from "./TopBar";

const CARDS = [
  { icon: Phone, title: "اتصل بينا", value: PHONE_DISPLAY, href: PHONE_TEL, ltr: true },
  { icon: MessageCircle, title: "واتساب", value: "راسلنا في أي وقت", href: WA_LINK },
  { icon: Facebook, title: "فيسبوك", value: "تابع جديدنا أول بأول", href: FB_LINK },
  { icon: Music2, title: "تيك توك", value: "فيديوهات المنتجات", href: TIKTOK_LINK },
];

export default function Contact() {
  return (
    <section id="contact" className="bg-[#f5efe4] py-20">
      <div className="mx-auto max-w-7xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="text-sm font-bold tracking-wide text-[#a8853f]">تواصل معنا</span>
          <h2 className="mt-3 text-3xl font-black text-[#191920] sm:text-4xl">
            تواصل مع مصنع تاج <span className="text-gold-gradient">في طنطا</span>
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-[#7a6f60]">
            اطلب ساعات الحائط وتحف الديكور عبر واتساب 01010841285. المصنع في طنطا، والشحن لكل محافظات مصر مع الدفع عند الاستلام.
          </p>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CARDS.map((c, i) => (
            <motion.a
              key={c.title}
              href={c.href}
              target={c.href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group rounded-2xl border border-[#eadfc9] bg-white p-6 text-center shadow-sm transition-all hover:-translate-y-1.5 hover:border-[#c6a15b] hover:shadow-xl hover:shadow-[#c6a15b]/10"
            >
              <div className="bg-gold-gradient mx-auto flex h-12 w-12 items-center justify-center rounded-full text-white shadow-md shadow-[#c6a15b]/30 transition-transform group-hover:scale-110">
                <c.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-bold text-[#191920]">{c.title}</h3>
              <p className="mt-1 text-sm text-[#7a6f60]" dir={c.ltr ? "ltr" : undefined}>
                {c.value}
              </p>
            </motion.a>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-8 flex flex-col items-center justify-center gap-4 rounded-2xl bg-[#191920] px-6 py-8 text-center sm:flex-row sm:gap-12"
        >
          <div className="flex items-center gap-3 text-[#e9e2d4]">
            <MapPin className="h-5 w-5 text-[#c6a15b]" />
            <span className="text-sm font-semibold">طنطا — محافظة الغربية، مصر</span>
          </div>
          <div className="hidden h-8 w-px bg-white/15 sm:block" />
          <div className="flex items-center gap-3 text-[#e9e2d4]">
            <Clock3 className="h-5 w-5 text-[#c6a15b]" />
            <span className="text-sm font-semibold">متاحين يومياً من 10 صباحاً حتى 10 مساءً</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

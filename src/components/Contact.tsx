import { useState } from "react";
import { motion } from "framer-motion";
import { Clock3, Facebook, MapPin, MessageCircle, Music2, Navigation, Phone } from "lucide-react";
import { SITE } from "@/lib/site";
import { FB_LINK, PHONE_DISPLAY, PHONE_TEL, TIKTOK_LINK, WA_LINK } from "./TopBar";

const CARDS = [
  { icon: Phone, title: "اتصل بينا", value: PHONE_DISPLAY, href: PHONE_TEL, ltr: true },
  { icon: MessageCircle, title: "واتساب", value: "راسلنا في أي وقت", href: WA_LINK },
  { icon: Facebook, title: "فيسبوك", value: "تابع جديدنا أول بأول", href: FB_LINK },
  { icon: Music2, title: "تيك توك", value: "فيديوهات المنتجات", href: TIKTOK_LINK },
];

function FactoryMap() {
  const [live, setLive] = useState(false);

  return (
    <div
      id="location"
      className="mt-8 overflow-hidden rounded-[1.6rem] border border-[#eadfc9] bg-white shadow-sm lg:grid lg:grid-cols-[minmax(16rem,0.9fr)_minmax(0,1.2fr)]"
    >
      <div className="flex flex-col justify-center gap-5 bg-[#191920] px-5 py-7 sm:px-8 sm:py-9">
        <div className="flex items-center gap-3">
          <span className="bg-gold-gradient flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-[#191920]">
            <MapPin className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs font-bold tracking-wide text-[#c6a15b]">موقع المصنع</p>
            <h3 className="text-lg font-black text-white sm:text-xl">زور مصنع تاج</h3>
          </div>
        </div>
        <p className="text-sm leading-7 text-[#e9e2d4] sm:text-base">
          {SITE.legalName}
          <br />
          {SITE.addressAr}
        </p>
        <p className="text-xs font-semibold tracking-wide text-[#cfc7b4]" dir="ltr">
          {SITE.geo.lat}, {SITE.geo.lng}
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <a
            href={SITE.maps}
            target="_blank"
            rel="noreferrer"
            className="bg-gold-gradient inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-black text-[#191920]"
          >
            <MapPin className="h-4 w-4" />
            افتح في خرائط جوجل
          </a>
          <a
            href={SITE.mapsDirections}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-[#c6a15b]/50 px-5 py-3 text-sm font-bold text-[#e6c987]"
          >
            <Navigation className="h-4 w-4" />
            الاتجاهات
          </a>
          <a
            href={SITE.mapsApple}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-full px-4 py-3 text-xs font-semibold text-[#cfc7b4] underline-offset-4 hover:text-[#e6c987] hover:underline sm:px-2"
          >
            خرائط آبل
          </a>
        </div>
        <div className="flex items-center gap-3 border-t border-white/10 pt-5 text-[#e9e2d4]">
          <Clock3 className="h-5 w-5 shrink-0 text-[#c6a15b]" />
          <span className="text-sm font-semibold">{SITE.hoursAr}</span>
        </div>
      </div>

      <div className="relative h-56 min-h-[14rem] w-full sm:h-80 md:h-96 lg:h-full lg:min-h-[28rem]">
        <iframe
          title="موقع مصنع تاج في بسيون على الخريطة"
          src={SITE.mapsEmbed}
          className={`h-full w-full border-0 ${live ? "" : "pointer-events-none"}`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
        {live ? null : (
          <button
            type="button"
            onClick={() => setLive(true)}
            className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-[#191920]/55 via-transparent to-transparent pb-4"
          >
            <span className="rounded-full bg-[#191920]/90 px-4 py-2 text-xs font-bold text-[#e6c987] shadow-lg">
              اضغط لتحريك الخريطة
            </span>
          </button>
        )}
      </div>
    </div>
  );
}

export default function Contact() {
  return (
    <section id="contact" className="bg-[#f5efe4] py-16 sm:py-20">
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
            تواصل مع مصنع تاج <span className="text-gold-gradient">في بسيون</span>
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-[#7a6f60]">
            اطلب ساعات الحائط وتحف الديكور عبر واتساب 01010841285. المصنع في بسيون، والشحن لكل محافظات مصر مع الدفع عند الاستلام.
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
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <FactoryMap />
        </motion.div>
      </div>
    </section>
  );
}

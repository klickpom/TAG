import { Facebook, MessageCircle, Music2 } from "lucide-react";
import { FB_LINK, PHONE_DISPLAY, PHONE_TEL, TIKTOK_LINK, WA_LINK } from "./TopBar";

export default function Footer() {
  return (
    <footer className="bg-[#111116] py-12 text-[#cfc7b4]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            <img
              src="/images/logo.jpeg"
              alt="TAJ"
              className="h-12 w-12 rounded-full object-cover ring-2 ring-[#c6a15b]/60"
            />
            <span className="font-display text-2xl font-bold tracking-[0.25em] text-white">
              TAJ
            </span>
          </div>
          <p className="mt-4 text-sm leading-7">
            مصنع تاج لساعات الحائط ولوازم الديكور — جودة المصنع مباشرة من طنطا
            لكل بيت في مصر.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-bold text-[#e6c987]">روابط سريعة</h4>
          <ul className="mt-4 space-y-2 text-sm">
            {[
              ["#home", "الرئيسية"],
              ["#about", "عن المصنع"],
              ["#shop", "المعرض"],
              ["/catalog", "الكاتلوج"],
              ["#reviews", "آراء العملاء"],
              ["#contact", "تواصل معنا"],
            ].map(([href, label]) => (
              <li key={href}>
                <a href={href} className="transition-colors hover:text-[#e6c987]">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold text-[#e6c987]">تابعنا</h4>
          <div className="mt-4 flex gap-3">
            {[
              { icon: Facebook, href: FB_LINK, label: "فيسبوك" },
              { icon: MessageCircle, href: WA_LINK, label: "واتساب" },
              { icon: Music2, href: TIKTOK_LINK, label: "تيك توك" },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                className="rounded-full border border-white/15 p-2.5 transition-all hover:border-[#c6a15b] hover:text-[#e6c987]"
              >
                <s.icon className="h-5 w-5" />
              </a>
            ))}
          </div>
          <a
            href={PHONE_TEL}
            className="mt-4 block text-sm font-semibold text-[#e6c987]"
            dir="ltr"
          >
            {PHONE_DISPLAY}
          </a>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-7xl border-t border-white/10 px-4 pt-6 text-center text-xs text-[#8b8172]">
        مصنع تاج © 2026 — جميع الحقوق محفوظة
      </div>
    </footer>
  );
}

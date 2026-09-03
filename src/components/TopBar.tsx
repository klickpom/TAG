import { Phone, Truck } from "lucide-react";

export const PHONE_DISPLAY = "0101 084 1285";
export const PHONE_TEL = "tel:+201010841285";
export const WA_NUMBER = "201010841285";
export const WA_LINK = `https://wa.me/${WA_NUMBER}`;
export const FB_LINK = "https://www.facebook.com/profile.php?id=61591849934315";
export const TIKTOK_LINK = "https://www.tiktok.com";

export default function TopBar() {
  return (
    <div className="bg-[#191920] text-[#e9e2d4] text-xs sm:text-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2">
        <div className="flex items-center gap-2">
          <Truck className="h-4 w-4 text-[#c6a15b]" />
          <span>شحن لجميع المحافظات — دفع عند الاستلام</span>
        </div>
        <a
          href={PHONE_TEL}
          className="flex items-center gap-2 transition-colors hover:text-[#e6c987]"
          dir="ltr"
        >
          <Phone className="h-4 w-4 text-[#c6a15b]" />
          <span className="font-semibold tracking-wide">{PHONE_DISPLAY}</span>
        </a>
      </div>
    </div>
  );
}

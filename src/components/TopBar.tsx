import { Phone, Truck } from "lucide-react";

export const PHONE_DISPLAY = "0101 084 1285";
export const PHONE_TEL = "tel:+201010841285";
export const WA_NUMBER = "201010841285";
export const WA_LINK = `https://wa.me/${WA_NUMBER}`;
export const FB_LINK = "https://www.facebook.com/profile.php?id=61591849934315";
export const TIKTOK_LINK = "https://www.tiktok.com";

export default function TopBar() {
  return (
    <div className="bg-[#191920] text-[#e9e2d4] text-[11px] sm:text-sm">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-2 px-4 py-2 sm:gap-3">
        <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
          <Truck className="h-3.5 w-3.5 shrink-0 text-[#c6a15b] sm:h-4 sm:w-4" />
          <span className="truncate">
            <span className="sm:hidden">شحن لكل المحافظات</span>
            <span className="hidden sm:inline">شحن لجميع المحافظات — دفع عند الاستلام</span>
          </span>
        </div>
        <a
          href={PHONE_TEL}
          className="flex shrink-0 items-center gap-1.5 whitespace-nowrap transition-colors hover:text-[#e6c987] sm:gap-2"
          dir="ltr"
        >
          <Phone className="h-3.5 w-3.5 text-[#c6a15b] sm:h-4 sm:w-4" />
          <span className="font-semibold tracking-wide">{PHONE_DISPLAY}</span>
        </a>
      </div>
    </div>
  );
}

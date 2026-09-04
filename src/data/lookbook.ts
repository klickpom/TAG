export type LookKind = "clocks" | "pots";

export interface LookItem {
  id: string;
  name: string;
  image: string;
  kind: LookKind;
  size: string;
  price: string;
}

export const LOOK_LABELS: Record<LookKind | "all", string> = {
  all: "الكل",
  clocks: "ساعات",
  pots: "تحف وديكور",
};

export function sortCatalogItems(items: LookItem[]): LookItem[] {
  const clocks: LookItem[] = [];
  const decor: LookItem[] = [];
  for (const item of items) {
    if (item.kind === "clocks") clocks.push(item);
    else decor.push(item);
  }
  return [...clocks, ...decor];
}

export const LOOKBOOK: LookItem[] = sortCatalogItems([
  { id: "lb01", name: "بوت مرجانة صغير", image: "/images/lookbook/lb-01.png", kind: "pots", size: "ارتفاع 20 سم × عرض 18 سم", price: "27 جنيه" },
  { id: "lb02", name: "بوت بابلز بدون رجل", image: "/images/lookbook/lb-02.png", kind: "pots", size: "ارتفاع 28 سم × عرض 22 سم", price: "55 جنيه" },
  { id: "lb03", name: "بوت فراولة فك وتركيب", image: "/images/lookbook/lb-03.png", kind: "pots", size: "ارتفاع 25.5 سم × عرض 25 سم", price: "75 جنيه" },
  { id: "lb04", name: "ساعة غزالة", image: "/images/lookbook/lb-04.png", kind: "clocks", size: "مقاس 40 × 50 سم", price: "145 جنيه" },
  { id: "lb05", name: "ساعة غزالة بندول", image: "/images/lookbook/lb-05.png", kind: "clocks", size: "مقاس 65 × 40 سم", price: "165 جنيه" },
  { id: "lb06", name: "ساعة غزالة كبير", image: "/images/lookbook/lb-06.png", kind: "clocks", size: "مقاس 50 × 40 سم", price: "145 جنيه" },
  { id: "lb07", name: "ساعة غزالة وسط", image: "/images/lookbook/lb-07.png", kind: "clocks", size: "مقاس 36 × 39 سم", price: "105 جنيه" },
  { id: "lb08", name: "ساعة ميدان كبير", image: "/images/lookbook/lb-08.png", kind: "clocks", size: "مقاس 40 × 40 سم", price: "145 جنيه" },
  { id: "lb09", name: "ساعة مطبخ", image: "/images/lookbook/lb-09.png", kind: "clocks", size: "مقاس 28 × 34 سم", price: "80 جنيه" },
  { id: "lb10", name: "ساعة تاج بندول", image: "/images/lookbook/lb-10.png", kind: "clocks", size: "مقاس 72 × 34 سم", price: "210 جنيه" },
  { id: "lb11", name: "ساعة ميدان", image: "/images/lookbook/lb-11.png", kind: "clocks", size: "مقاس 36 × 36 سم", price: "95 جنيه" },
  { id: "lb12", name: "ساعة ميدان وسط", image: "/images/lookbook/lb-12.png", kind: "clocks", size: "مقاس 30 × 30 سم", price: "105 جنيه" },
  { id: "lb13", name: "ساعة قلب فيونكة", image: "/images/lookbook/lb-13.png", kind: "clocks", size: "مقاس 45 × 50 سم", price: "130 جنيه" },
  { id: "lb14", name: "ساعة كيتي", image: "/images/lookbook/lb-14.png", kind: "clocks", size: "مقاس 28 × 36 سم", price: "105 جنيه" },
  { id: "lb15", name: "ساعة سلسلة", image: "/images/lookbook/lb-15.png", kind: "clocks", size: "مقاس 49 × 49 سم", price: "130 جنيه" },
  { id: "lb16", name: "بوت شبح", image: "/images/lookbook/lb-16.png", kind: "pots", size: "ارتفاع 55 سم × عرض 38 سم", price: "150 جنيه" },
  { id: "lb17", name: "بوت هامر بشريط", image: "/images/lookbook/lb-17.png", kind: "pots", size: "ارتفاع 22.5 سم × عرض 22.5 سم", price: "35 جنيه" },
  { id: "lb18", name: "ساعة وردة استرس", image: "/images/lookbook/lb-18.png", kind: "clocks", size: "مقاس 46 × 46 سم", price: "165 جنيه" },
  { id: "lb19", name: "ساعة مرايا قلب", image: "/images/lookbook/lb-19.png", kind: "clocks", size: "مقاس 48 × 48 سم", price: "175 جنيه" },
  { id: "lb20", name: "ساعة مرايا شمس", image: "/images/lookbook/lb-20.png", kind: "clocks", size: "مقاس 48 × 48 سم", price: "175 جنيه" },
  { id: "lb21", name: "مبخرة برجل", image: "/images/lookbook/lb-21.png", kind: "pots", size: "أشكال متعددة", price: "14 جنيه" },
  { id: "lb22", name: "بوت زلعة برجل", image: "/images/lookbook/lb-22.png", kind: "pots", size: "ارتفاع 20 سم × عرض 14 سم", price: "22 جنيه" },
  { id: "lb23", name: "بوت مدفع", image: "/images/lookbook/lb-23.png", kind: "pots", size: "ارتفاع 26 سم × عرض 26 سم", price: "55 جنيه" },
  { id: "lb24", name: "بوت مدفع", image: "/images/lookbook/lb-24.png", kind: "pots", size: "ارتفاع 75 سم × عرض 28 سم", price: "160 جنيه" },
  { id: "lb25", name: "بوت جامبو", image: "/images/lookbook/lb-24.png", kind: "pots", size: "ارتفاع 70 سم × عرض 28 سم", price: "175 جنيه" },
  { id: "lb26", name: "بوت سلسلة صغير", image: "/images/lookbook/lb-25.png", kind: "pots", size: "ارتفاع 40 سم × عرض 29 سم", price: "70 جنيه" },
  { id: "lb27", name: "بوت كلاسيك كبير", image: "/images/lookbook/lb-26.png", kind: "pots", size: "ارتفاع 30 سم × عرض 26 سم", price: "55 جنيه" },
  { id: "lb28", name: "بوت كلاسيك صغير", image: "/images/lookbook/lb-26.png", kind: "pots", size: "ارتفاع 26 سم × عرض 23 سم", price: "50 جنيه" },
  { id: "lb29", name: "بوت سلسلة صغير", image: "/images/lookbook/lb-27.png", kind: "pots", size: "ارتفاع 14.5 سم × عرض 15.5 سم", price: "17 جنيه" },
  { id: "lb30", name: "بوت بسطا عادي", image: "/images/lookbook/lb-28.png", kind: "pots", size: "ارتفاع 25 سم × عرض 30 سم", price: "50 جنيه" },
  { id: "lb31", name: "بوت زلعة عادي", image: "/images/lookbook/lb-29.png", kind: "pots", size: "ارتفاع 14 سم × عرض 14 سم", price: "14 جنيه" },
  { id: "lb32", name: "بوت زلعة لوكس", image: "/images/lookbook/lb-29.png", kind: "pots", size: "ارتفاع 16.5 سم × عرض 14 سم", price: "18 جنيه" },
  { id: "lb33", name: "بوت بسطا صغير", image: "/images/lookbook/lb-30.png", kind: "pots", size: "ارتفاع 13 سم × عرض 16 سم", price: "14 جنيه" },
  { id: "lb34", name: "بوت بسطا لوكس", image: "/images/lookbook/lb-31.png", kind: "pots", size: "ارتفاع 28 سم × عرض 30 سم", price: "55 جنيه" },
  { id: "lb35", name: "بوت طاقة", image: "/images/lookbook/lb-32.png", kind: "pots", size: "ارتفاع 33 سم × عرض 25 سم", price: "55 جنيه" },
  { id: "lb36", name: "مقلمة", image: "/images/lookbook/lb-33.png", kind: "pots", size: "ارتفاع 11 سم × عرض 10 سم", price: "9 جنيه" },
  { id: "lb37", name: "بوت بابلز", image: "/images/lookbook/lb-34.png", kind: "pots", size: "ارتفاع 28 سم × عرض 22 سم", price: "55 جنيه" },
  { id: "lb38", name: "بوت تريندس برجل", image: "/images/lookbook/lb-35.png", kind: "pots", size: "ارتفاع 40 سم × عرض 36 سم", price: "78 جنيه" },
  { id: "lb39", name: "بوت شمعدان برجل", image: "/images/lookbook/lb-36.png", kind: "pots", size: "ارتفاع 50 سم × عرض 25 سم", price: "78 جنيه" },
  { id: "lb40", name: "بوت ضفيرة برجل", image: "/images/lookbook/lb-37.png", kind: "pots", size: "ارتفاع 48 سم × عرض 22 سم", price: "75 جنيه" },
  { id: "lb41", name: "بوت ضفيرة", image: "/images/lookbook/lb-38.png", kind: "pots", size: "ارتفاع 28 سم × عرض 22 سم", price: "55 جنيه" },
  { id: "lb42", name: "بوت سلسلة كبير", image: "/images/lookbook/lb-39.png", kind: "pots", size: "ارتفاع 33 سم × عرض 30 سم", price: "60 جنيه" },
  { id: "lb43", name: "تريندس لوكس", image: "/images/lookbook/lb-40.png", kind: "pots", size: "ارتفاع 33 سم × عرض 36 سم", price: "60 جنيه" },
  { id: "lb44", name: "بوت تريندس", image: "/images/lookbook/lb-41.png", kind: "pots", size: "ارتفاع 30 سم × عرض 36 سم", price: "55 جنيه" },
  { id: "lb45", name: "بوت لوكس أكريلك", image: "/images/lookbook/lb-42.png", kind: "pots", size: "ارتفاع 50 سم × عرض 28 سم", price: "110 جنيه" },
  { id: "lb46", name: "بوت بابلز برجل", image: "/images/lookbook/lb-43.png", kind: "pots", size: "ارتفاع 48 سم × عرض 22 سم", price: "75 جنيه" },
]);

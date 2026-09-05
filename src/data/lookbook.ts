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

const shot = (n: string) => `/images/lookbook/lb-${n}.png`;

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
  { id: "lb01", name: "بوت مرجانة صغير", image: shot("01"), kind: "pots", size: "ارتفاع 20 سم × عرض 18 سم", price: "27 جنيه" },
  { id: "lb02", name: "بوت بابلز بدون رجل", image: shot("02"), kind: "pots", size: "ارتفاع 28 سم × عرض 22 سم", price: "55 جنيه" },
  { id: "lb03", name: "بوت فراولة فك وتركيب", image: shot("03"), kind: "pots", size: "ارتفاع 25.5 سم × عرض 25 سم", price: "75 جنيه" },
  { id: "lb04", name: "ساعة غزالة", image: shot("04"), kind: "clocks", size: "مقاس 40 × 50 سم", price: "145 جنيه" },
  { id: "lb05", name: "ساعة غزالة بندول", image: shot("05"), kind: "clocks", size: "مقاس 65 × 40 سم", price: "165 جنيه" },
  { id: "lb06", name: "ساعة غزالة كبير", image: shot("06"), kind: "clocks", size: "مقاس 50 × 40 سم", price: "145 جنيه" },
  { id: "lb07", name: "ساعة غزالة وسط", image: shot("07"), kind: "clocks", size: "مقاس 36 × 39 سم", price: "105 جنيه" },
  { id: "lb08", name: "ساعة ميدان كبير", image: shot("08"), kind: "clocks", size: "مقاس 40 × 40 سم", price: "145 جنيه" },
  { id: "lb09", name: "ساعة مطبخ", image: shot("09"), kind: "clocks", size: "مقاس 28 × 34 سم", price: "80 جنيه" },
  { id: "lb10", name: "ساعة تاج بندول", image: shot("10"), kind: "clocks", size: "مقاس 72 × 34 سم", price: "210 جنيه" },
  { id: "lb11", name: "ساعة ميدان", image: shot("11"), kind: "clocks", size: "مقاس 36 × 36 سم", price: "95 جنيه" },
  { id: "lb12", name: "ساعة ميدان وسط", image: shot("12"), kind: "clocks", size: "مقاس 30 × 30 سم", price: "105 جنيه" },
  { id: "lb13", name: "ساعة قلب فيونكة", image: shot("13"), kind: "clocks", size: "مقاس 45 × 50 سم", price: "130 جنيه" },
  { id: "lb14", name: "ساعة كيتي", image: shot("14"), kind: "clocks", size: "مقاس 28 × 36 سم", price: "105 جنيه" },
  { id: "lb15", name: "ساعة سلسلة", image: shot("15"), kind: "clocks", size: "مقاس 49 × 49 سم", price: "130 جنيه" },
  { id: "lb16", name: "بوت شبح", image: shot("16"), kind: "pots", size: "ارتفاع 55 سم × عرض 38 سم", price: "150 جنيه" },
  { id: "lb17", name: "بوت هامر بشريط", image: shot("17"), kind: "pots", size: "ارتفاع 22.5 سم × عرض 22.5 سم", price: "35 جنيه" },
  { id: "lb18", name: "ساعة وردة استرس", image: shot("18"), kind: "clocks", size: "مقاس 46 × 46 سم", price: "165 جنيه" },
  { id: "lb19", name: "ساعة مرايا قلب", image: shot("19"), kind: "clocks", size: "مقاس 48 × 48 سم", price: "175 جنيه" },
  { id: "lb20", name: "ساعة مرايا شمس", image: shot("20"), kind: "clocks", size: "مقاس 48 × 48 سم", price: "175 جنيه" },
  { id: "lb21", name: "مبخرة برجل", image: shot("21"), kind: "pots", size: "أشكال متعددة", price: "14 جنيه" },
  { id: "lb22", name: "بوت زلعة برجل", image: shot("22"), kind: "pots", size: "ارتفاع 20 سم × عرض 14 سم", price: "22 جنيه" },
  { id: "lb23", name: "بوت مدفع", image: shot("23"), kind: "pots", size: "ارتفاع 26 سم × عرض 26 سم", price: "55 جنيه" },
  { id: "lb24", name: "بوت مدفع", image: shot("24"), kind: "pots", size: "ارتفاع 75 سم × عرض 28 سم", price: "160 جنيه" },
  { id: "lb25", name: "بوت جامبو", image: shot("24"), kind: "pots", size: "ارتفاع 70 سم × عرض 28 سم", price: "175 جنيه" },
  { id: "lb26", name: "بوت سلسلة صغير", image: shot("25"), kind: "pots", size: "ارتفاع 40 سم × عرض 29 سم", price: "70 جنيه" },
  { id: "lb27", name: "بوت كلاسيك كبير", image: shot("26"), kind: "pots", size: "ارتفاع 30 سم × عرض 26 سم", price: "55 جنيه" },
  { id: "lb28", name: "بوت كلاسيك صغير", image: shot("26"), kind: "pots", size: "ارتفاع 26 سم × عرض 23 سم", price: "50 جنيه" },
  { id: "lb29", name: "بوت سلسلة صغير", image: shot("27"), kind: "pots", size: "ارتفاع 14.5 سم × عرض 15.5 سم", price: "17 جنيه" },
  { id: "lb30", name: "بوت بسطا عادي", image: shot("28"), kind: "pots", size: "ارتفاع 25 سم × عرض 30 سم", price: "50 جنيه" },
  { id: "lb31", name: "بوت زلعة عادي", image: shot("29"), kind: "pots", size: "ارتفاع 14 سم × عرض 14 سم", price: "14 جنيه" },
  { id: "lb32", name: "بوت زلعة لوكس", image: shot("29"), kind: "pots", size: "ارتفاع 16.5 سم × عرض 14 سم", price: "18 جنيه" },
  { id: "lb33", name: "بوت بسطا صغير", image: shot("30"), kind: "pots", size: "ارتفاع 13 سم × عرض 16 سم", price: "14 جنيه" },
  { id: "lb34", name: "بوت بسطا لوكس", image: shot("31"), kind: "pots", size: "ارتفاع 28 سم × عرض 30 سم", price: "55 جنيه" },
  { id: "lb35", name: "بوت طاقة", image: shot("32"), kind: "pots", size: "ارتفاع 33 سم × عرض 25 سم", price: "55 جنيه" },
  { id: "lb36", name: "مقلمة", image: shot("33"), kind: "pots", size: "ارتفاع 11 سم × عرض 10 سم", price: "9 جنيه" },
  { id: "lb37", name: "بوت بابلز", image: shot("34"), kind: "pots", size: "ارتفاع 28 سم × عرض 22 سم", price: "55 جنيه" },
  { id: "lb38", name: "بوت تريندس برجل", image: shot("35"), kind: "pots", size: "ارتفاع 40 سم × عرض 36 سم", price: "78 جنيه" },
  { id: "lb39", name: "بوت شمعدان برجل", image: shot("36"), kind: "pots", size: "ارتفاع 50 سم × عرض 25 سم", price: "78 جنيه" },
  { id: "lb40", name: "بوت ضفيرة برجل", image: shot("37"), kind: "pots", size: "ارتفاع 48 سم × عرض 22 سم", price: "75 جنيه" },
  { id: "lb41", name: "بوت ضفيرة", image: shot("38"), kind: "pots", size: "ارتفاع 28 سم × عرض 22 سم", price: "55 جنيه" },
  { id: "lb42", name: "بوت سلسلة كبير", image: shot("39"), kind: "pots", size: "ارتفاع 33 سم × عرض 30 سم", price: "60 جنيه" },
  { id: "lb43", name: "تريندس لوكس", image: shot("40"), kind: "pots", size: "ارتفاع 33 سم × عرض 36 سم", price: "60 جنيه" },
  { id: "lb44", name: "بوت تريندس", image: shot("41"), kind: "pots", size: "ارتفاع 30 سم × عرض 36 سم", price: "55 جنيه" },
  { id: "lb45", name: "بوت لوكس أكريلك", image: shot("42"), kind: "pots", size: "ارتفاع 50 سم × عرض 28 سم", price: "110 جنيه" },
  { id: "lb46", name: "بوت بابلز برجل", image: shot("43"), kind: "pots", size: "ارتفاع 48 سم × عرض 22 سم", price: "75 جنيه" },
]);

export function catalogPhoto(item: Pick<LookItem, "id" | "image">) {
  return LOOKBOOK.find((row) => row.id === item.id)?.image || item.image;
}

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

const img = (file: string) => `/api/media.php?f=${file}`;

export const LOOKBOOK: LookItem[] = sortCatalogItems([
  { id: "lb01", name: "بوت مرجانة صغير", image: img("lb-20260904194820-bc9c2c.jpg"), kind: "pots", size: "ارتفاع 20 سم × عرض 18 سم", price: "27 جنيه" },
  { id: "lb02", name: "بوت بابلز بدون رجل", image: img("lb-20260904145206-34006f.jpg"), kind: "pots", size: "ارتفاع 28 سم × عرض 22 سم", price: "55 جنيه" },
  { id: "lb03", name: "بوت فراولة فك وتركيب", image: img("lb-20260904145443-f922ca.jpg"), kind: "pots", size: "ارتفاع 25.5 سم × عرض 25 سم", price: "75 جنيه" },
  { id: "lb04", name: "ساعة غزالة", image: img("lb-20260904145448-e29c5a.jpg"), kind: "clocks", size: "مقاس 40 × 50 سم", price: "145 جنيه" },
  { id: "lb05", name: "ساعة غزالة بندول", image: img("lb-20260904145913-e6550b.jpg"), kind: "clocks", size: "مقاس 65 × 40 سم", price: "165 جنيه" },
  { id: "lb06", name: "ساعة غزالة كبير", image: img("lb-20260904145448-e29c5a.jpg"), kind: "clocks", size: "مقاس 50 × 40 سم", price: "145 جنيه" },
  { id: "lb07", name: "ساعة غزالة وسط", image: img("lb-20260904145448-e29c5a.jpg"), kind: "clocks", size: "مقاس 36 × 39 سم", price: "105 جنيه" },
  { id: "lb08", name: "ساعة ميدان كبير", image: img("lb-20260904154259-91f0fb.jpg"), kind: "clocks", size: "مقاس 40 × 40 سم", price: "145 جنيه" },
  { id: "lb09", name: "ساعة مطبخ", image: img("lb-20260904154526-a3bc2d.jpg"), kind: "clocks", size: "مقاس 28 × 34 سم", price: "80 جنيه" },
  { id: "lb10", name: "ساعة تاج بندول", image: img("lb-20260904154622-e6b697.jpg"), kind: "clocks", size: "مقاس 72 × 34 سم", price: "210 جنيه" },
  { id: "lb11", name: "ساعة ميدان", image: img("lb-20260904154259-91f0fb.jpg"), kind: "clocks", size: "مقاس 36 × 36 سم", price: "95 جنيه" },
  { id: "lb12", name: "ساعة ميدان وسط", image: img("lb-20260904154823-1a622e.jpg"), kind: "clocks", size: "مقاس 30 × 30 سم", price: "105 جنيه" },
  { id: "lb13", name: "ساعة قلب فيونكة", image: img("lb-20260904145716-3246ed.jpg"), kind: "clocks", size: "مقاس 45 × 50 سم", price: "130 جنيه" },
  { id: "lb14", name: "ساعة كيتي", image: img("lb-20260904154941-044fd7.jpg"), kind: "clocks", size: "مقاس 28 × 36 سم", price: "105 جنيه" },
  { id: "lb15", name: "ساعة سلسلة", image: img("lb-20260904155045-e7ea8f.jpg"), kind: "clocks", size: "مقاس 49 × 49 سم", price: "130 جنيه" },
  { id: "lb16", name: "بوت شبح", image: img("lb-20260904152315-5ddd02.jpg"), kind: "pots", size: "ارتفاع 55 سم × عرض 38 سم", price: "150 جنيه" },
  { id: "lb17", name: "بوت هامر بشريط", image: img("lb-20260904152347-6e8da5.jpg"), kind: "pots", size: "ارتفاع 22.5 سم × عرض 22.5 سم", price: "35 جنيه" },
  { id: "lb18", name: "ساعة وردة استرس", image: img("lb-20260904155409-a25624.jpg"), kind: "clocks", size: "مقاس 46 × 46 سم", price: "165 جنيه" },
  { id: "lb19", name: "ساعة مرايا قلب", image: img("lb-20260904155416-a27e23.jpg"), kind: "clocks", size: "مقاس 48 × 48 سم", price: "175 جنيه" },
  { id: "lb20", name: "ساعة مرايا شمس", image: img("lb-20260904155418-f2b849.jpg"), kind: "clocks", size: "مقاس 48 × 48 سم", price: "175 جنيه" },
  { id: "lb21", name: "مبخرة برجل", image: img("lb-20260904150418-80a7fc.jpg"), kind: "pots", size: "أشكال متعددة", price: "14 جنيه" },
  { id: "lb22", name: "بوت زلعة برجل", image: img("lb-20260904153950-49860c.jpg"), kind: "pots", size: "ارتفاع 20 سم × عرض 14 سم", price: "22 جنيه" },
  { id: "lb23", name: "بوت مدفع", image: img("lb-20260904151113-d051c8.jpg"), kind: "pots", size: "ارتفاع 26 سم × عرض 26 سم", price: "55 جنيه" },
  { id: "lb24", name: "بوت مدفع", image: img("lb-20260904152420-ba1c2f.jpg"), kind: "pots", size: "ارتفاع 75 سم × عرض 28 سم", price: "160 جنيه" },
  { id: "lb25", name: "بوت جامبو", image: img("lb-20260904152420-ba1c2f.jpg"), kind: "pots", size: "ارتفاع 70 سم × عرض 28 سم", price: "175 جنيه" },
  { id: "lb26", name: "بوت سلسلة صغير", image: img("lb-20260904151641-d035d8.jpg"), kind: "pots", size: "ارتفاع 40 سم × عرض 29 سم", price: "70 جنيه" },
  { id: "lb27", name: "بوت كلاسيك كبير", image: img("lb-20260904144701-0fc945.jpg"), kind: "pots", size: "ارتفاع 30 سم × عرض 26 سم", price: "55 جنيه" },
  { id: "lb28", name: "بوت كلاسيك صغير", image: img("lb-20260904144701-0fc945.jpg"), kind: "pots", size: "ارتفاع 26 سم × عرض 23 سم", price: "50 جنيه" },
  { id: "lb29", name: "بوت سلسلة صغير", image: img("lb-20260904151952-2221cb.jpg"), kind: "pots", size: "ارتفاع 14.5 سم × عرض 15.5 سم", price: "17 جنيه" },
  { id: "lb30", name: "بوت بسطا عادي", image: img("lb-20260904145213-1c9aca.jpg"), kind: "pots", size: "ارتفاع 25 سم × عرض 30 سم", price: "50 جنيه" },
  { id: "lb31", name: "بوت زلعة عادي", image: img("lb-20260904150444-945f2a.jpg"), kind: "pots", size: "ارتفاع 14 سم × عرض 14 سم", price: "14 جنيه" },
  { id: "lb32", name: "بوت زلعة لوكس", image: img("lb-20260904150444-945f2a.jpg"), kind: "pots", size: "ارتفاع 16.5 سم × عرض 14 سم", price: "18 جنيه" },
  { id: "lb33", name: "بوت بسطا صغير", image: img("lb-20260904145152-98a441.jpg"), kind: "pots", size: "ارتفاع 13 سم × عرض 16 سم", price: "14 جنيه" },
  { id: "lb34", name: "بوت بسطا لوكس", image: img("lb-20260904151956-c5b1d3.jpg"), kind: "pots", size: "ارتفاع 28 سم × عرض 30 سم", price: "55 جنيه" },
  { id: "lb35", name: "بوت طاقة", image: img("lb-20260904152330-c1f3ef.jpg"), kind: "pots", size: "ارتفاع 33 سم × عرض 25 سم", price: "55 جنيه" },
  { id: "lb36", name: "مقلمة", image: img("lb-20260904150314-d1c201.jpg"), kind: "pots", size: "ارتفاع 11 سم × عرض 10 سم", price: "9 جنيه" },
  { id: "lb37", name: "بوت بابلز", image: img("lb-20260904145206-34006f.jpg"), kind: "pots", size: "ارتفاع 28 سم × عرض 22 سم", price: "55 جنيه" },
  { id: "lb38", name: "بوت تريندس برجل", image: img("lb-20260904152412-5e6240.jpg"), kind: "pots", size: "ارتفاع 40 سم × عرض 36 سم", price: "78 جنيه" },
  { id: "lb39", name: "بوت شمعدان برجل", image: img("lb-20260904150714-c90d8d.jpg"), kind: "pots", size: "ارتفاع 50 سم × عرض 25 سم", price: "78 جنيه" },
  { id: "lb40", name: "بوت ضفيرة برجل", image: img("lb-20260904152439-927b25.jpg"), kind: "pots", size: "ارتفاع 48 سم × عرض 22 سم", price: "75 جنيه" },
  { id: "lb41", name: "بوت ضفيرة", image: img("lb-20260904153653-7a3185.jpg"), kind: "pots", size: "ارتفاع 28 سم × عرض 22 سم", price: "55 جنيه" },
  { id: "lb42", name: "بوت سلسلة كبير", image: img("lb-20260904155459-866ad7.jpg"), kind: "pots", size: "ارتفاع 33 سم × عرض 30 سم", price: "60 جنيه" },
  { id: "lb43", name: "تريندس لوكس", image: img("lb-20260904151037-38a2c4.jpg"), kind: "pots", size: "ارتفاع 33 سم × عرض 36 سم", price: "60 جنيه" },
  { id: "lb44", name: "بوت تريندس", image: img("lb-20260904153943-95c45b.jpg"), kind: "pots", size: "ارتفاع 30 سم × عرض 36 سم", price: "55 جنيه" },
  { id: "lb45", name: "بوت لوكس أكريلك", image: img("lb-20260904145743-7a92cf.jpg"), kind: "pots", size: "ارتفاع 50 سم × عرض 28 سم", price: "110 جنيه" },
  { id: "lb46", name: "بوت بابلز برجل", image: img("lb-20260904153959-b70ea4.jpg"), kind: "pots", size: "ارتفاع 48 سم × عرض 22 سم", price: "75 جنيه" },
]);

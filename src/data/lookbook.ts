export type LookKind = "clocks" | "pots";

export interface LookItem {
  id: string;
  name: string;
  image: string;
  kind: LookKind;
  size: string;
}

export const LOOK_LABELS: Record<LookKind | "all", string> = {
  all: "الكل",
  clocks: "ساعات",
  pots: "بوتات وأصص",
};

export const LOOKBOOK: LookItem[] = [
  { id: "lb01", name: "بوت مرجانة صغير", image: "/images/lookbook/lb-01.png", kind: "pots", size: "ارتفاع 20 سم × عرض 18 سم" },
  { id: "lb02", name: "بوت بابلز بدون رجل", image: "/images/lookbook/lb-02.png", kind: "pots", size: "ارتفاع 28 سم × عرض 22 سم" },
  { id: "lb03", name: "بوت فراولة فك وتركيب", image: "/images/lookbook/lb-03.png", kind: "pots", size: "ارتفاع 25.5 سم × عرض 25 سم" },
  { id: "lb04", name: "ساعة غزالة", image: "/images/lookbook/lb-04.png", kind: "clocks", size: "مقاس 40 × 50 سم" },
  { id: "lb05", name: "ساعة غزالة بندول", image: "/images/lookbook/lb-05.png", kind: "clocks", size: "مقاس 65 × 40 سم" },
  { id: "lb06", name: "ساعة غزالة كبير", image: "/images/lookbook/lb-06.png", kind: "clocks", size: "مقاس 50 × 40 سم" },
  { id: "lb07", name: "ساعة غزالة وسط", image: "/images/lookbook/lb-07.png", kind: "clocks", size: "مقاس 36 × 39 سم" },
  { id: "lb08", name: "ساعة ميدان كبير", image: "/images/lookbook/lb-08.png", kind: "clocks", size: "مقاس 40 × 40 سم" },
  { id: "lb09", name: "ساعة مطبخ", image: "/images/lookbook/lb-09.png", kind: "clocks", size: "مقاس 28 × 34 سم" },
  { id: "lb10", name: "ساعة تاج بندول", image: "/images/lookbook/lb-10.png", kind: "clocks", size: "مقاس 72 × 34 سم" },
  { id: "lb11", name: "ساعة ميدان", image: "/images/lookbook/lb-11.png", kind: "clocks", size: "مقاس 36 × 36 سم" },
  { id: "lb12", name: "ساعة ميدان وسط", image: "/images/lookbook/lb-12.png", kind: "clocks", size: "مقاس 30 × 30 سم" },
  { id: "lb13", name: "ساعة قلب فيونكة", image: "/images/lookbook/lb-13.png", kind: "clocks", size: "مقاس 45 × 50 سم" },
  { id: "lb14", name: "ساعة كيتي", image: "/images/lookbook/lb-14.png", kind: "clocks", size: "مقاس 28 × 36 سم" },
  { id: "lb15", name: "ساعة سلسلة", image: "/images/lookbook/lb-15.png", kind: "clocks", size: "مقاس 49 × 49 سم" },
  { id: "lb16", name: "بوت شبح", image: "/images/lookbook/lb-16.png", kind: "pots", size: "ارتفاع 55 سم × عرض 38 سم" },
];

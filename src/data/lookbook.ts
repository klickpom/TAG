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

const photo = (file: string) => `/images/products/${file}.jpg`;

export function isCustomerScreenshot(url: string) {
  return /\/images\/lookbook\//i.test(url.trim());
}

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
  { id: "c01", name: "ساعة شمسية مرايا قلوب فضية", image: photo("clock-01"), kind: "clocks", size: "ساعة حائط", price: "" },
  { id: "c02", name: "ساعة شمسية بيضاء مرايا كريستال", image: photo("clock-02"), kind: "clocks", size: "ساعة حائط", price: "" },
  { id: "c03", name: "ساعة قلوب ذهبية كريستال", image: photo("clock-03"), kind: "clocks", size: "ساعة حائط", price: "" },
  { id: "c04", name: "ساعة ذهبية ورود كلاسيكية", image: photo("clock-04"), kind: "clocks", size: "ساعة حائط", price: "" },
  { id: "c05", name: "ساعة كيتي للأطفال", image: photo("clock-05"), kind: "clocks", size: "ساعة حائط", price: "" },
  { id: "c06", name: "ساعة قلب فضية بورود حمراء", image: photo("clock-06"), kind: "clocks", size: "ساعة حائط", price: "" },
  { id: "c07", name: "ساعة لفظ الجلالة ذهبي كلاسيك", image: photo("clock-07"), kind: "clocks", size: "ساعة حائط", price: "" },
  { id: "v01", name: "أصيص بابل أبيض بستاند خشبي", image: photo("vase1-01"), kind: "pots", size: "تحفة ديكور", price: "" },
  { id: "v02", name: "فازة كروية مضلعة بحافة ذهبية", image: photo("vase1-02"), kind: "pots", size: "تحفة ديكور", price: "" },
  { id: "v03", name: "فازة كروية مضلعة أوف وايت", image: photo("vase1-03"), kind: "pots", size: "تحفة ديكور", price: "" },
  { id: "v04", name: "أصيص سادة أبيض بستاند خشبي", image: photo("vase1-04"), kind: "pots", size: "تحفة ديكور", price: "" },
  { id: "v05", name: "أصيص ضفيرة أبيض بستاند", image: photo("vase1-05"), kind: "pots", size: "تحفة ديكور", price: "" },
  { id: "v06", name: "أصيص كروي مضلع بيج بأرجل", image: photo("vase1-06"), kind: "pots", size: "تحفة ديكور", price: "" },
  { id: "v07", name: "أصيص ضفيرة بيج فاخر بستاند", image: photo("vase1-07"), kind: "pots", size: "تحفة ديكور", price: "" },
  { id: "v08", name: "أصيص خطوط هندسية بحافة ذهبية", image: photo("vase1-08"), kind: "pots", size: "تحفة ديكور", price: "" },
  { id: "v11", name: "فازة هندسية بيضاء بحافة ذهبية", image: photo("vase1-11"), kind: "pots", size: "تحفة ديكور", price: "" },
  { id: "v12", name: "فازة حلزونية كروية بحافة ذهبية", image: photo("vase1-12"), kind: "pots", size: "تحفة ديكور", price: "" },
  { id: "v13", name: "فازة مضلعة طويلة بحافة ذهبية", image: photo("vase1-13"), kind: "pots", size: "تحفة ديكور", price: "" },
  { id: "v17", name: "فازة حبيبات كروية بحافة ذهبية", image: photo("vase1-17"), kind: "pots", size: "تحفة ديكور", price: "" },
  { id: "v18", name: "فازة مبطنة بخطوط ذهبية مزدوجة", image: photo("vase1-18"), kind: "pots", size: "تحفة ديكور", price: "" },
  { id: "s01", name: "طقم 6 أصص بابل ذهبي", image: photo("vase1-09"), kind: "pots", size: "طقم", price: "" },
  { id: "s02", name: "طقم فازتين مضلعة + حلقات ذهبي", image: photo("vase1-10"), kind: "pots", size: "طقم", price: "" },
  { id: "s03", name: "طقم فازتين حلزونيتين بيج + أبيض", image: photo("vase1-14"), kind: "pots", size: "طقم", price: "" },
  { id: "s04", name: "طقم فازتين شيفرون أبيض + ذهبي", image: photo("vase1-15"), kind: "pots", size: "طقم", price: "" },
  { id: "s05", name: "طقم 3 أصص موجة بيضاء", image: photo("vase1-16"), kind: "pots", size: "طقم", price: "" },
  { id: "s06", name: "طقم أصص مضلعة ذهبية (قطعتين)", image: photo("vase1-19"), kind: "pots", size: "طقم", price: "" },
  { id: "s07", name: "طقم أصص مضلعة ذهبية كبير + صغير", image: photo("vase1-20"), kind: "pots", size: "طقم", price: "" },
  { id: "s08", name: "طقم فازتين طويلتين موجية + حلزونية", image: photo("vase1-21"), kind: "pots", size: "طقم", price: "" },
  { id: "s09", name: "طقم 3 أصص بأرجل معدنية ألوان", image: photo("vase1-22"), kind: "pots", size: "طقم", price: "" },
  { id: "s10", name: "طقم 5 أصص ديكور متنوع بأرجل", image: photo("vase1-23"), kind: "pots", size: "طقم", price: "" },
  { id: "s11", name: "أصص ضفيرة بنباتات طبيعية", image: photo("vase1-24"), kind: "pots", size: "طقم", price: "" },
]);

export function catalogPhoto(item: Pick<LookItem, "id" | "image">) {
  const seed = LOOKBOOK.find((row) => row.id === item.id)?.image || "";
  if (isCustomerScreenshot(item.image)) return seed || item.image;
  return item.image || seed;
}

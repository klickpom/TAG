export type Category = "clocks" | "vases" | "sets";

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: Category;
  badge?: string;
  desc: string;
}

export const CATEGORY_LABELS: Record<Category | "all", string> = {
  all: "الكل",
  clocks: "ساعات حائط",
  vases: "مزهريات وأصص",
  sets: "أطقم ديكور",
};

const img = (f: string) => `/images/products/${f}.jpg`;

export const PRODUCTS: Product[] = [
  // ── ساعات حائط ─────────────────────────────
  { id: "c01", name: "ساعة ملكية ذهبية مزخرفة", price: 1450, image: img("clock-01"), category: "clocks", badge: "الأكثر مبيعاً", desc: "ساعة حائط فاخرة بإطار ذهبي مزخرف ونقوش كلاسيكية، ماكينة ساكنة بدون صوت، قطر كبير يليق بالصالونات والمداخل." },
  { id: "c02", name: "ساعة «الله أكبر» ذهبي × أسود", price: 1550, image: img("clock-02"), category: "clocks", desc: "ساعة دائرية فخمة بخلفية سوداء وخط عربي ذهبي بارز، لمسة روحانية أنيقة لبيتك." },
  { id: "c04", name: "ساعة كلاسيك ذهبية دائرية", price: 1200, image: img("clock-04"), category: "clocks", desc: "تصميم كلاسيكي بإطار ذهبي لامع وأرقام واضحة، مناسبة لكل الغرف." },
  { id: "c05", name: "ساعة مودرن أبيض × بني", price: 850, image: img("clock-05"), category: "clocks", desc: "ساعة عصرية بوجه أبيض نظيف وإطار خشبي دافئ، مثالية للمكاتب وغرف المعيشة." },
  { id: "c07", name: "ساعة برواز أسود أنيقة", price: 950, image: img("clock-07"), category: "clocks", desc: "ساعة بتصميم هادئ داخل برواز أسود راقي، تصلح للأرفف والمكاتب." },
  { id: "c08", name: "ساعة مزدوجة ذهبية فاخرة", price: 1750, image: img("clock-08"), category: "clocks", badge: "فاخر", desc: "قطعة فنية مزدوجة بلمسات ذهبية ورخامية، لعشاق التميز." },
  { id: "c10", name: "ساعة قلب ذهبية بالورود", price: 1450, image: img("clock-10"), category: "clocks", badge: "هدية مثالية", desc: "ساعة على شكل قلب ذهبي مزين بورود حمراء — هدية راقية للأحباب." },
  { id: "c11", name: "ساعة قلوب مزدوجة أبيض × أسود", price: 1500, image: img("clock-11"), category: "clocks", desc: "تصميم قلوب متداخلة بالأبيض والأسود مع لمسات ذهبية، رومانسية وعصرية." },
  { id: "c12", name: "ساعة قلوب بيضاء أنيقة", price: 1350, image: img("clock-12"), category: "clocks", desc: "ساعة بيضاء ناعمة بتفاصيل قلوب، مثالية لغرف النوم والعرائس." },
  { id: "c14", name: "ساعة شمسية مرايا ذهبية", price: 1650, image: img("clock-14"), category: "clocks", badge: "جديد", desc: "ساعة شمسية بأشعة مرايا ذهبية وسوداء تعكس الإضاءة وتكبّر المساحة." },
  { id: "c16", name: "ساعة شمسية مرايا بيضاء", price: 1600, image: img("clock-16"), category: "clocks", desc: "تصميم شمسي بمرايا فضية وقلوب بيضاء، إضاءة وفخامة في قطعة واحدة." },
  { id: "c17", name: "ساعة شمسية كريستال فضية", price: 1700, image: img("clock-17"), category: "clocks", desc: "أشعة كريستالية فضية لامعة حول وجه أنيق، تحفة لحائطك." },
  { id: "c18", name: "ساعة شمسية سوداء فاخرة", price: 1650, image: img("clock-18"), category: "clocks", desc: "نقوش سوداء مزخرفة بطابع ملكي، للديكورات الجريئة." },
  // ── مزهريات وأصص ─────────────────────────────
  { id: "v01", name: "فازة سيراميك بيضاء بحواف ذهبية", price: 450, image: img("vase1-01"), category: "vases", badge: "الأكثر مبيعاً", desc: "فازة سيراميك بيضاء ناعمة الملمس مع حافة ذهبية فاخرة." },
  { id: "v04", name: "فازة بيضاء مموجة بغطاء ذهبي", price: 480, image: img("vase1-04"), category: "vases", desc: "تموجات ناعمة وغطاء ذهبي لامع، قطعة ديكور متعددة الاستخدام." },
  { id: "v09", name: "فازة مضلعة بحافة ذهبية", price: 460, image: img("vase1-09"), category: "vases", desc: "تضليع عمودي أنيق مع لمسة ذهبية، تناسب الورود الطبيعية والصناعية." },
  { id: "v13", name: "فازة هندسية بيضاء", price: 520, image: img("vase1-13"), category: "vases", desc: "أوجه هندسية عصرية بلون أبيض نقي وحافة ذهبية." },
  { id: "v14", name: "فازة حلزونية بيضاء", price: 500, image: img("vase1-14"), category: "vases", desc: "لفّة حلزونية انسيابية تضيف حركة وحيوية لأي ركن." },
  { id: "v17", name: "فازة سوداء حلزونية", price: 550, image: img("vase1-17"), category: "vases", badge: "جديد", desc: "أسود مطفي حلزوني فاخر لعشاق الديكور الجريء." },
  { id: "v18", name: "فازة بيج حلزونية", price: 550, image: img("vase1-18"), category: "vases", desc: "درجة بيج دافئة بتصميم حلزوني، تنسجم مع الألوان الترابية." },
  { id: "v20", name: "طقم كرات سيراميك بيضاء", price: 380, image: img("vase1-20"), category: "vases", desc: "كرات سيراميك بيضاء بملمس ناعم لتزيين الأرفف والترابيزات." },
  // ── أطقم ديكور ─────────────────────────────
  { id: "s07", name: "طقم فازات مضلعة (قطعتين)", price: 850, image: img("vase1-07"), category: "sets", desc: "طقم قطعتين بارتفاعات متدرجة وتضليع فاخر، مثالي للمداخل." },
  { id: "s15", name: "طقم أصص بستاندات", price: 950, image: img("vase1-15"), category: "sets", badge: "عرض خاص", desc: "أصص بيضاء بقواعد معدنية رفيعة، لمسة اسكندنافية لنباتاتك." },
  { id: "s01", name: "طقم 3 فازات أبيض × ذهبي", price: 1150, image: img("vase2-01"), category: "sets", desc: "ثلاث قطع متناسقة بأحجام متدرجة، حل جاهز لأي رف أو كونسول." },
  { id: "s10", name: "طقم 3 أصص بأرجل خشبية", price: 990, image: img("vase2-10"), category: "sets", desc: "أصص سيراميك بأرجل خشبية طبيعية، دفء وأناقة للنباتات الداخلية." },
  { id: "s06", name: "ركن ديكور متكامل", price: 2200, image: img("vase2-06"), category: "sets", badge: "فاخر", desc: "ركن متكامل بأرفف خشبية وتشكيلة فازات وقطع ديكور من اختيار مصنع تاج." },
];

export const fmt = (n: number) =>
  `${n.toLocaleString("ar-EG")} ج.م`;

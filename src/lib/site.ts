export const SITE = {
  url: "https://tag-eg.online",
  nameAr: "مصنع تاج",
  nameEn: "TAJ",
  legalName: "مصنع تاج لساعات الحائط ولوازم الديكور",
  description:
    "مصنع تاج مصنع مصري في بسيون بمحافظة الغربية يصنّع ساعات الحائط وتحف الديكور والبوتات السيراميك من المصنع مباشرة، ويشحن لكل محافظات مصر مع الدفع عند الاستلام.",
  phoneDisplay: "0101 084 1285",
  phoneIntl: "+201010841285",
  email: "",
  city: "بسيون",
  cityEn: "Basyoun",
  region: "الغربية",
  regionEn: "Gharbia",
  country: "مصر",
  countryCode: "EG",
  geo: { lat: 31.013279, lng: 30.8531894 },
  maps: "https://www.google.com/maps?q=31.013279,30.8531894&z=17&hl=ar",
  mapsEmbed:
    "https://www.openstreetmap.org/export/embed.html?bbox=30.8432%2C31.0063%2C30.8632%2C31.0203&layer=mapnik&marker=31.013279%2C30.8531894",
  mapsDirections:
    "https://www.google.com/maps/dir/?api=1&destination=31.013279,30.8531894",
  mapsApple: "https://maps.apple.com/?ll=31.013279,30.8531894&q=%D9%85%D8%B5%D9%86%D8%B9%20%D8%AA%D8%A7%D8%AC",
  addressAr: "بسيون، محافظة الغربية، مصر",
  hours: "Mo-Su 10:00-22:00",
  hoursAr: "يومياً من 10 صباحاً حتى 10 مساءً",
  facebook: "https://www.facebook.com/profile.php?id=61591849934315",
  whatsapp: "https://wa.me/201010841285",
  logo: "https://tag-eg.online/images/logo.jpeg",
  image: "https://tag-eg.online/images/taj-logo-3d.jpg",
  foundingLocation: "بسيون، الغربية، مصر",
} as const;

export const FEATURED = {
  hero: "/images/taj-logo-3d.jpg",
  heroAlt: "شعار مصنع تاج",
  mosaic: [
    "/images/products/clock-02.jpg",
    "/images/products/clock-03.jpg",
    "/images/products/clock-04.jpg",
    "/images/products/clock-05.jpg",
    "/images/products/clock-06.jpg",
    "/images/products/clock-07.jpg",
    "/images/products/vase1-01.jpg?v=2",
    "/images/products/vase1-05.jpg",
  ],
  about: [
    { src: "/images/taj-logo-3d.jpg", alt: "شعار مصنع تاج" },
    { src: "/images/products/vase1-01.jpg?v=2", alt: "أصص تاج البيضاء مع شعار المصنع" },
    { src: "/images/products/vase1-02.jpg", alt: "أصيص تاج أبيض بحزام ذهبي" },
    { src: "/images/products/vase1-09.jpg", alt: "طقم أصص بابل من مصنع تاج" },
  ],
} as const;

export const FAQS: { q: string; a: string }[] = [
  {
    q: "فين مصنع تاج؟",
    a: "مصنع تاج موجود في بسيون بمحافظة الغربية في مصر، على الإحداثيات 31.013279، 30.8531894. التصنيع محلي من المصنع مباشرة، والشحن لكل محافظات مصر.",
  },
  {
    q: "هل مصنع تاج في طنطا؟",
    a: "لا. مقر مصنع تاج في بسيون بمحافظة الغربية وليس في طنطا. الشحن يصل طنطا وباقي المحافظات من مصنع بسيون.",
  },
  {
    q: "مصنع تاج بيصنع إيه؟",
    a: "مصنع تاج متخصص في ساعات الحائط الفاخرة وتحف الديكور والبوتات والأصص السيراميك وأطقم الديكور للبيت.",
  },
  {
    q: "هل الأسعار ظاهرة على الموقع؟",
    a: "المعرض والكاتلوج على الموقع بدون أسعار. للتفاصيل والطلب كلم واتساب على 01010841285، والسعر يتحدد حسب القطعة والكمية.",
  },
  {
    q: "هل في دفع عند الاستلام؟",
    a: "نعم. مصنع تاج يعتمد الدفع عند الاستلام في كل محافظات مصر. تستلم المنتج وتتأكد منه ثم تدفع.",
  },
  {
    q: "إزاي أطلب من مصنع تاج؟",
    a: "اختار القطعة من المعرض أو الكاتلوج، ثم راسل واتساب على 01010841285 باسم المنتج والمقاس والمدينة. الرد يومياً من 10 صباحاً حتى 10 مساءً.",
  },
  {
    q: "هل الشحن لكل محافظات مصر؟",
    a: "نعم. مصنع تاج يشحن ساعات الحائط والتحف لكل محافظات مصر من بسيون، مع تغليف مقوّى للمنتجات القابلة للكسر.",
  },
  {
    q: "إيه مواعيد مصنع تاج؟",
    a: "مصنع تاج متاح يومياً من 10 صباحاً حتى 10 مساءً، بما فيها الجمعة والسبت.",
  },
];

export const ORDER_STEPS: { name: string; text: string }[] = [
  {
    name: "اختار القطعة",
    text: "تصفح معرض مصنع تاج أو الكاتلوج واختار الساعة أو التحفة بالمقاس المناسب.",
  },
  {
    name: "ابعت واتساب",
    text: "راسل 01010841285 باسم المنتج والمقاس والمدينة.",
  },
  {
    name: "أكّد الطلب",
    text: "فريق المصنع يؤكد التفاصيل ومصاريف الشحن قبل التنفيذ.",
  },
  {
    name: "استلم وادفع",
    text: "المنتج يوصل لباب البيت. افحصه وادفع عند الاستلام.",
  },
];

export const REVIEWS = [
  { name: "أ. محمد السيد", city: "القاهرة", text: "الساعة الشمسية وصلت بحالة ممتازة والتغليف كان محترم جداً. الجودة فاقت توقعاتي بصراحة." },
  { name: "أ. منى عبد الرحمن", city: "طنطا", text: "طلبت طقم فازات هدية لبيتي الجديد، الخامة والتشطيب تحفة والسعر أرخص بكتير من بره." },
  { name: "أ. أحمد الشريف", city: "الإسكندرية", text: "تعامل راقي ورد سريع على الواتساب. ساعة القلب الذهبية شكلها في الحقيقة أجمل من الصور." },
  { name: "أ. هالة محمود", city: "المنصورة", text: "ثاني مرة أطلب منهم — الأصص بالستاندات ظبطت الركن عندي تماماً. شكراً مصنع تاج!" },
] as const;

export function orgId() {
  return `${SITE.url}/#organization`;
}

export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "HomeGoodsStore", "Manufacturer"],
    "@id": orgId(),
    name: SITE.legalName,
    alternateName: [SITE.nameAr, SITE.nameEn, "TAJ Factory", "TAJ Factory Basyoun", "Taj Clocks Basyoun"],
    url: SITE.url,
    image: [SITE.logo, SITE.image],
    logo: SITE.logo,
    telephone: SITE.phoneIntl,
    priceRange: "$$",
    currenciesAccepted: "EGP",
    paymentAccepted: "Cash",
    foundingLocation: SITE.foundingLocation,
    knowsLanguage: ["ar"],
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.city,
      addressLocality: SITE.city,
      addressRegion: SITE.region,
      addressCountry: SITE.countryCode,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: SITE.geo.lat,
      longitude: SITE.geo.lng,
    },
    hasMap: SITE.maps,
    containedInPlace: {
      "@type": "AdministrativeArea",
      name: "الغربية",
      containedInPlace: { "@type": "Country", name: "مصر" },
    },
    areaServed: [
      { "@type": "Country", name: "مصر" },
      { "@type": "AdministrativeArea", name: "الغربية" },
      { "@type": "City", name: "بسيون" },
      { "@type": "City", name: "طنطا" },
      { "@type": "City", name: "القاهرة" },
      { "@type": "City", name: "الإسكندرية" },
      { "@type": "City", name: "المنصورة" },
    ],
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "10:00",
      closes: "22:00",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      telephone: SITE.phoneIntl,
      availableLanguage: ["ar"],
      hoursAvailable: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "10:00",
        closes: "22:00",
      },
    },
    sameAs: [SITE.facebook, SITE.whatsapp, SITE.maps],
    knowsAbout: [
      "ساعات حائط",
      "تحف ديكور",
      "ديكور منزلي",
      "سيراميك",
      "مصنع ديكور بسيون",
      "ساعات حائط بسيون",
      "مصنع ساعات الغربية",
    ],
    description: SITE.description,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5",
      bestRating: "5",
      ratingCount: String(REVIEWS.length),
      reviewCount: String(REVIEWS.length),
    },
    review: REVIEWS.map((item) => ({
      "@type": "Review",
      author: { "@type": "Person", name: item.name },
      reviewBody: item.text,
      reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
      itemReviewed: { "@id": orgId() },
    })),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "كاتلوج مصنع تاج",
      url: `${SITE.url}/catalog`,
      itemListElement: [
        { "@type": "OfferCatalog", name: "ساعات حائط" },
        { "@type": "OfferCatalog", name: "تحف وديكور" },
      ],
    },
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE.url}/#website`,
    url: SITE.url,
    name: SITE.legalName,
    alternateName: SITE.nameAr,
    inLanguage: "ar-EG",
    publisher: { "@id": orgId() },
    about: { "@id": orgId() },
  };
}

export function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

export function howToJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "طريقة الطلب من مصنع تاج",
    description: "طلب ساعات الحائط وتحف الديكور من مصنع تاج في بسيون عبر واتساب مع الدفع عند الاستلام.",
    step: ORDER_STEPS.map((step, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: step.name,
      text: step.text,
    })),
  };
}

export function webPageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SITE.url}/#webpage`,
    url: SITE.url,
    name: SITE.legalName,
    description: SITE.description,
    inLanguage: "ar-EG",
    isPartOf: { "@id": `${SITE.url}/#website` },
    about: { "@id": orgId() },
    primaryImageOfPage: SITE.image,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", "#faq", "#about", "#guide"],
    },
    dateModified: "2026-09-09",
  };
}

export function collectionPageJsonLd(itemNames: string[] = []) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${SITE.url}/catalog#page`,
    url: `${SITE.url}/catalog`,
    name: "كاتلوج مصنع تاج — ساعات حائط وتحف ديكور",
    description:
      "كاتلوج مصنع تاج في بسيون: ساعات حائط وتحف ديكور. الأسعار غير ظاهرة على الموقع. شحن لكل محافظات مصر والدفع عند الاستلام.",
    inLanguage: "ar-EG",
    isPartOf: { "@id": `${SITE.url}/#website` },
    about: { "@id": orgId() },
    mainEntity: {
      "@type": "ItemList",
      name: "منتجات كاتلوج مصنع تاج",
      numberOfItems: itemNames.length,
      itemListElement: itemNames.map((name, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name,
      })),
    },
  };
}

export function guideArticleJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${SITE.url}/#guide`,
    headline: "مصنع تاج في بسيون: مصنع ساعات حائط وتحف ديكور، وليس تاجر",
    description: SITE.description,
    inLanguage: "ar-EG",
    datePublished: "2026-09-01",
    dateModified: "2026-09-09",
    author: { "@id": orgId() },
    publisher: { "@id": orgId() },
    about: { "@id": orgId() },
    mainEntityOfPage: { "@id": `${SITE.url}/#webpage` },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["#guide", "#guide-definition"],
    },
  };
}

export function definedTermJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: "مصنع تاج",
    alternateName: ["TAJ", "TAJ Factory", "مصنع تاج بسيون"],
    description: SITE.description,
    url: SITE.url,
    inDefinedTermSet: {
      "@type": "DefinedTermSet",
      name: "Egyptian wall-clock and home-décor manufacturers",
    },
  };
}

export function homeJsonLd() {
  return [
    localBusinessJsonLd(),
    websiteJsonLd(),
    webPageJsonLd(),
    faqJsonLd(),
    howToJsonLd(),
    guideArticleJsonLd(),
    definedTermJsonLd(),
    breadcrumbJsonLd([{ name: "الرئيسية", path: "/" }]),
  ];
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE.url}${item.path}`,
    })),
  };
}

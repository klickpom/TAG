export const SITE = {
  url: "https://tag-eg.online",
  nameAr: "مصنع تاج",
  nameEn: "TAJ",
  legalName: "مصنع تاج لساعات الحائط ولوازم الديكور",
  description:
    "مصنع تاج مصنع مصري في بسيون متخصص في ساعات الحائط ولوازم الديكور. صناعة مباشرة من المصنع، شحن لكل محافظات مصر، والدفع عند الاستلام.",
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
  hours: "Mo-Su 10:00-22:00",
  hoursAr: "يومياً من 10 صباحاً حتى 10 مساءً",
  facebook: "https://www.facebook.com/profile.php?id=61591849934315",
  whatsapp: "https://wa.me/201010841285",
  logo: "https://tag-eg.online/images/logo.jpeg",
  image: "https://tag-eg.online/images/products/clock-01.jpg",
  foundingLocation: "بسيون، الغربية، مصر",
} as const;

export const FEATURED = {
  hero: "/images/taj-logo-3d.jpg",
  heroAlt: "شعار مصنع تاج ثلاثي الأبعاد",
  mosaic: [
    "/images/products/clock-01.jpg",
    "/images/products/clock-02.jpg",
    "/images/products/clock-03.jpg",
    "/images/products/clock-04.jpg",
    "/images/products/clock-05.jpg",
    "/images/products/clock-06.jpg",
    "/images/products/vase1-01.jpg?v=2",
    "/images/products/vase1-05.jpg",
  ],
  about: [
    { src: "/images/products/clock-01.jpg", alt: "ساعة حائط مرايا من مصنع تاج" },
    { src: "/images/products/clock-03.jpg", alt: "ساعة حائط ذهبية من مصنع تاج" },
    { src: "/images/products/vase1-01.jpg?v=2", alt: "أصيص بابل من مصنع تاج" },
    { src: "/images/products/vase1-05.jpg", alt: "أصيص ضفيرة من مصنع تاج" },
  ],
} as const;

export const FAQS: { q: string; a: string }[] = [
  {
    q: "فين مصنع تاج؟",
    a: "مصنع تاج موجود في بسيون بمحافظة الغربية في مصر. التصنيع محلي من المصنع مباشرة، والشحن لكل محافظات مصر.",
  },
  {
    q: "مصنع تاج بيصنع إيه؟",
    a: "مصنع تاج متخصص في ساعات الحائط الفاخرة وتحف الديكور والبوتات والأصص السيراميك وأطقم الديكور للبيت.",
  },
  {
    q: "هل الأسعار ظاهرة على الموقع؟",
    a: "المعرض والكاتلوج على الموقع بدون أسعار. للتفاصيل والطلب كلم واتساب، والسعر يتحدد حسب القطعة والكمية.",
  },
  {
    q: "هل في دفع عند الاستلام؟",
    a: "نعم. مصنع تاج يعتمد الدفع عند الاستلام في كل محافظات مصر. تستلم المنتج وتتأكد منه ثم تدفع.",
  },
  {
    q: "إزاي أطلب من مصنع تاج؟",
    a: "اختار القطعة من المعرض أو الكاتلوج، ثم راسل واتساب على 01010841285 باسم المنتج والمقاس. الرد يومياً من 10 صباحاً حتى 10 مساءً.",
  },
  {
    q: "هل الشحن لكل محافظات مصر؟",
    a: "نعم. مصنع تاج يشحن ساعات الحائط والتحف لكل محافظات مصر من بسيون، مع تغليف مقوّى للمنتجات القابلة للكسر.",
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

export function orgId() {
  return `${SITE.url}/#organization`;
}

export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "HomeGoodsStore"],
    "@id": orgId(),
    name: SITE.legalName,
    alternateName: [SITE.nameAr, SITE.nameEn, "TAJ Factory Basyoun"],
    url: SITE.url,
    image: [SITE.logo, SITE.image],
    logo: SITE.logo,
    telephone: SITE.phoneIntl,
    priceRange: "$$",
    currenciesAccepted: "EGP",
    paymentAccepted: "Cash",
    address: {
      "@type": "PostalAddress",
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
    areaServed: {
      "@type": "Country",
      name: "Egypt",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "10:00",
      closes: "22:00",
    },
    sameAs: [SITE.facebook],
    knowsAbout: ["ساعات حائط", "تحف ديكور", "ديكور منزلي", "سيراميك", "مصنع ديكور بسيون"],
    description: SITE.description,
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
    inLanguage: "ar-EG",
    publisher: { "@id": orgId() },
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
      cssSelector: ["h1", "#faq", "#about"],
    },
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
      "كاتلوج مصنع تاج في بسيون: ساعات حائط وتحف ديكور. شحن لكل محافظات مصر والدفع عند الاستلام.",
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

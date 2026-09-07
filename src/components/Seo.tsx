import { useEffect } from "react";
import { SITE } from "@/lib/site";

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.rel = rel;
    document.head.appendChild(el);
  }
  el.href = href;
}

export default function Seo({
  title,
  description,
  path,
  image = SITE.image,
  noindex = false,
  jsonLd = [],
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  noindex?: boolean;
  jsonLd?: object[];
}) {
  const url = `${SITE.url}${path}`;

  useEffect(() => {
    document.title = title;
    document.documentElement.lang = "ar";
    document.documentElement.dir = "rtl";
    upsertMeta("name", "description", description);
    upsertMeta("name", "author", SITE.nameAr);
    upsertMeta("name", "geo.region", "EG-GH");
    upsertMeta("name", "geo.placename", `${SITE.cityEn}, ${SITE.regionEn}, Egypt`);
    upsertMeta("name", "geo.position", `${SITE.geo.lat};${SITE.geo.lng}`);
    upsertMeta("name", "ICBM", `${SITE.geo.lat}, ${SITE.geo.lng}`);
    upsertMeta("name", "robots", noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1");
    upsertMeta("name", "googlebot", noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large");
    upsertMeta("name", "bingbot", noindex ? "noindex, nofollow" : "index, follow");
    upsertMeta("property", "og:type", "website");
    upsertMeta("property", "og:locale", "ar_EG");
    upsertMeta("property", "og:site_name", SITE.legalName);
    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:url", url);
    upsertMeta("property", "og:image", image);
    upsertMeta("property", "og:image:alt", title);
    upsertMeta("property", "og:image:width", "1200");
    upsertMeta("property", "og:image:height", "1200");
    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", title);
    upsertMeta("name", "twitter:description", description);
    upsertMeta("name", "twitter:image", image);
    upsertMeta("name", "twitter:image:alt", title);
    upsertLink("canonical", url);
    upsertLink("me", SITE.facebook);
  }, [title, description, url, image, noindex, path]);

  return (
    <>
      {jsonLd.map((node, i) => (
        <script
          // eslint-disable-next-line react/no-danger
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(node) }}
        />
      ))}
    </>
  );
}

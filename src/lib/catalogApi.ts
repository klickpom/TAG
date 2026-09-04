import { LOOKBOOK, isCustomerScreenshot, type LookItem, sortCatalogItems } from "@/data/lookbook";

const LOCAL_KEY = "taj-catalog-v1";

function isJsonResponse(res: Response) {
  return (res.headers.get("content-type") || "").includes("json");
}

function usableImage(url: string) {
  const value = url.trim();
  if (isCustomerScreenshot(value)) return false;
  return /^(https?:\/\/|\/images\/products\/|\/images\/catalog\/|\/api\/media\.php)/.test(value);
}

function mergeCatalog(saved: LookItem[]): LookItem[] {
  const fb = new Map(LOOKBOOK.map((i) => [i.id, i]));
  const ids = new Set(saved.map((i) => i.id));
  const merged = saved.map((s) => {
    const f = fb.get(s.id);
    const price = (s.price || f?.price || "").trim();
    const image = usableImage(s.image) ? s.image : f?.image || s.image;
    return f ? { ...f, ...s, price, image } : { ...s, price, image };
  });
  return sortCatalogItems([...merged, ...LOOKBOOK.filter((i) => !ids.has(i.id))]);
}

const UPLOAD_ERRORS: Record<string, string> = {
  auth: "كلمة السر غلط",
  upload: "فشل رفع الصورة. جرّب صورة تانية",
  too_big: "الصورة كبيرة. اختار صورة أصغر أو صوّرها تاني من الموبايل",
  type: "الصيغة مش مدعومة. استخدم JPG أو PNG",
  move: "فشل حفظ الصورة على السيرفر",
};

export async function fetchCatalogItems(): Promise<LookItem[]> {
  try {
    const res = await fetch("/api/catalog.php", { cache: "no-store" });
    if (res.ok && isJsonResponse(res)) {
      const data = (await res.json()) as { items?: LookItem[] };
      if (Array.isArray(data.items) && data.items.length) return mergeCatalog(data.items);
    }
  } catch {
    /* local */
  }
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as LookItem[];
      if (Array.isArray(parsed) && parsed.length) return mergeCatalog(parsed);
    }
  } catch {
    /* ignore */
  }
  return LOOKBOOK;
}

export async function saveCatalogItems(
  password: string,
  items: LookItem[]
): Promise<{ ok: boolean; error?: string }> {
        const safe = sortCatalogItems(items.filter((item) => usableImage(item.image)));
  try {
    const res = await fetch("/api/catalog.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "save", password, items: safe }),
    });
    if (isJsonResponse(res)) {
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (res.ok && data.ok) {
        localStorage.setItem(LOCAL_KEY, JSON.stringify(safe));
        return { ok: true };
      }
      if (res.status === 401) return { ok: false, error: "كلمة السر غلط" };
      return { ok: false, error: data.error || "فشل الحفظ" };
    }
  } catch {
    /* local */
  }
  return { ok: false, error: "الحفظ على السيرفر فشل. الصورة مش هتظهر للعملاء" };
}

async function prepareCatalogFile(file: File): Promise<File> {
  if (/heic|heif/i.test(file.type) || /\.hei[cf]$/i.test(file.name)) {
    throw new Error("صيغة الصورة مش مدعومة. حوّلها لـ JPG من الموبايل وبعدين ارفعها");
  }
  if (file.size > 12 * 1024 * 1024) {
    throw new Error("الصورة كبيرة أوي. اختار صورة أصغر");
  }
  if (file.size <= 2 * 1024 * 1024 && /^image\/(jpeg|png|webp|gif)$/.test(file.type)) return file;
  const bmp = await createImageBitmap(file);
  const max = 1600;
  const scale = Math.min(1, max / Math.max(bmp.width, bmp.height));
  const w = Math.max(1, Math.round(bmp.width * scale));
  const h = Math.max(1, Math.round(bmp.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bmp.close();
    return file;
  }
  ctx.drawImage(bmp, 0, 0, w, h);
  bmp.close();
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.86));
  if (!blob) return file;
  return new File([blob], file.name.replace(/\.[^.]+$/, "") + ".jpg", { type: "image/jpeg" });
}

export async function uploadCatalogImage(
  password: string,
  file: File
): Promise<{ ok: boolean; url?: string; error?: string }> {
  try {
    const ready = await prepareCatalogFile(file);
    const body = new FormData();
    body.append("password", password);
    body.append("image", ready);
    const res = await fetch("/api/catalog.php", { method: "POST", body });
    if (isJsonResponse(res)) {
      const data = (await res.json()) as { ok?: boolean; url?: string; error?: string };
      if (res.ok && data.ok && data.url && usableImage(data.url)) return { ok: true, url: data.url };
      return { ok: false, error: UPLOAD_ERRORS[data.error || ""] || data.error || "فشل رفع الصورة" };
    }
    return { ok: false, error: "السيرفر مرجعش رد صحيح. جرّب تاني" };
  } catch (err) {
    const message = err instanceof Error ? err.message : "فشل رفع الصورة";
    return { ok: false, error: message };
  }
}

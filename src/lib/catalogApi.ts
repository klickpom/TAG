import { LOOKBOOK, type LookItem } from "@/data/lookbook";

const LOCAL_KEY = "taj-catalog-v1";

function isJsonResponse(res: Response) {
  return (res.headers.get("content-type") || "").includes("json");
}

function mergeCatalog(saved: LookItem[]): LookItem[] {
  const fb = new Map(LOOKBOOK.map((i) => [i.id, i]));
  const ids = new Set(saved.map((i) => i.id));
  const merged = saved.map((s) => {
    const f = fb.get(s.id);
    const price = (s.price || f?.price || "").trim();
    return f ? { ...f, ...s, price } : { ...s, price };
  });
  return [...merged, ...LOOKBOOK.filter((i) => !ids.has(i.id))];
}

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
  try {
    const res = await fetch("/api/catalog.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "save", password, items }),
    });
    if (isJsonResponse(res)) {
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (res.ok && data.ok) {
        localStorage.setItem(LOCAL_KEY, JSON.stringify(items));
        return { ok: true };
      }
      if (res.status === 401) return { ok: false, error: "كلمة السر غلط" };
      return { ok: false, error: data.error || "فشل الحفظ" };
    }
  } catch {
    /* local */
  }
  localStorage.setItem(LOCAL_KEY, JSON.stringify(items));
  return { ok: true };
}

export async function uploadCatalogImage(
  password: string,
  file: File
): Promise<{ ok: boolean; url?: string; error?: string }> {
  try {
    const body = new FormData();
    body.append("password", password);
    body.append("image", file);
    const res = await fetch("/api/catalog.php", { method: "POST", body });
    if (isJsonResponse(res)) {
      const data = (await res.json()) as { ok?: boolean; url?: string; error?: string };
      if (res.ok && data.ok && data.url) return { ok: true, url: data.url };
      return { ok: false, error: data.error || "فشل رفع الصورة" };
    }
  } catch {
    /* local preview */
  }
  const url = URL.createObjectURL(file);
  return { ok: true, url };
}

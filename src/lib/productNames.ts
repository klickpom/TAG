export type NameMap = Record<string, string>;

const LOCAL_KEY = "taj-product-names-v1";

function isJsonResponse(res: Response) {
  return (res.headers.get("content-type") || "").includes("json");
}

export async function fetchNameMap(): Promise<NameMap> {
  try {
    const res = await fetch("/api/products.php", { cache: "no-store" });
    if (res.ok && isJsonResponse(res)) {
      const data = (await res.json()) as NameMap;
      if (data && typeof data === "object" && !Array.isArray(data)) return data;
    }
  } catch {
    /* local / no PHP */
  }
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    return raw ? (JSON.parse(raw) as NameMap) : {};
  } catch {
    return {};
  }
}

export async function loginAdmin(password: string): Promise<boolean> {
  try {
    const res = await fetch("/api/products.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "login", password }),
    });
    if (isJsonResponse(res)) {
      const data = (await res.json()) as { ok?: boolean };
      return res.ok && !!data.ok;
    }
  } catch {
    /* local */
  }
  sessionStorage.setItem("taj-admin-local", "1");
  return password.length >= 4;
}

export async function saveNameMap(password: string, names: NameMap): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch("/api/products.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "save", password, names }),
    });
    if (isJsonResponse(res)) {
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (res.ok && data.ok) {
        localStorage.setItem(LOCAL_KEY, JSON.stringify(names));
        return { ok: true };
      }
      if (res.status === 401) return { ok: false, error: "كلمة السر غلط" };
      return { ok: false, error: data.error || "فشل الحفظ" };
    }
  } catch {
    /* local */
  }
  localStorage.setItem(LOCAL_KEY, JSON.stringify(names));
  return { ok: true };
}

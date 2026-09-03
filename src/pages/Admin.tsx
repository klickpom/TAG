import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { LogOut, RotateCcw, Save, Search, Shield } from "lucide-react";
import { CATEGORY_LABELS, PRODUCTS, type Category } from "@/data/products";
import { loginAdmin, saveNameMap, type NameMap } from "@/lib/productNames";
import { useCatalog } from "@/context/CatalogContext";

const SESSION_KEY = "taj-admin-pass";

function defaultDraft(names: NameMap): NameMap {
  const init: NameMap = {};
  for (const p of PRODUCTS) init[p.id] = names[p.id]?.trim() || p.name;
  return init;
}

export default function Admin() {
  const { names, reload } = useCatalog();
  const [authed, setAuthed] = useState(() => !!sessionStorage.getItem(SESSION_KEY));
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [logging, setLogging] = useState(false);
  const [draft, setDraft] = useState<NameMap>({});
  const [filter, setFilter] = useState<Category | "all">("all");
  const [query, setQuery] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (!authed) return;
    setDraft(defaultDraft(names));
  }, [authed, names]);

  const dirtyCount = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const now = (draft[p.id] ?? p.name).trim();
      const saved = (names[p.id]?.trim() || p.name).trim();
      return now !== saved;
    }).length;
  }, [draft, names]);

  const list = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const name = draft[p.id] ?? p.name;
      const okCat = filter === "all" || p.category === filter;
      const q = query.trim();
      return okCat && (!q || name.includes(q) || p.name.includes(q));
    });
  }, [filter, query, draft]);

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLogging(true);
    setLoginError("");
    const ok = await loginAdmin(password);
    setLogging(false);
    if (!ok) {
      setLoginError("كلمة السر غلط");
      return;
    }
    sessionStorage.setItem(SESSION_KEY, password);
    setAuthed(true);
  };

  const logout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setPassword("");
    setAuthed(false);
    setDraft({});
  };

  const save = async () => {
    const pass = sessionStorage.getItem(SESSION_KEY) || password;
    setSaving(true);
    setMsg("");
    const payload: NameMap = {};
    for (const p of PRODUCTS) {
      const n = (draft[p.id] ?? p.name).trim();
      if (n && n !== p.name) payload[p.id] = n;
    }
    const res = await saveNameMap(pass, payload);
    setSaving(false);
    if (!res.ok) {
      setMsg(res.error || "فشل الحفظ");
      return;
    }
    await reload();
    setMsg("تم الحفظ — الأسماء ظاهرة على الموقع فورًا");
  };

  const resetAll = () => {
    setDraft(defaultDraft({}));
    setMsg("رجّعنا الأسماء الافتراضية — اضغط حفظ عشان تتثبت");
  };

  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#191920] px-4">
        <form
          onSubmit={onLogin}
          className="w-full max-w-md rounded-3xl border border-[#c6a15b]/30 bg-[#faf6ef] p-8 shadow-2xl"
        >
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#191920] text-[#e6c987]">
            <Shield className="h-7 w-7" />
          </div>
          <h1 className="mt-4 text-center text-2xl font-black text-[#191920]">لوحة تاج</h1>
          <p className="mt-2 text-center text-sm text-[#7a6f60]">تعديل أسماء المنتجات</p>
          <label className="mt-6 block text-sm font-bold text-[#3d3830]">كلمة السر</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-[#eadfc9] bg-white px-4 py-3 text-sm outline-none focus:border-[#c6a15b]"
            autoFocus
          />
          {loginError && <p className="mt-2 text-sm font-semibold text-[#b0574a]">{loginError}</p>}
          <button
            type="submit"
            disabled={logging || !password}
            className="bg-gold-gradient mt-5 w-full rounded-full py-3 text-sm font-black text-[#191920] disabled:opacity-50"
          >
            {logging ? "جاري الدخول…" : "دخول"}
          </button>
          <Link to="/" className="mt-4 block text-center text-xs font-semibold text-[#a8853f]">
            الرجوع للموقع
          </Link>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf6ef]">
      <header className="sticky top-0 z-30 border-b border-[#eadfc9] bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div>
            <h1 className="text-lg font-black text-[#191920]">أسماء المنتجات</h1>
            <p className="text-xs text-[#7a6f60]">
              {PRODUCTS.length} منتج — {dirtyCount} تعديل غير محفوظ
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={resetAll}
              className="flex items-center gap-1.5 rounded-full border border-[#eadfc9] px-4 py-2 text-xs font-bold text-[#5d554a]"
            >
              <RotateCcw className="h-4 w-4" />
              الافتراضي
            </button>
            <button
              type="button"
              onClick={() => void save()}
              disabled={saving}
              className="bg-gold-gradient flex items-center gap-1.5 rounded-full px-5 py-2 text-xs font-black text-[#191920] disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {saving ? "بيحفظ…" : "حفظ"}
            </button>
            <button
              type="button"
              onClick={logout}
              className="flex items-center gap-1.5 rounded-full bg-[#191920] px-4 py-2 text-xs font-bold text-[#e6c987]"
            >
              <LogOut className="h-4 w-4" />
              خروج
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-6">
        {msg && (
          <p className="mb-4 rounded-2xl border border-[#c6a15b]/40 bg-[#c6a15b]/10 px-4 py-3 text-sm font-semibold text-[#5d554a]">
            {msg}
          </p>
        )}

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            {(["all", "clocks", "vases", "sets"] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`rounded-full px-4 py-2 text-xs font-bold ${
                  filter === f
                    ? "bg-gold-gradient text-white"
                    : "border border-[#eadfc9] bg-white text-[#5d554a]"
                }`}
              >
                {CATEGORY_LABELS[f]}
              </button>
            ))}
          </div>
          <div className="relative w-full max-w-xs">
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#a89a80]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="بحث…"
              className="w-full rounded-full border border-[#eadfc9] bg-white py-2 pl-4 pr-10 text-sm outline-none"
            />
          </div>
        </div>

        <div className="mt-6 grid gap-3">
          {list.map((p) => {
            const current = draft[p.id] ?? p.name;
            const changed = current.trim() !== p.name;
            return (
              <div
                key={p.id}
                className="flex flex-col gap-3 rounded-2xl border border-[#eadfc9] bg-white p-3 sm:flex-row sm:items-center"
              >
                <img src={p.image} alt="" className="h-20 w-20 shrink-0 rounded-xl object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-[11px] font-bold text-[#a8853f]">
                    {CATEGORY_LABELS[p.category]}
                    {changed && (
                      <span className="rounded-full bg-[#c6a15b]/15 px-2 py-0.5 text-[#a8853f]">معدّل</span>
                    )}
                  </div>
                  <p className="mt-1 truncate text-[11px] text-[#a89a80]">الأصل: {p.name}</p>
                  <input
                    value={current}
                    onChange={(e) => setDraft((d) => ({ ...d, [p.id]: e.target.value }))}
                    className="mt-2 w-full rounded-xl border border-[#eadfc9] px-3 py-2 text-sm font-bold text-[#191920] outline-none focus:border-[#c6a15b]"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setDraft((d) => ({ ...d, [p.id]: p.name }))}
                  className="shrink-0 text-xs font-semibold text-[#7a6f60] hover:text-[#a8853f]"
                >
                  رجوع للاسم الأصلي
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

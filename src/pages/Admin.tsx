import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import {
  ArrowDown,
  ArrowUp,
  ImagePlus,
  LogOut,
  Plus,
  RotateCcw,
  Save,
  Search,
  Shield,
  Trash2,
} from "lucide-react";
import { CATEGORY_LABELS, PRODUCTS, type Category } from "@/data/products";
import { LOOK_LABELS, type LookItem, type LookKind } from "@/data/lookbook";
import { loginAdmin, saveNameMap, type NameMap } from "@/lib/productNames";
import { saveCatalogItems, uploadCatalogImage } from "@/lib/catalogApi";
import { useCatalog } from "@/context/CatalogContext";

const SESSION_KEY = "taj-admin-pass";

function defaultDraft(names: NameMap): NameMap {
  const init: NameMap = {};
  for (const p of PRODUCTS) init[p.id] = names[p.id]?.trim() || p.name;
  return init;
}

function newId() {
  return `lb${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`;
}

export default function Admin() {
  const { names, lookbook, reload } = useCatalog();
  const [authed, setAuthed] = useState(() => !!sessionStorage.getItem(SESSION_KEY));
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [logging, setLogging] = useState(false);
  const [draft, setDraft] = useState<NameMap>({});
  const [items, setItems] = useState<LookItem[]>([]);
  const [board, setBoard] = useState<"lookbook" | "site">("lookbook");
  const [filter, setFilter] = useState<Category | "all">("all");
  const [kindFilter, setKindFilter] = useState<LookKind | "all">("all");
  const [query, setQuery] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (!authed) return;
    setDraft(defaultDraft(names));
    setItems(lookbook.map((x) => ({ ...x, price: x.price ?? "" })));
  }, [authed, names, lookbook]);

  const dirtyNames = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const now = (draft[p.id] ?? p.name).trim();
      const saved = (names[p.id]?.trim() || p.name).trim();
      return now !== saved;
    }).length;
  }, [draft, names]);

  const catalogDirty = useMemo(() => JSON.stringify(items) !== JSON.stringify(lookbook), [items, lookbook]);

  const siteList = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const name = draft[p.id] ?? p.name;
      const okCat = filter === "all" || p.category === filter;
      const q = query.trim();
      return okCat && (!q || name.includes(q) || p.name.includes(q));
    });
  }, [filter, query, draft]);

  const catalogList = useMemo(() => {
    const q = query.trim();
    return items
      .map((item, index) => ({ item, index }))
      .filter(({ item }) => {
        const okKind = kindFilter === "all" || item.kind === kindFilter;
        return okKind && (!q || item.name.includes(q) || item.size.includes(q) || (item.price ?? "").includes(q));
      });
  }, [items, kindFilter, query]);

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
    setItems([]);
  };

  const pass = () => sessionStorage.getItem(SESSION_KEY) || password;

  const saveSite = async () => {
    setSaving(true);
    setMsg("");
    const payload: NameMap = {};
    for (const p of PRODUCTS) {
      const n = (draft[p.id] ?? p.name).trim();
      if (n && n !== p.name) payload[p.id] = n;
    }
    const res = await saveNameMap(pass(), payload);
    setSaving(false);
    if (!res.ok) {
      setMsg(res.error || "فشل حفظ أسماء الموقع");
      return;
    }
    await reload();
    setMsg("اتحفظت أسماء معرض الموقع");
  };

  const saveCatalog = async () => {
    for (const item of items) {
      if (!item.name.trim() || !item.size.trim() || !item.image.trim()) {
        setMsg("كل قطعة محتاجة اسم ومقاس وصورة");
        return;
      }
    }
    setSaving(true);
    setMsg("");
    const res = await saveCatalogItems(pass(), items);
    setSaving(false);
    if (!res.ok) {
      setMsg(res.error || "فشل حفظ الكتالوج");
      return;
    }
    await reload();
    setMsg("اتحفظ الكتالوج — ظاهر في الكتاب فورًا");
  };

  const addItem = () => {
    setItems((prev) => [
      {
        id: newId(),
        name: "قطعة جديدة",
        size: "مقاس — سم",
        price: "",
        kind: "clocks",
        image: "/images/lookbook/lb-01.png",
      },
      ...prev,
    ]);
    setMsg("اتضافت قطعة — عدّل الاسم والمقاس والصورة وبعدين احفظ");
  };

  const updateItem = (index: number, patch: Partial<LookItem>) => {
    setItems((prev) => prev.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  };

  const removeItem = (index: number) => {
    const name = items[index]?.name || "القطعة";
    if (!window.confirm(`مسح ${name} من الكتالوج؟`)) return;
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const moveItem = (index: number, dir: -1 | 1) => {
    const next = index + dir;
    if (next < 0 || next >= items.length) return;
    setItems((prev) => {
      const copy = [...prev];
      const tmp = copy[index];
      copy[index] = copy[next];
      copy[next] = tmp;
      return copy;
    });
  };

  const onUpload = async (index: number, file: File | undefined) => {
    if (!file) return;
    const res = await uploadCatalogImage(pass(), file);
    if (!res.ok || !res.url) {
      setMsg(res.error || "فشل رفع الصورة");
      return;
    }
    updateItem(index, { image: res.url });
    setMsg("اترفعت الصورة — اضغط حفظ الكتالوج عشان تتثبت");
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
          <p className="mt-2 text-center text-sm text-[#7a6f60]">إدارة الكتالوج ومعرض الموقع</p>
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
          <Link to="/catalog" className="mt-2 block text-center text-xs font-semibold text-[#7a6f60]">
            فتح الكتالوج
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
            <h1 className="text-lg font-black text-[#191920]">لوحة تاج</h1>
            <p className="text-xs text-[#7a6f60]">
              {board === "lookbook"
                ? `${items.length} قطعة في الكتاب${catalogDirty ? " — في تعديلات مش محفوظة" : ""}`
                : `${PRODUCTS.length} منتج في المعرض — ${dirtyNames} تعديل أسماء`}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {board === "lookbook" ? (
              <>
                <button
                  type="button"
                  onClick={addItem}
                  className="flex items-center gap-1.5 rounded-full border border-[#eadfc9] px-4 py-2 text-xs font-bold text-[#5d554a]"
                >
                  <Plus className="h-4 w-4" />
                  إضافة قطعة
                </button>
                <button
                  type="button"
                  onClick={() => void saveCatalog()}
                  disabled={saving}
                  className="bg-gold-gradient flex items-center gap-1.5 rounded-full px-5 py-2 text-xs font-black text-[#191920] disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  {saving ? "بيحفظ…" : "حفظ الكتالوج"}
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setDraft(defaultDraft({}));
                    setMsg("رجّعنا أسماء المعرض — اضغط حفظ عشان تتثبت");
                  }}
                  className="flex items-center gap-1.5 rounded-full border border-[#eadfc9] px-4 py-2 text-xs font-bold text-[#5d554a]"
                >
                  <RotateCcw className="h-4 w-4" />
                  الافتراضي
                </button>
                <button
                  type="button"
                  onClick={() => void saveSite()}
                  disabled={saving}
                  className="bg-gold-gradient flex items-center gap-1.5 rounded-full px-5 py-2 text-xs font-black text-[#191920] disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  {saving ? "بيحفظ…" : "حفظ الأسماء"}
                </button>
              </>
            )}
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

        <div className="mb-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              setBoard("lookbook");
              setQuery("");
            }}
            className={`rounded-full px-4 py-2 text-xs font-bold ${board === "lookbook" ? "bg-[#191920] text-[#e6c987]" : "border border-[#eadfc9] bg-white"}`}
          >
            كتاب الكتالوج
          </button>
          <button
            type="button"
            onClick={() => {
              setBoard("site");
              setQuery("");
            }}
            className={`rounded-full px-4 py-2 text-xs font-bold ${board === "site" ? "bg-[#191920] text-[#e6c987]" : "border border-[#eadfc9] bg-white"}`}
          >
            معرض الموقع
          </button>
          <Link to="/catalog" className="rounded-full border border-[#eadfc9] bg-white px-4 py-2 text-xs font-bold text-[#a8853f]">
            معاينة الكتاب
          </Link>
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            {board === "lookbook" &&
              (["all", "clocks", "pots"] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setKindFilter(f)}
                  className={`rounded-full px-4 py-2 text-xs font-bold ${
                    kindFilter === f
                      ? "bg-gold-gradient text-white"
                      : "border border-[#eadfc9] bg-white text-[#5d554a]"
                  }`}
                >
                  {LOOK_LABELS[f]}
                </button>
              ))}
            {board === "site" &&
              (["all", "clocks", "vases", "sets"] as const).map((f) => (
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

        {board === "lookbook" ? (
          <div className="mt-6 grid gap-3">
            {catalogList.map(({ item, index }) => (
              <div
                key={item.id}
                className="grid gap-3 rounded-2xl border border-[#eadfc9] bg-white p-3 md:grid-cols-[96px_1fr_auto]"
              >
                <img src={item.image} alt="" className="h-24 w-full rounded-xl object-cover object-top md:h-24 md:w-24" />
                <div className="grid gap-2 sm:grid-cols-2">
                  <label className="text-[11px] font-bold text-[#7a6f60]">
                    الاسم
                    <input
                      value={item.name}
                      onChange={(e) => updateItem(index, { name: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-[#eadfc9] px-3 py-2 text-sm font-bold text-[#191920] outline-none focus:border-[#c6a15b]"
                    />
                  </label>
                  <label className="text-[11px] font-bold text-[#7a6f60]">
                    المقاس
                    <input
                      value={item.size}
                      onChange={(e) => updateItem(index, { size: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-[#eadfc9] px-3 py-2 text-sm font-bold text-[#191920] outline-none focus:border-[#c6a15b]"
                    />
                  </label>
                  <label className="text-[11px] font-bold text-[#7a6f60]">
                    السعر
                    <input
                      value={item.price ?? ""}
                      onChange={(e) => updateItem(index, { price: e.target.value })}
                      placeholder="مثال: 55 جنيه"
                      className="mt-1 w-full rounded-xl border border-[#eadfc9] px-3 py-2 text-sm font-bold text-[#191920] outline-none focus:border-[#c6a15b]"
                    />
                  </label>
                  <label className="text-[11px] font-bold text-[#7a6f60]">
                    النوع
                    <select
                      value={item.kind}
                      onChange={(e) => updateItem(index, { kind: e.target.value as LookKind })}
                      className="mt-1 w-full rounded-xl border border-[#eadfc9] bg-white px-3 py-2 text-sm font-bold text-[#191920] outline-none"
                    >
                      <option value="clocks">ساعات</option>
                      <option value="pots">بوتات وأصص</option>
                    </select>
                  </label>
                  <label className="text-[11px] font-bold text-[#7a6f60]">
                    صورة جديدة
                    <span className="mt-1 flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-[#c6a15b] px-3 py-2 text-xs font-bold text-[#a8853f]">
                      <ImagePlus className="h-4 w-4" />
                      رفع صورة
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        className="hidden"
                        onChange={(e) => void onUpload(index, e.target.files?.[0])}
                      />
                    </span>
                  </label>
                </div>
                <div className="flex items-center gap-2 md:flex-col">
                  <button
                    type="button"
                    onClick={() => moveItem(index, -1)}
                    className="rounded-full border border-[#eadfc9] p-2 text-[#5d554a]"
                    aria-label="أعلى"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveItem(index, 1)}
                    className="rounded-full border border-[#eadfc9] p-2 text-[#5d554a]"
                    aria-label="أسفل"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="rounded-full border border-[#f0d0c8] p-2 text-[#b0574a]"
                    aria-label="مسح"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-6 grid gap-3">
            {siteList.map((p) => {
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
        )}
      </div>
    </div>
  );
}

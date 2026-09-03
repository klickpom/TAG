import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { PRODUCTS, type Product } from "@/data/products";
import { LOOKBOOK, type LookItem } from "@/data/lookbook";
import { fetchNameMap, type NameMap } from "@/lib/productNames";

interface CatalogCtx {
  products: Product[];
  lookbook: LookItem[];
  names: NameMap;
  loading: boolean;
  reload: () => Promise<void>;
}

const Ctx = createContext<CatalogCtx | null>(null);

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [names, setNames] = useState<NameMap>({});
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    const map = await fetchNameMap();
    setNames(map);
    setLoading(false);
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const products = useMemo(
    () =>
      PRODUCTS.map((p) => {
        const n = names[p.id]?.trim();
        return n ? { ...p, name: n } : p;
      }),
    [names]
  );

  const lookbook = useMemo(
    () =>
      LOOKBOOK.map((p) => {
        const n = names[p.id]?.trim();
        return n ? { ...p, name: n } : p;
      }),
    [names]
  );

  return (
    <Ctx.Provider value={{ products, lookbook, names, loading, reload }}>
      {children}
    </Ctx.Provider>
  );
}

export function useCatalog() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCatalog must be used within CatalogProvider");
  return ctx;
}

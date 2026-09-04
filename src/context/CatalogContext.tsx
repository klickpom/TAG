import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { LOOKBOOK, type LookItem } from "@/data/lookbook";
import { fetchNameMap, type NameMap } from "@/lib/productNames";
import { fetchCatalogItems } from "@/lib/catalogApi";

interface CatalogCtx {
  lookbook: LookItem[];
  names: NameMap;
  loading: boolean;
  reload: () => Promise<void>;
}

const Ctx = createContext<CatalogCtx | null>(null);

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [names, setNames] = useState<NameMap>({});
  const [lookbook, setLookbook] = useState<LookItem[]>(LOOKBOOK);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    const [map, items] = await Promise.all([fetchNameMap(), fetchCatalogItems()]);
    setNames(map);
    setLookbook(items);
    setLoading(false);
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return (
    <Ctx.Provider value={{ lookbook, names, loading, reload }}>
      {children}
    </Ctx.Provider>
  );
}

export function useCatalog() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCatalog must be used within CatalogProvider");
  return ctx;
}

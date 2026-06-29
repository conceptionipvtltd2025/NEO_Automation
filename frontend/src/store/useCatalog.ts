import { create } from "zustand";
import { persist } from "zustand/middleware";
import { products as seedProducts, type Product } from "@/data/products";
import { categories as seedCategories, type Category } from "@/data/categories";
import { industries as seedIndustries, type Industry } from "@/data/industries";
import { api } from "@/lib/api";

type CatalogState = {
  products: Product[];
  categories: Category[];
  industries: Industry[];
  loaded: boolean;
  /** Pull the catalogue from the API. Falls back to persisted/seed data if offline. */
  load: () => Promise<void>;
  // products
  upsertProduct: (p: Product) => void;
  deleteProduct: (id: string) => void;
  toggleProduct: (id: string) => void;
  // categories
  upsertCategory: (c: Category) => void;
  deleteCategory: (id: string) => void;
  // industries
  upsertIndustry: (i: Industry) => void;
  deleteIndustry: (id: string) => void;
  resetAll: () => void;
};

// Fire-and-forget API sync; failures are swallowed so the optimistic local
// state (persisted to localStorage) keeps the UI working offline.
const sync = (p: Promise<unknown>) => {
  p.catch(() => {
    /* offline / unauthorized — local fallback already applied */
  });
};

export const useCatalog = create<CatalogState>()(
  persist(
    (set, get) => ({
      products: seedProducts,
      categories: seedCategories,
      industries: seedIndustries,
      loaded: false,

      load: async () => {
        try {
          const [products, categories, industries] = await Promise.all([
            api.get<Product[]>("/products"),
            api.get<Category[]>("/categories"),
            api.get<Industry[]>("/industries"),
          ]);
          set({ products, categories, industries, loaded: true });
        } catch {
          // Backend unreachable — keep whatever is in the persisted store / seed.
          set({ loaded: true });
        }
      },

      upsertProduct: (p) => {
        set((s) => {
          const exists = s.products.some((x) => x.id === p.id);
          return {
            products: exists
              ? s.products.map((x) => (x.id === p.id ? p : x))
              : [{ ...p }, ...s.products],
          };
        });
        sync(api.put(`/products/${p.id}`, p));
      },
      deleteProduct: (id) => {
        set((s) => ({ products: s.products.filter((x) => x.id !== id) }));
        sync(api.del(`/products/${id}`));
      },
      toggleProduct: (id) => {
        set((s) => ({
          products: s.products.map((x) =>
            x.id === id ? { ...x, visible: x.visible === false } : x
          ),
        }));
        sync(api.patch(`/products/${id}/toggle`));
      },

      upsertCategory: (c) => {
        set((s) => {
          const exists = s.categories.some((x) => x.id === c.id);
          return {
            categories: exists
              ? s.categories.map((x) => (x.id === c.id ? c : x))
              : [...s.categories, c],
          };
        });
        sync(api.put(`/categories/${c.id}`, c));
      },
      deleteCategory: (id) => {
        set((s) => ({ categories: s.categories.filter((x) => x.id !== id) }));
        sync(api.del(`/categories/${id}`));
      },

      upsertIndustry: (i) => {
        set((s) => {
          const exists = s.industries.some((x) => x.id === i.id);
          return {
            industries: exists
              ? s.industries.map((x) => (x.id === i.id ? i : x))
              : [...s.industries, i],
          };
        });
        sync(api.put(`/industries/${i.id}`, i));
      },
      deleteIndustry: (id) => {
        set((s) => ({ industries: s.industries.filter((x) => x.id !== id) }));
        sync(api.del(`/industries/${id}`));
      },

      resetAll: () =>
        set({
          products: seedProducts,
          categories: seedCategories,
          industries: seedIndustries,
        }),
    }),
    { name: "neo-catalog", version: 2 }
  )
);

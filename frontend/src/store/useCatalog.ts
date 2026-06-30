import { create } from "zustand";
import { persist } from "zustand/middleware";
import { products as seedProducts, type Product } from "@/data/products";
import { categories as seedCategories, type Category } from "@/data/categories";
import { industries as seedIndustries, type Industry } from "@/data/industries";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/store/useAuth";

type CatalogState = {
  products: Product[];
  categories: Category[];
  industries: Industry[];
  loaded: boolean;
  /** Last write error surfaced to the admin (null when the last write succeeded). */
  lastError: string | null;
  clearError: () => void;
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
  toggleIndustry: (id: string) => void;
  resetAll: () => void;
};

// Persist a write to the backend and surface the outcome. Unlike fire-and-forget,
// this distinguishes the failure modes so an admin is never misled into thinking
// an edit saved when it didn't:
//  • 401 → the session/token is invalid or expired → force re-login.
//  • other API error / network down → record a message for the admin banner.
const persistWrite = (p: Promise<unknown>, action: string) => {
  p.then(() => {
    // Success — clear any stale error.
    useCatalog.setState({ lastError: null });
  }).catch((err) => {
    if (err instanceof ApiError && err.status === 401) {
      useCatalog.setState({
        lastError: "Your session expired — please sign in again to save changes.",
      });
      // Drop the invalid session so the route guard sends them to login.
      try {
        useAuth.getState().logout();
      } catch {
        /* ignore */
      }
      return;
    }
    useCatalog.setState({
      lastError: `Couldn't save ${action} to the server. It may not persist — check your connection and try again.`,
    });
  });
};

export const useCatalog = create<CatalogState>()(
  persist(
    (set, get) => ({
      products: seedProducts,
      categories: seedCategories,
      industries: seedIndustries,
      loaded: false,
      lastError: null,

      clearError: () => set({ lastError: null }),

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
        persistWrite(api.put(`/products/${p.id}`, p), "product");
      },
      deleteProduct: (id) => {
        set((s) => ({ products: s.products.filter((x) => x.id !== id) }));
        persistWrite(api.del(`/products/${id}`), "deletion");
      },
      toggleProduct: (id) => {
        set((s) => ({
          products: s.products.map((x) =>
            x.id === id ? { ...x, visible: x.visible === false } : x
          ),
        }));
        persistWrite(api.patch(`/products/${id}/toggle`), "product");
      },

      upsertCategory: (c) => {
        set((s) => {
          const exists = s.categories.some((x) => x.id === c.id);
          return {
            categories: exists
              ? s.categories.map((x) => (x.id === c.id ? c : x))
              : [c, ...s.categories], // prepend so a new category shows immediately
          };
        });
        persistWrite(api.put(`/categories/${c.id}`, c), "category");
      },
      deleteCategory: (id) => {
        set((s) => ({ categories: s.categories.filter((x) => x.id !== id) }));
        persistWrite(api.del(`/categories/${id}`), "deletion");
      },

      upsertIndustry: (i) => {
        set((s) => {
          const exists = s.industries.some((x) => x.id === i.id);
          if (exists) {
            return {
              industries: s.industries.map((x) => (x.id === i.id ? i : x)),
            };
          }
          // New industry: enabled by default, timestamped, and prepended so it
          // shows at the top of the admin list immediately (no "lost at the bottom").
          const created: Industry = {
            ...i,
            visible: i.visible ?? true,
            createdAt: i.createdAt ?? Date.now(),
          };
          return { industries: [created, ...s.industries] };
        });
        // Send the enriched record so the backend stores visible/createdAt too.
        const payload = get().industries.find((x) => x.id === i.id) ?? i;
        persistWrite(api.put(`/industries/${i.id}`, payload), "industry");
      },
      deleteIndustry: (id) => {
        set((s) => ({ industries: s.industries.filter((x) => x.id !== id) }));
        persistWrite(api.del(`/industries/${id}`), "deletion");
      },
      toggleIndustry: (id) => {
        set((s) => ({
          industries: s.industries.map((x) =>
            x.id === id ? { ...x, visible: x.visible === false } : x
          ),
        }));
        persistWrite(api.patch(`/industries/${id}/toggle`), "industry");
      },

      resetAll: () =>
        set({
          products: seedProducts,
          categories: seedCategories,
          industries: seedIndustries,
        }),
    }),
    { name: "neo-catalog", version: 3 }
  )
);

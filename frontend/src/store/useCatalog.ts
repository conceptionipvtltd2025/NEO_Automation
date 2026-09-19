import { create } from "zustand";
import { persist } from "zustand/middleware";
import { products as seedProducts, type Product } from "@/data/products";
import { categories as seedCategories, type Category } from "@/data/categories";
import { industries as seedIndustries, type Industry } from "@/data/industries";
import { brands as seedBrands, type Brand } from "@/data/brands";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/store/useAuth";

type CatalogState = {
  products: Product[];
  categories: Category[];
  industries: Industry[];
  brands: Brand[];
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
  // brands (including their product lines)
  upsertBrand: (b: Brand) => void;
  deleteBrand: (id: string) => void;
  resetAll: () => void;
};

// Persist a write to the backend and surface the outcome. Unlike fire-and-forget,
// this distinguishes the failure modes so an admin is never misled into thinking
// an edit saved when it didn't:
//  • 401 → the session/token is invalid or expired → force re-login.
//  • other API error / network down → record a message for the admin banner.
/** Next free position for a record appended to an ordered list. */
/**
 * Order by the admin's explicit sequence, falling back to name. Mirrors the
 * server's `ORDER BY sort_order, name`, so the list does not re-shuffle when
 * the API response replaces the local state.
 *
 * This runs after every upsert because the admin's up/down arrows work by
 * WRITING new sortOrder values — the list is rendered in array order, so
 * without a re-sort the numbers would change and nothing would visibly move.
 */
const bySortOrder = <T extends { sortOrder?: number; name?: string }>(a: T, b: T) =>
  (a.sortOrder ?? Number.MAX_SAFE_INTEGER) - (b.sortOrder ?? Number.MAX_SAFE_INTEGER) ||
  String(a.name ?? "").localeCompare(String(b.name ?? ""));

const nextSortOrder = (list: { sortOrder?: number }[]) =>
  list.reduce((max, x) => Math.max(max, x.sortOrder ?? 0), 0) + 1;

const persistWrite = (p: Promise<unknown>, action: string) => {
  p.then(() => {
    // Success — clear any stale error.
    useCatalog.setState({ lastError: null });
  }).catch((err) => {
    if (err instanceof ApiError && err.status === 401) {
      useCatalog.setState({
        lastError: "Your session expired — please sign in again to save changes.",
      });
      // Drop the invalid session so the route guard sends them to login, with
      // the reason recorded for the login screen.
      try {
        useAuth.getState().expireSession();
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
      brands: seedBrands,
      loaded: false,
      lastError: null,

      clearError: () => set({ lastError: null }),

      load: async () => {
        try {
          const [products, categories, industries, brands] = await Promise.all([
            api.get<Product[]>("/products"),
            api.get<Category[]>("/categories"),
            api.get<Industry[]>("/industries"),
            api.get<Brand[]>("/brands"),
          ]);
          set({
            products,
            categories,
            industries,
            // A database seeded before brands carried product lines would blank
            // the whole brand experience, so fall back to the seed if the API
            // returns nothing usable.
            brands: brands?.length ? brands : seedBrands,
            loaded: true,
          });
        } catch {
          // Backend unreachable — keep whatever is in the persisted store / seed.
          set({ loaded: true });
        }
      },

      upsertProduct: (p) => {
        set((s) => {
          const prev = s.products.find((x) => x.id === p.id);
          // Keep the catalogue sequence. The product form does not edit
          // sortOrder, so an incoming record without one would be written as 0
          // and jump to the front of its category on the next save.
          const withOrder: Product = {
            ...p,
            sortOrder: p.sortOrder ?? prev?.sortOrder ?? nextSortOrder(s.products),
          };
          const list = prev
            ? s.products.map((x) => (x.id === p.id ? withOrder : x))
            : [withOrder, ...s.products];
          // Products are sequenced WITHIN their category (the only list a
          // visitor browses them in), so group by category first. The home
          // page has its own ranking (homeOrder/categoryOrder) and reads it
          // separately — this ordering does not affect it.
          return {
            products: [...list].sort(
              (a, b) =>
                String(a.categoryId ?? "").localeCompare(String(b.categoryId ?? "")) ||
                bySortOrder(a, b)
            ),
          };
        });
        const payload = get().products.find((x) => x.id === p.id) ?? p;
        persistWrite(api.put(`/products/${p.id}`, payload), "product");
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
          const prev = s.categories.find((x) => x.id === c.id);
          // Keep the catalogue sequence. The admin form doesn't edit sortOrder,
          // so an incoming record without one would be written as 0 and jump to
          // the front of a client-approved order.
          const withOrder: Category = {
            ...c,
            sortOrder: c.sortOrder ?? prev?.sortOrder ?? nextSortOrder(s.categories),
          };
          const list = prev
            ? s.categories.map((x) => (x.id === c.id ? withOrder : x))
            : [...s.categories, withOrder];
          // Re-sort by sortOrder. The admin's up/down arrows work by writing
          // new sortOrder values, and the list is rendered in ARRAY order — so
          // without this the numbers would change and nothing would visibly
          // move. Matches the server, which returns `ORDER BY sort_order, name`.
          return {
            categories: [...list].sort(
              (a, b) =>
                (a.sortOrder ?? Number.MAX_SAFE_INTEGER) -
                  (b.sortOrder ?? Number.MAX_SAFE_INTEGER) ||
                a.name.localeCompare(b.name)
            ),
          };
        });
        const payload = get().categories.find((x) => x.id === c.id) ?? c;
        persistWrite(api.put(`/categories/${c.id}`, payload), "category");
      },
      deleteCategory: (id) => {
        set((s) => ({ categories: s.categories.filter((x) => x.id !== id) }));
        persistWrite(api.del(`/categories/${id}`), "deletion");
      },

      upsertIndustry: (i) => {
        set((s) => {
          const exists = s.industries.some((x) => x.id === i.id);
          if (exists) {
            const prev = s.industries.find((x) => x.id === i.id);
            // Same guard as categories/products: the industry form does not
            // edit sortOrder, so carry the stored value through or an ordinary
            // save resets the row to 0 and jumps it to the front.
            const withOrder: Industry = {
              ...i,
              sortOrder: i.sortOrder ?? prev?.sortOrder ?? 0,
            };
            return {
              industries: s.industries
                .map((x) => (x.id === i.id ? withOrder : x))
                .sort(bySortOrder),
            };
          }
          // New industry: enabled by default, timestamped, and prepended so it
          // shows at the top of the admin list immediately (no "lost at the bottom").
          const created: Industry = {
            ...i,
            visible: i.visible ?? true,
            createdAt: i.createdAt ?? Date.now(),
            sortOrder: i.sortOrder ?? nextSortOrder(s.industries),
          };
          return { industries: [created, ...s.industries].sort(bySortOrder) };
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

      upsertBrand: (b) => {
        set((s) => {
          const prev = s.brands.find((x) => x.id === b.id);
          // New brands go last: the existing ten are a client-approved
          // sequence, so an addition shouldn't jump the queue. An edit keeps
          // whatever position it already had.
          const withOrder: Brand = {
            ...b,
            lines: b.lines ?? [],
            sortOrder: b.sortOrder ?? prev?.sortOrder ?? nextSortOrder(s.brands),
          };
          return {
            brands: prev
              ? s.brands.map((x) => (x.id === b.id ? withOrder : x))
              : [...s.brands, withOrder],
          };
        });
        const payload = get().brands.find((x) => x.id === b.id) ?? b;
        persistWrite(api.put(`/brands/${b.id}`, payload), "brand");
      },
      deleteBrand: (id) => {
        set((s) => ({ brands: s.brands.filter((x) => x.id !== id) }));
        persistWrite(api.del(`/brands/${id}`), "deletion");
      },

      resetAll: () =>
        set({
          products: seedProducts,
          categories: seedCategories,
          industries: seedIndustries,
          brands: seedBrands,
        }),
    }),
    {
      name: "neo-catalog",
      version: 6,
      // v6 moved brands (and their product lines) into the store so they can be
      // edited in the admin panel.
      // v5 is the client's catalogue revision: ten industry segments (Data
      // Center dropped), twelve solution families replacing the six old
      // categories, and brand product lines on products. A visitor's persisted
      // v4 catalogue would otherwise keep serving retired ids forever, so drop
      // the cache and fall back to the seed — `load()` re-fetches server truth
      // on the next boot anyway.
      migrate: () => ({
        products: seedProducts,
        categories: seedCategories,
        industries: seedIndustries,
        brands: seedBrands,
      }),
    }
  )
);

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { products as seedProducts, type Product } from "@/data/products";
import { categories as seedCategories, type Category } from "@/data/categories";
import { industries as seedIndustries, type Industry } from "@/data/industries";

type CatalogState = {
  products: Product[];
  categories: Category[];
  industries: Industry[];
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

export const useCatalog = create<CatalogState>()(
  persist(
    (set) => ({
      products: seedProducts,
      categories: seedCategories,
      industries: seedIndustries,
      upsertProduct: (p) =>
        set((s) => {
          const exists = s.products.some((x) => x.id === p.id);
          return {
            products: exists
              ? s.products.map((x) => (x.id === p.id ? p : x))
              : [{ ...p }, ...s.products],
          };
        }),
      deleteProduct: (id) =>
        set((s) => ({ products: s.products.filter((x) => x.id !== id) })),
      toggleProduct: (id) =>
        set((s) => ({
          products: s.products.map((x) =>
            x.id === id ? { ...x, visible: !x.visible } : x
          ),
        })),
      upsertCategory: (c) =>
        set((s) => {
          const exists = s.categories.some((x) => x.id === c.id);
          return {
            categories: exists
              ? s.categories.map((x) => (x.id === c.id ? c : x))
              : [...s.categories, c],
          };
        }),
      deleteCategory: (id) =>
        set((s) => ({ categories: s.categories.filter((x) => x.id !== id) })),
      upsertIndustry: (i) =>
        set((s) => {
          const exists = s.industries.some((x) => x.id === i.id);
          return {
            industries: exists
              ? s.industries.map((x) => (x.id === i.id ? i : x))
              : [...s.industries, i],
          };
        }),
      deleteIndustry: (id) =>
        set((s) => ({ industries: s.industries.filter((x) => x.id !== id) })),
      resetAll: () =>
        set({
          products: seedProducts,
          categories: seedCategories,
          industries: seedIndustries,
        }),
    }),
    { name: "neo-catalog", version: 1 }
  )
);

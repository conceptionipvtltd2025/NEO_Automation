import { useMemo } from "react";
import { useCatalog } from "@/store/useCatalog";
import {
  navItems as baseNavItems,
  type NavItem,
  type NavColumn,
  type NavTile,
} from "@/data/site";

// Returns the nav items with the Products & Industries mega-menus rebuilt from
// the LIVE catalogue store, so categories/industries/brands added or edited in
// the admin show up in the header. The Home/Service/Company/Contact items stay
// as defined statically in site.ts (they map fixed content pages, not catalogue
// data). Categories/industries fall back to seed data when the API is offline.
export function useNavItems(): NavItem[] {
  const categories = useCatalog((s) => s.categories);
  const industries = useCatalog((s) => s.industries);
  const products = useCatalog((s) => s.products);
  const allBrands = useCatalog((s) => s.brands);

  return useMemo(() => {
    const visIndustries = industries.filter((i) => i.visible !== false);
    const visProducts = products.filter((p) => p.visible !== false);

    // Show brands that actually have products in the catalogue (fall back to all).
    const brandIds = new Set(visProducts.map((p) => p.brandId));
    const activeBrands = allBrands.filter((b) => brandIds.has(b.id));
    const brandList = activeBrands.length ? activeBrands : allBrands;

    // A hero photo for the Products featured card, from a flagship product.
    const heroProduct =
      visProducts.find((p) => p.special) ??
      visProducts.find((p) => p.featured) ??
      visProducts[0];

    const productsColumns: NavColumn[] = [
      {
        heading: "Shop by Category",
        // Six, not eight: with twelve families the column ran past the bottom
        // of the panel. The rest are one click away on the catalogue grid.
        links: [
          ...categories.slice(0, 6).map((c) => ({
            label: c.name,
            href: `/products?category=${c.id}`,
            desc: c.description,
          })),
          {
            label: `All ${categories.length} categories`,
            href: "/products#catalogue",
            desc: "The complete catalogue grid",
          },
        ],
      },
      {
        heading: "Shop by Brand",
        links: brandList.slice(0, 6).map((b) => ({
          label: b.name,
          href: `/brands/${b.id}`,
          desc: b.category,
        })),
      },
      {
        heading: "Shop by Application",
        links: [
          ...visIndustries.slice(0, 4).map((i) => ({
            label: i.name,
            href: `/products?industry=${i.id}`,
            desc: i.short,
          })),
          {
            label: "Browse full catalogue",
            href: "/products",
            desc: "All products, filters & search",
          },
        ],
      },
    ];

    const industryTiles: NavTile[] = visIndustries.map((i) => ({
      label: i.name,
      href: `/industries/${i.id}`,
      desc: i.short,
      image: i.image,
    }));

    // Columns power the mobile accordion + the desktop quick-link pills.
    const industriesColumns: NavColumn[] = [
      {
        heading: "All Industries",
        links: visIndustries.map((i) => ({
          label: i.name,
          href: `/industries/${i.id}`,
          desc: i.short,
        })),
      },
      {
        heading: "Get Tailored Advice",
        links: [
          { label: "All industries", href: "/industries", desc: "Explore every sector we power" },
          { label: "Talk to a specialist", href: "/inquiry", desc: "Get a tailored tooling recommendation" },
          { label: "Request a quote", href: "/inquiry", desc: "Pricing, availability & lead times" },
        ],
      },
    ];

    return baseNavItems.map((item) => {
      if (!item.mega) return item;
      if (item.label === "Products") {
        return {
          ...item,
          mega: {
            ...item.mega,
            columns: productsColumns,
            featured: heroProduct?.images?.[0]
              ? { ...item.mega.featured, bgImage: heroProduct.images[0] }
              : item.mega.featured,
          },
        };
      }
      if (item.label === "Industries") {
        return {
          ...item,
          mega: { ...item.mega, columns: industriesColumns, tiles: industryTiles },
        };
      }
      return item;
    });
  }, [categories, industries, products, allBrands]);
}

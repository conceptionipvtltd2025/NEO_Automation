import { useMemo, useState } from "react";
import {
  Home,
  LayoutGrid,
  Sparkles,
  ChevronUp,
  ChevronDown,
  X,
  Plus,
  Package,
  Tags,
  Search,
  Eye,
  EyeOff,
} from "lucide-react";
import { useCatalog } from "@/store/useCatalog";
import type { Product } from "@/data/products";
import type { Category } from "@/data/categories";
import { Modal } from "@/components/ui/Modal";
import {
  homeFeatured,
  homeSpecial,
  HOME_GRID_LIMIT,
  HOME_SIGNATURE_LIMIT,
} from "@/lib/homeProducts";
import { cn } from "@/lib/utils";
import { safeImg, onImgError } from "@/lib/image";
import { categoryIcon } from "@/lib/categoryIcons";

const GRID_LIMIT = HOME_GRID_LIMIT;
const SIGNATURE_LIMIT = HOME_SIGNATURE_LIMIT;

/**
 * "Home Page" — one screen showing exactly what the landing page displays, and
 * letting a non-technical admin reorder it with arrows.
 *
 * Why this page exists: the underlying model is a shared numeric rank that a
 * product carries directly (`homeOrder`) and a category lends to all of its
 * products. That model is what makes "this one product first, then this whole
 * family" expressible — but asking a client to reason about it, spread across
 * two separate admin sections, is not a reasonable ask. Here the numbers are
 * never typed: Move up / Move down renumber the whole list 1..n behind the
 * scenes, so the order on screen is the order on the site.
 */

/** One entry in the catalogue grid: a single product, or a whole family. */
type Entry =
  | { kind: "product"; id: string; product: Product }
  | { kind: "category"; id: string; category: Category; count: number };

export default function AdminHomePage() {
  const { products, categories, upsertProduct, upsertCategory } = useCatalog();
  const [picker, setPicker] = useState<null | "product" | "category" | "signature">(null);

  /* ── what is currently pinned, in the order the site renders it ──────── */

  const entries = useMemo<Entry[]>(() => {
    const live = products.filter((p) => p.visible !== false);
    const list: Entry[] = [
      ...products
        .filter((p) => p.featured)
        .map((p) => ({ kind: "product" as const, id: `p:${p.id}`, product: p })),
      ...categories
        .filter((c) => c.showOnHome)
        .map((c) => ({
          kind: "category" as const,
          id: `c:${c.id}`,
          category: c,
          count: live.filter((p) => p.categoryId === c.id).length,
        })),
    ];
    // Sort by the same rules the site uses, so this list IS the running order.
    return list.sort((a, b) => {
      const ra = a.kind === "product" ? a.product.homeOrder : a.category.homeOrder;
      const rb = b.kind === "product" ? b.product.homeOrder : b.category.homeOrder;
      const aR = typeof ra === "number" && Number.isFinite(ra);
      const bR = typeof rb === "number" && Number.isFinite(rb);
      if (aR && bR && ra !== rb) return ra! - rb!;
      if (aR !== bR) return aR ? -1 : 1;
      if (a.kind !== b.kind) return a.kind === "product" ? -1 : 1;
      const an = a.kind === "product" ? a.product.name : a.category.name;
      const bn = b.kind === "product" ? b.product.name : b.category.name;
      return an.localeCompare(bn);
    });
  }, [products, categories]);

  const signature = useMemo(
    () =>
      products
        .filter((p) => p.special)
        .sort((a, b) => {
          const ra = a.homeOrder;
          const rb = b.homeOrder;
          const aR = typeof ra === "number" && Number.isFinite(ra);
          const bR = typeof rb === "number" && Number.isFinite(rb);
          if (aR && bR && ra !== rb) return ra! - rb!;
          if (aR !== bR) return aR ? -1 : 1;
          return a.name.localeCompare(b.name);
        }),
    [products]
  );

  /* ── previews: exactly what the visitor will see ─────────────────────── */

  const gridPreview = useMemo(
    () => homeFeatured(products, categories, GRID_LIMIT),
    [products, categories]
  );
  const signaturePreview = useMemo(
    () => homeSpecial(products, SIGNATURE_LIMIT),
    [products]
  );

  /* ── reordering: renumber 1..n so the admin never types a number ─────── */

  /** Write positions 1..n across the catalogue-grid entries. */
  const commitOrder = (list: Entry[]) => {
    list.forEach((e, i) => {
      const pos = i + 1;
      if (e.kind === "product") {
        if (e.product.homeOrder !== pos) upsertProduct({ ...e.product, homeOrder: pos });
      } else if (e.category.homeOrder !== pos) {
        upsertCategory({ ...e.category, homeOrder: pos });
      }
    });
  };

  const move = (index: number, dir: -1 | 1) => {
    const to = index + dir;
    if (to < 0 || to >= entries.length) return;
    const next = [...entries];
    [next[index], next[to]] = [next[to], next[index]];
    commitOrder(next);
  };

  const removeEntry = (e: Entry) => {
    if (e.kind === "product") {
      upsertProduct({ ...e.product, featured: false, homeOrder: undefined });
    } else {
      upsertCategory({ ...e.category, showOnHome: false, homeOrder: undefined });
    }
  };

  const moveSignature = (index: number, dir: -1 | 1) => {
    const to = index + dir;
    if (to < 0 || to >= signature.length) return;
    const next = [...signature];
    [next[index], next[to]] = [next[to], next[index]];
    next.forEach((p, i) => {
      if (p.homeOrder !== i + 1) upsertProduct({ ...p, homeOrder: i + 1 });
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-xl font-bold text-white sm:text-2xl">Home Page</h1>
        <p className="mt-1 text-sm text-steel-400">
          Everything shown on the landing page, in the order visitors see it. Use the arrows
          to reorder — nothing to number by hand.
        </p>
      </div>

      {/* ── Our Catalogue ─────────────────────────────────────────────── */}
      <Panel
        icon={LayoutGrid}
        title="Our Catalogue"
        hint={`The card grid under “Precision tools for every process”. Shows the first ${GRID_LIMIT} products.`}
        action={
          <div className="flex flex-wrap gap-2">
            <AddButton icon={Package} label="Add product" onClick={() => setPicker("product")} />
            <AddButton icon={Tags} label="Add category" onClick={() => setPicker("category")} />
          </div>
        }
      >
        {entries.length === 0 ? (
          <Empty text="Nothing pinned yet — the grid is filling itself from the catalogue. Add a product or a whole category to take control of it." />
        ) : (
          <ol className="space-y-2">
            {entries.map((e, i) => (
              <li
                key={e.id}
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-3"
              >
                <span className="w-6 shrink-0 text-center font-display text-sm font-bold text-steel-500">
                  {i + 1}
                </span>

                {e.kind === "product" ? (
                  <>
                    <img
                      src={safeImg(e.product.images[0])}
                      onError={onImgError}
                      alt=""
                      className="h-10 w-10 shrink-0 rounded-lg object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-white">{e.product.name}</p>
                      <p className="truncate text-xs text-steel-500">
                        {e.product.brand} · single product
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-neo-600/15 text-neo-400">
                      {(() => {
                        const Ico = categoryIcon(e.category.icon);
                        return <Ico className="h-4 w-4" />;
                      })()}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-white">
                        {e.category.name}
                      </p>
                      <p className="truncate text-xs text-neo-400">
                        whole category · {e.count} product{e.count === 1 ? "" : "s"}
                      </p>
                    </div>
                  </>
                )}

                <Reorder
                  onUp={() => move(i, -1)}
                  onDown={() => move(i, 1)}
                  first={i === 0}
                  last={i === entries.length - 1}
                  onRemove={() => removeEntry(e)}
                />
              </li>
            ))}
          </ol>
        )}

        <Preview
          items={gridPreview}
          limit={GRID_LIMIT}
          note={
            entries.length === 0
              ? "Auto-filled from the catalogue."
              : gridPreview.length < GRID_LIMIT
              ? "Fewer than the grid holds, so the rest is topped up from the catalogue."
              : undefined
          }
        />
      </Panel>

      {/* ── Signature Engineering ─────────────────────────────────────── */}
      <Panel
        icon={Sparkles}
        title="Signature Engineering"
        hint={`The flagship list beside the 3D showpiece. Shows the first ${SIGNATURE_LIMIT} products.`}
        action={
          <AddButton icon={Package} label="Add product" onClick={() => setPicker("signature")} />
        }
      >
        {signature.length === 0 ? (
          <Empty text="No flagship products chosen yet." />
        ) : (
          <ol className="space-y-2">
            {signature.map((p, i) => (
              <li
                key={p.id}
                className={cn(
                  "flex items-center gap-3 rounded-xl border p-3",
                  i < SIGNATURE_LIMIT
                    ? "border-white/10 bg-white/[0.02]"
                    : "border-white/5 bg-white/[0.01] opacity-50"
                )}
              >
                <span className="w-6 shrink-0 text-center font-display text-sm font-bold text-steel-500">
                  {i + 1}
                </span>
                <img
                  src={safeImg(p.images[0])}
                  onError={onImgError}
                  alt=""
                  className="h-10 w-10 shrink-0 rounded-lg object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white">{p.name}</p>
                  <p className="truncate text-xs text-steel-500">
                    {p.brand}
                    {i >= SIGNATURE_LIMIT && " · not shown — beyond the limit"}
                  </p>
                </div>
                <Reorder
                  onUp={() => moveSignature(i, -1)}
                  onDown={() => moveSignature(i, 1)}
                  first={i === 0}
                  last={i === signature.length - 1}
                  onRemove={() => upsertProduct({ ...p, special: false })}
                />
              </li>
            ))}
          </ol>
        )}

        <Preview items={signaturePreview} limit={SIGNATURE_LIMIT} />
      </Panel>

      <PickerModal
        mode={picker}
        onClose={() => setPicker(null)}
        products={products}
        categories={categories}
        onPickProduct={(p) => {
          // New picks go to the end: appending never disturbs an order the
          // admin has already arranged above.
          const last = Math.max(
            0,
            ...products.map((x) => x.homeOrder ?? 0),
            ...categories.map((c) => c.homeOrder ?? 0)
          );
          upsertProduct({
            ...p,
            ...(picker === "signature" ? { special: true } : { featured: true }),
            homeOrder: p.homeOrder ?? last + 1,
          });
          setPicker(null);
        }}
        onPickCategory={(c) => {
          const last = Math.max(
            0,
            ...products.map((x) => x.homeOrder ?? 0),
            ...categories.map((x) => x.homeOrder ?? 0)
          );
          upsertCategory({ ...c, showOnHome: true, homeOrder: c.homeOrder ?? last + 1 });
          setPicker(null);
        }}
      />
    </div>
  );
}

/* ───────────────────────────── pieces ───────────────────────────── */

function Panel({
  icon: Icon,
  title,
  hint,
  action,
  children,
}: {
  icon: typeof Home;
  title: string;
  hint: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-white/10 bg-ink-900 p-4 sm:p-6">
      <header className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-neo-600/15 text-neo-400">
            <Icon className="h-4 w-4" />
          </span>
          <div>
            <h2 className="font-display text-sm font-semibold text-white">{title}</h2>
            <p className="mt-0.5 max-w-prose text-[13px] leading-snug text-steel-500">{hint}</p>
          </div>
        </div>
        {action}
      </header>
      {children}
    </section>
  );
}

function AddButton({
  icon: Icon,
  label,
  onClick,
}: {
  icon: typeof Home;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg border border-white/10 px-3 text-[13px] font-medium text-steel-300 transition hover:border-white/20 hover:text-white"
    >
      <Plus className="h-3.5 w-3.5" />
      <Icon className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <p className="rounded-xl border border-dashed border-white/10 px-4 py-8 text-center text-[13px] text-steel-500">
      {text}
    </p>
  );
}

/** Up / down / remove — the whole reordering vocabulary of this page. */
function Reorder({
  onUp,
  onDown,
  first,
  last,
  onRemove,
}: {
  onUp: () => void;
  onDown: () => void;
  first: boolean;
  last: boolean;
  onRemove: () => void;
}) {
  return (
    <div className="flex shrink-0 items-center gap-1">
      <button
        type="button"
        onClick={onUp}
        disabled={first}
        aria-label="Move up"
        className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-steel-400 transition hover:border-white/25 hover:text-white disabled:pointer-events-none disabled:opacity-25"
      >
        <ChevronUp className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={onDown}
        disabled={last}
        aria-label="Move down"
        className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-steel-400 transition hover:border-white/25 hover:text-white disabled:pointer-events-none disabled:opacity-25"
      >
        <ChevronDown className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={onRemove}
        aria-label="Remove from home page"
        title="Remove from the home page (the product itself is not deleted)"
        className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-steel-400 transition hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-300"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

/** The actual rendered result — what a visitor sees, not what was configured. */
function Preview({
  items,
  limit,
  note,
}: {
  items: Product[];
  limit: number;
  note?: string;
}) {
  return (
    <div className="mt-5 border-t border-white/10 pt-4">
      <p className="mb-3 text-[11px] font-medium uppercase tracking-wider text-steel-500">
        On the site right now{note ? ` — ${note}` : ""}
      </p>
      <div className="flex flex-wrap gap-2">
        {items.slice(0, limit).map((p, i) => (
          <span
            key={p.id}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] py-1 pl-1 pr-3 text-xs text-steel-300"
          >
            <img
              src={safeImg(p.images[0])}
              onError={onImgError}
              alt=""
              className="h-5 w-5 rounded-full object-cover"
            />
            <span className="text-steel-600">{i + 1}</span>
            <span className="max-w-[14rem] truncate">{p.name}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/** Search-and-pick dialog for adding a product or a whole category. */
function PickerModal({
  mode,
  onClose,
  products,
  categories,
  onPickProduct,
  onPickCategory,
}: {
  mode: null | "product" | "category" | "signature";
  onClose: () => void;
  products: Product[];
  categories: Category[];
  onPickProduct: (p: Product) => void;
  onPickCategory: (c: Category) => void;
}) {
  const [q, setQ] = useState("");
  const isCategory = mode === "category";

  const list = useMemo(() => {
    const needle = q.toLowerCase();
    if (isCategory) {
      return categories.filter(
        (c) => !c.showOnHome && c.name.toLowerCase().includes(needle)
      );
    }
    return products.filter((p) => {
      // Already on this section? Then it isn't something to add.
      if (mode === "signature" ? p.special : p.featured) return false;
      return (
        p.name.toLowerCase().includes(needle) || p.brand.toLowerCase().includes(needle)
      );
    });
  }, [q, mode, isCategory, products, categories]);

  return (
    <Modal
      open={!!mode}
      onClose={onClose}
      title={isCategory ? "Add a category" : "Add a product"}
      maxWidth="max-w-lg"
    >
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-steel-500" />
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={isCategory ? "Search categories…" : "Search products…"}
          className="admin-input pl-10"
        />
      </div>

      <div className="mt-3 max-h-[22rem] space-y-1.5 overflow-y-auto">
        {list.length === 0 && (
          <p className="py-8 text-center text-sm text-steel-500">
            {q ? "Nothing matches that." : "Everything is already on the home page."}
          </p>
        )}

        {isCategory
          ? (list as Category[]).map((c) => {
              const count = products.filter(
                (p) => p.categoryId === c.id && p.visible !== false
              ).length;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => onPickCategory(c)}
                  className="flex w-full items-center gap-3 rounded-xl border border-white/10 p-2.5 text-left transition hover:border-neo-600/40 hover:bg-white/[0.04]"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-neo-600/15 text-neo-400">
                    {(() => {
                      const Ico = categoryIcon(c.icon);
                      return <Ico className="h-4 w-4" />;
                    })()}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-white">
                      {c.name}
                    </span>
                    <span className="block text-xs text-steel-500">
                      {count} product{count === 1 ? "" : "s"}
                    </span>
                  </span>
                  <Plus className="h-4 w-4 shrink-0 text-steel-500" />
                </button>
              );
            })
          : (list as Product[]).map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => onPickProduct(p)}
                className="flex w-full items-center gap-3 rounded-xl border border-white/10 p-2.5 text-left transition hover:border-neo-600/40 hover:bg-white/[0.04]"
              >
                <img
                  src={safeImg(p.images[0])}
                  onError={onImgError}
                  alt=""
                  className="h-9 w-9 shrink-0 rounded-lg object-cover"
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-white">{p.name}</span>
                  <span className="flex items-center gap-1.5 text-xs text-steel-500">
                    {p.brand}
                    {p.visible === false && (
                      <span className="inline-flex items-center gap-1 text-amber-300">
                        <EyeOff className="h-3 w-3" /> hidden
                      </span>
                    )}
                  </span>
                </span>
                <Plus className="h-4 w-4 shrink-0 text-steel-500" />
              </button>
            ))}
      </div>
    </Modal>
  );
}

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
  homeCategoryProducts,
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
  // Filter for the pinned list itself. With 40+ products the list of things
  // already on the home page gets long enough to need narrowing too.
  const [q, setQ] = useState("");
  const [filterCat, setFilterCat] = useState("all");


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

  /**
   * Chips for the pinned list, built from what is actually pinned — so they
   * appear and disappear on their own as categories/products are added.
   */
  const entryChips = useMemo(() => {
    const counts = new Map<string, number>();
    for (const e of entries) {
      const id = e.kind === "product" ? e.product.categoryId : e.category.id;
      counts.set(id, (counts.get(id) ?? 0) + 1);
    }
    return categories
      .filter((c) => (counts.get(c.id) ?? 0) > 0)
      .map((c) => ({ id: c.id, name: c.name, count: counts.get(c.id)! }));
  }, [entries, categories]);

  const activeFilter = entryChips.some((c) => c.id === filterCat) ? filterCat : "all";

  /**
   * Index of the first entry that does NOT make the home page.
   *
   * A row is not one product: a pinned category stands for all of its products,
   * so the eighth *product* can fall in the middle of a category row. Walking
   * the entries and accumulating their real product counts is the only way to
   * say honestly where the grid stops.
   */
  const cutIndex = useMemo(() => {
    let used = 0;
    for (let i = 0; i < entries.length; i++) {
      if (used >= GRID_LIMIT) return i;
      const e = entries[i];
      used += e.kind === "product" ? 1 : e.count;
    }
    return entries.length;
  }, [entries]);

  /**
   * The rows to draw. Filtering only hides rows — the position number and the
   * arrows still act on the FULL list, so reordering inside a filtered view
   * can't silently scramble the entries that are hidden.
   */
  const shownEntries = useMemo(() => {
    const needle = q.toLowerCase();
    return entries
      .map((e, index) => ({ e, index }))
      .filter(({ e }) => {
        const cid = e.kind === "product" ? e.product.categoryId : e.category.id;
        if (activeFilter !== "all" && cid !== activeFilter) return false;
        if (!needle) return true;
        const name = e.kind === "product" ? e.product.name : e.category.name;
        const extra = e.kind === "product" ? e.product.brand : "";
        return (
          name.toLowerCase().includes(needle) || extra.toLowerCase().includes(needle)
        );
      });
  }, [entries, q, activeFilter]);

  const filtering = q.trim() !== "" || activeFilter !== "all";

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
        hint={`The card grid under “Precision tools for every process”. The All tab shows the first ${GRID_LIMIT}, and each category tab shows up to ${GRID_LIMIT} of its own products.`}
        action={
          <div className="flex flex-wrap gap-2">
            <AddButton icon={Package} label="Add product" onClick={() => setPicker("product")} />
            <AddButton icon={Tags} label="Add category" onClick={() => setPicker("category")} />
          </div>
        }
      >
        {/* Filter the pinned list. Chips are derived from what is pinned, so
            adding a category or product surfaces one automatically. */}
        {entries.length > 4 && (
          <div className="mb-4 space-y-2.5">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-steel-500" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search what's on the home page…"
                className="admin-input pl-10"
              />
            </div>
            {entryChips.length > 1 && (
              <div className="flex flex-wrap gap-1.5">
                <FilterChip
                  label="All"
                  count={entries.length}
                  active={activeFilter === "all"}
                  onClick={() => setFilterCat("all")}
                />
                {entryChips.map((c) => (
                  <FilterChip
                    key={c.id}
                    label={c.name}
                    count={c.count}
                    active={activeFilter === c.id}
                    onClick={() => setFilterCat(c.id)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {entries.length === 0 ? (
          <Empty text="Nothing pinned yet — the grid is filling itself from the catalogue. Add a product or a whole category to take control of it." />
        ) : shownEntries.length === 0 ? (
          <Empty text="Nothing on the home page matches that filter." />
        ) : (
          <ol className="space-y-2">
            {shownEntries.map(({ e, index: i }, n) => {
              // A category row stands for many products, so a simple row index
              // can't say what makes the cut — count the products each entry
              // actually contributes, in order, and find where 8 is reached.
              const beyond = i >= cutIndex;
              const prevBeyond = n > 0 && shownEntries[n - 1].index >= cutIndex;
              return (
              <li
                key={e.id}
                className={cn(
                  "flex items-center gap-3 rounded-xl border p-3",
                  beyond
                    ? "border-white/5 bg-white/[0.01] opacity-50"
                    : "border-white/10 bg-white/[0.02]",
                  // Divider marking exactly where the home page stops.
                  beyond && !prevBeyond && "mt-5 border-t-2 border-t-amber-400/30"
                )}
              >
                <span
                  className="w-6 shrink-0 text-center font-display text-sm font-bold text-steel-500"
                  title={`Position ${i + 1} on the home page`}
                >
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
                        {/* Each tab renders at most GRID_LIMIT, same as All, so
                            say so rather than letting the surplus vanish. */}
                        {e.count > GRID_LIMIT && (
                          <span className="text-steel-500">
                            {" "}· first {GRID_LIMIT} shown on its tab
                          </span>
                        )}
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
                  // Reordering across a filtered view would move a row past
                  // neighbours the admin cannot see, so it is disabled while a
                  // filter is on — the filter is for finding, not arranging.
                  disabled={filtering}
                />
              </li>
              );
            })}
          </ol>
        )}

        {cutIndex < entries.length && !filtering && (
          <p className="mt-3 flex items-center gap-1.5 text-[12px] text-amber-300/80">
            <span className="inline-block h-2 w-4 rounded-sm border-t-2 border-amber-400/50" />
            Everything below the line is beyond the {GRID_LIMIT} the grid shows — still
            saved, just not on the home page until you move it up.
          </p>
        )}

        {filtering && (
          <p className="mt-3 text-[12px] text-steel-500">
            Reordering is paused while a filter is on — clear it to use the arrows, so a
            row is never moved past neighbours you can't see.
          </p>
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

      {/* ── Category tabs ─────────────────────────────────────────────── */}
      <CategoryTabsPanel
        products={products}
        categories={categories}
        upsertProduct={upsertProduct}
      />

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
                    : "border-white/5 bg-white/[0.01] opacity-50",
                  i === SIGNATURE_LIMIT && "mt-5 border-t-2 border-t-amber-400/30"
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

        {signature.length > SIGNATURE_LIMIT && (
          <p className="mt-3 flex items-center gap-1.5 text-[12px] text-amber-300/80">
            <span className="inline-block h-2 w-4 rounded-sm border-t-2 border-amber-400/50" />
            Everything below the line is beyond the {SIGNATURE_LIMIT} this section shows —
            still saved, just not on the home page until you move it up.
          </p>
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
  disabled = false,
}: {
  onUp: () => void;
  onDown: () => void;
  first: boolean;
  last: boolean;
  onRemove: () => void;
  /** Arrows off while a filter hides neighbours (see the call site). */
  disabled?: boolean;
}) {
  return (
    <div className="flex shrink-0 items-center gap-1">
      <button
        type="button"
        onClick={onUp}
        disabled={first || disabled}
        aria-label="Move up"
        className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-steel-400 transition hover:border-white/25 hover:text-white disabled:pointer-events-none disabled:opacity-25"
      >
        <ChevronUp className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={onDown}
        disabled={last || disabled}
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

/** A filter pill with a count, used by the picker and the pinned list. */
function FilterChip({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition",
        active
          ? "border-neo-600/50 bg-neo-600/15 text-white"
          : "border-white/10 text-steel-400 hover:border-white/20 hover:text-white"
      )}
    >
      {label}
      <span className="rounded-full bg-white/[0.08] px-1.5 text-[11px] tabular-nums">
        {count}
      </span>
    </button>
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
  const [cat, setCat] = useState("all");
  const isCategory = mode === "category";

  /** Products not already on this section — the pool worth choosing from. */
  const pool = useMemo(
    () => products.filter((p) => !(mode === "signature" ? p.special : p.featured)),
    [products, mode]
  );

  /**
   * Category chips for the picker, each with the count still available. Built
   * from the live catalogue, so a newly-added category shows up here with no
   * code change — and one with nothing left to add is simply not offered.
   */
  const chips = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of pool) counts.set(p.categoryId, (counts.get(p.categoryId) ?? 0) + 1);
    return categories
      .filter((c) => (counts.get(c.id) ?? 0) > 0)
      .map((c) => ({ id: c.id, name: c.name, count: counts.get(c.id)! }));
  }, [pool, categories]);

  // A chosen category can stop existing (nothing left to add in it, or it was
  // deleted) — fall back to All rather than showing an empty list.
  const activeCat = chips.some((c) => c.id === cat) ? cat : "all";

  const list = useMemo(() => {
    const needle = q.toLowerCase();
    if (isCategory) {
      return categories.filter(
        (c) => !c.showOnHome && c.name.toLowerCase().includes(needle)
      );
    }
    return pool.filter((p) => {
      if (activeCat !== "all" && p.categoryId !== activeCat) return false;
      return (
        p.name.toLowerCase().includes(needle) || p.brand.toLowerCase().includes(needle)
      );
    });
  }, [q, activeCat, isCategory, pool, categories]);

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

      {/* Category filter — with 40+ products a flat searchable list means
          scrolling or knowing the name in advance. Chips come from the live
          catalogue, so a new category appears here on its own; each shows how
          many products it still has left to add. */}
      {!isCategory && chips.length > 1 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          <FilterChip
            label="All"
            count={pool.length}
            active={activeCat === "all"}
            onClick={() => setCat("all")}
          />
          {chips.map((c) => (
            <FilterChip
              key={c.id}
              label={c.name}
              count={c.count}
              active={activeCat === c.id}
              onClick={() => setCat(c.id)}
            />
          ))}
        </div>
      )}

      <div className="mt-3 max-h-[22rem] space-y-1.5 overflow-y-auto">
        {list.length === 0 && (
          <p className="py-8 text-center text-sm text-steel-500">
            {q || activeCat !== "all"
              ? "Nothing matches that filter."
              : "Everything is already on the home page."}
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

/**
 * Arrange the products inside each CATEGORY TAB of the home grid.
 *
 * Kept as its own panel, separate from "Our Catalogue" above: the two answer
 * different questions — that one is "what is pinned to the home page", this one
 * is "what does each tab show". Folding them into a single tab strip was tried
 * and read as more confusing, not less.
 *
 * It writes `categoryOrder`, a per-tab rank, NOT the `homeOrder` the All tab
 * uses. A product can headline its own family without being top-8 across the
 * whole catalogue, and one number could not express both orderings.
 *
 * There is no "remove" here: a tab always fills from its own category, so a
 * product is either in the visible set or below the line — never absent.
 */
function CategoryTabsPanel({
  products,
  categories,
  upsertProduct,
}: {
  products: Product[];
  categories: Category[];
  upsertProduct: (p: Product) => void;
}) {
  const [tab, setTab] = useState<string>("");

  /** Only categories a visitor can actually reach a tab for. */
  const tabs = useMemo(() => {
    const live = products.filter((p) => p.visible !== false);
    return categories
      .filter((c) => live.some((p) => p.categoryId === c.id))
      .map((c) => ({
        id: c.id,
        name: c.name,
        count: live.filter((p) => p.categoryId === c.id).length,
      }));
  }, [products, categories]);

  // A category can vanish (deleted, or its last product hidden) while selected.
  const active = tabs.some((t) => t.id === tab) ? tab : tabs[0]?.id ?? "";

  /** Exactly what this tab renders on the site, in order. */
  const shown = useMemo(
    () => (active ? homeCategoryProducts(products, active, HOME_GRID_LIMIT) : []),
    [products, active]
  );

  /** Everything else in the category — the pool that could be promoted in. */
  const overflow = useMemo(() => {
    if (!active) return [];
    const ids = new Set(shown.map((p) => p.id));
    return products.filter(
      (p) => p.categoryId === active && p.visible !== false && !ids.has(p.id)
    );
  }, [products, active, shown]);

  /** Renumber the visible list 1..n so the admin never types a rank. */
  const commit = (list: Product[]) =>
    list.forEach((p, i) => {
      if (p.categoryOrder !== i + 1) upsertProduct({ ...p, categoryOrder: i + 1 });
    });

  const move = (index: number, dir: -1 | 1) => {
    const to = index + dir;
    if (to < 0 || to >= shown.length) return;
    const next = [...shown];
    [next[index], next[to]] = [next[to], next[index]];
    commit(next);
  };

  /**
   * Swap an overflow product into the tab.
   *
   * Appending it would rank it 9th and the very next render would slice it back
   * out — it has to take the last visible slot, displacing whatever held it.
   * The displaced product keeps a rank just past the cut, so it sits at the top
   * of the overflow rather than falling to the bottom alphabetically.
   */
  const promote = (p: Product) => {
    const next = [...shown.slice(0, HOME_GRID_LIMIT - 1), p];
    commit(next);
    const displaced = shown[HOME_GRID_LIMIT - 1];
    if (displaced && displaced.id !== p.id) {
      upsertProduct({ ...displaced, categoryOrder: HOME_GRID_LIMIT + 1 });
    }
  };

  if (tabs.length === 0) return null;

  return (
    <Panel
      icon={Tags}
      title="Category tabs"
      hint={`What each tab of the catalogue section shows, and in what order. Each tab holds up to ${HOME_GRID_LIMIT} products, arranged separately from the All tab.`}
    >
      <div className="mb-4 flex flex-wrap gap-1.5">
        {tabs.map((t) => (
          <FilterChip
            key={t.id}
            label={t.name}
            count={t.count}
            active={active === t.id}
            onClick={() => setTab(t.id)}
          />
        ))}
      </div>

      <ol className="space-y-2">
        {shown.map((p, i) => (
          <li
            key={p.id}
            className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-3"
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
              <p className="truncate text-xs text-steel-500">{p.brand}</p>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                onClick={() => move(i, -1)}
                disabled={i === 0}
                aria-label="Move up"
                className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-steel-400 transition hover:border-white/25 hover:text-white disabled:pointer-events-none disabled:opacity-25"
              >
                <ChevronUp className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => move(i, 1)}
                disabled={i === shown.length - 1}
                aria-label="Move down"
                className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-steel-400 transition hover:border-white/25 hover:text-white disabled:pointer-events-none disabled:opacity-25"
              >
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          </li>
        ))}
      </ol>

      {overflow.length > 0 && (
        <div className="mt-5 border-t-2 border-amber-400/30 pt-4">
          <p className="mb-3 text-[12px] text-amber-300/80">
            {overflow.length} more in this category, beyond the {HOME_GRID_LIMIT} the tab
            shows. Add one to swap it into the list.
          </p>
          <div className="space-y-2">
            {overflow.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.01] p-3 opacity-60"
              >
                <span className="w-6 shrink-0" />
                <img
                  src={safeImg(p.images[0])}
                  onError={onImgError}
                  alt=""
                  className="h-10 w-10 shrink-0 rounded-lg object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white">{p.name}</p>
                  <p className="truncate text-xs text-steel-500">{p.brand}</p>
                </div>
                <button
                  type="button"
                  onClick={() => promote(p)}
                  className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg border border-white/10 px-3 text-[13px] font-medium text-steel-300 transition hover:border-neo-600/40 hover:text-white"
                >
                  <Plus className="h-3.5 w-3.5" /> Add to tab
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </Panel>
  );
}

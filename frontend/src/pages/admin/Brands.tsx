import { useState, type ReactNode } from "react";
import {
  Pencil,
  Trash2,
  Plus,
  ChevronUp,
  ChevronDown,
  X,
  Layers,
  Image as ImageIcon,
  Info,
  Tag,
  FileText,
} from "lucide-react";
import { useCatalog } from "@/store/useCatalog";
import type { Brand, BrandLine } from "@/data/brands";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { ImageInput } from "@/components/admin/ImageInput";
import {
  AdminToolbar,
  AdminForm,
  IconBtn,
  Field,
  usePagination,
  AdminPagination,
} from "./Categories";
import { slugify, cn } from "@/lib/utils";
import { onImgError } from "@/lib/image";
import { lineImage } from "@/lib/lineImage";
import { BrandLogoPlate } from "@/components/BrandLogoPlate";

const empty: Brand = {
  id: "",
  name: "",
  color: "#4fb6f0",
  category: "",
  blurb: "",
  logo: "",
  lines: [],
  resources: [],
};

const blankLine = (): BrandLine => ({ id: "", name: "", brief: "", models: [] });

/** A titled block inside the brand form, so the long form reads as steps. */
function FormSection({
  icon: Icon,
  title,
  hint,
  action,
  children,
}: {
  icon: typeof Layers;
  title: string;
  hint?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
      <header className="mb-4 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-neo-600/15 text-neo-400">
            <Icon className="h-4 w-4" />
          </span>
          <div>
            <h4 className="font-display text-sm font-semibold text-white">{title}</h4>
            {hint && (
              <p className="mt-0.5 max-w-prose text-[13px] leading-snug text-steel-500">
                {hint}
              </p>
            )}
          </div>
        </div>
        {action}
      </header>
      {children}
    </section>
  );
}

export default function AdminBrands() {
  const { brands, categories, products, upsertBrand, deleteBrand } = useCatalog();
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Brand | null>(null);
  // Text mirrors for the list-shaped fields, same pattern as Industries/Products.
  const [logo, setLogo] = useState<string[]>([]);
  const [resourcesText, setResourcesText] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  // Which product line is expanded. Twelve lines open at once is the thing that
  // made this form unusable, so exactly one is editable at a time.
  const [openLine, setOpenLine] = useState<number | null>(null);

  const filtered = brands.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );
  const { paged, ...pager } = usePagination(filtered, [search]);

  const openEdit = (b: Brand) => {
    setEditing({ ...b, lines: [...(b.lines ?? [])], resources: [...(b.resources ?? [])] });
    setLogo(b.logo ? [b.logo] : []);
    setResourcesText(
      (b.resources ?? []).map((r) => `${r.label} | ${r.href}`).join("\n")
    );
    setOpenLine(null);
  };

  const openNew = () => {
    setEditing({ ...empty, lines: [], resources: [] });
    setLogo([]);
    setResourcesText("");
    setOpenLine(null);
  };

  /* ── product-line editing (nested inside the brand form) ─────────────── */

  // New lines go to the TOP of the list, already expanded. Appending pushed the
  // new row below eleven collapsed ones and off the bottom of the modal, so it
  // looked like nothing had happened. Use the arrows to move it down afterwards.
  const addLine = () => {
    setEditing((b) => (b ? { ...b, lines: [blankLine(), ...b.lines] } : b));
    setOpenLine(0);
    // Being first in the list isn't enough if the modal is scrolled elsewhere —
    // bring the new row into view (after paint) and put the cursor in it.
    requestAnimationFrame(() => {
      const row = document.getElementById("brand-line-row-0");
      row?.scrollIntoView({ block: "center", behavior: "smooth" });
      row?.querySelector("input")?.focus();
    });
  };

  // All of these read the CURRENT lines inside the updater rather than closing
  // over `editing`. An image upload resolves asynchronously, so a patch built
  // from a stale snapshot would silently revert whatever was typed while it was
  // in flight.
  const patchLine = (idx: number, patch: Partial<BrandLine>) =>
    setEditing((b) =>
      b ? { ...b, lines: b.lines.map((l, i) => (i === idx ? { ...l, ...patch } : l)) } : b
    );

  const moveLine = (idx: number, dir: -1 | 1) => {
    setEditing((b) => {
      if (!b) return b;
      const next = [...b.lines];
      const to = idx + dir;
      if (to < 0 || to >= next.length) return b;
      [next[idx], next[to]] = [next[to], next[idx]];
      return { ...b, lines: next };
    });
    // Keep the expanded row expanded after it moves.
    setOpenLine((o) => (o === idx ? idx + dir : o === idx + dir ? idx : o));
  };

  const removeLine = (idx: number) => {
    setEditing((b) => (b ? { ...b, lines: b.lines.filter((_, i) => i !== idx) } : b));
    setOpenLine(null);
  };

  /** Products still pointing at a line id — shown before it can be removed. */
  const productsOnLine = (brandId: string, lineId: string) =>
    lineId
      ? products.filter((p) => p.brandId === brandId && p.line === lineId).length
      : 0;

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    const id = editing.id || slugify(editing.name);
    upsertBrand({
      ...editing,
      id,
      logo: logo[0] ?? editing.logo,
      // A line id is minted once from its name and then frozen: products and
      // the ?line= URL param reference it, so renaming the line must not
      // orphan them.
      lines: editing.lines
        .filter((l) => l.name.trim())
        .map((l) => ({
          ...l,
          id: l.id || slugify(l.name),
          models: (l.models ?? []).filter(Boolean),
        })),
      resources: resourcesText
        .split("\n")
        .map((line) => {
          const [label, ...rest] = line.split("|");
          return { label: label?.trim() ?? "", href: rest.join("|").trim() };
        })
        .filter((r) => r.label && r.href),
    });
    setEditing(null);
  };

  return (
    <div className="space-y-6">
      <AdminToolbar
        title="Brands"
        subtitle="Manage brands and the product lines shown under each of them."
        search={search}
        setSearch={setSearch}
        onAdd={openNew}
        addLabel="Add brand"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.length === 0 && (
          <p className="col-span-full py-12 text-center text-steel-500">
            No brands found.
          </p>
        )}
        {paged.map((b) => {
          const lineCount = (b.lines ?? []).length;
          const productCount = products.filter((p) => p.brandId === b.id).length;
          return (
            <div
              key={b.id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-ink-900"
            >
              <div className="flex items-center gap-3 border-b border-white/10 p-4">
                <BrandLogoPlate brand={b} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-sm font-semibold text-white">
                    {b.name}
                  </p>
                  <p className="truncate text-xs text-steel-500">{b.category}</p>
                </div>
                <span
                  className="h-4 w-4 shrink-0 rounded-full ring-1 ring-white/20"
                  style={{ background: b.color }}
                  title={b.color}
                />
              </div>

              <div className="flex-1 p-4">
                <p className="line-clamp-2 text-[14.5px] leading-relaxed text-steel-400">
                  {b.blurb}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-2.5 py-1 text-[13px] text-steel-300">
                    <Layers className="h-3 w-3" />
                    {lineCount} {lineCount === 1 ? "line" : "lines"}
                  </span>
                  <span className="rounded-full border border-white/10 px-2.5 py-1 text-[13px] text-steel-300">
                    {productCount} {productCount === 1 ? "product" : "products"}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-1 border-t border-white/10 px-3 py-2">
                <IconBtn onClick={() => openEdit(b)} title="Edit brand">
                  <Pencil className="h-4 w-4" />
                </IconBtn>
                <IconBtn onClick={() => setDeleteId(b.id)} title="Delete brand" danger>
                  <Trash2 className="h-4 w-4" />
                </IconBtn>
              </div>
            </div>
          );
        })}
      </div>

      <AdminPagination {...pager} />

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing?.id ? `Edit ${editing.name || "brand"}` : "Add a new brand"}
        maxWidth="max-w-4xl"
      >
        {editing && (
          <AdminForm onSubmit={save} className="space-y-5">
            {/* ── 1. Identity ─────────────────────────────────────────── */}
            <FormSection
              icon={Tag}
              title="Brand details"
              hint="Shown on the homepage brand card, the /products strip and the brand page header."
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Brand name *">
                  <input
                    required
                    value={editing.name}
                    onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                    placeholder="Atlas Copco"
                    className="admin-input"
                  />
                </Field>
                <Field label="Category label">
                  <input
                    value={editing.category}
                    onChange={(e) =>
                      setEditing({ ...editing, category: e.target.value })
                    }
                    placeholder="Assembly & Tightening"
                    className="admin-input"
                  />
                </Field>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field label="Accent colour">
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={editing.color || "#4fb6f0"}
                      onChange={(e) =>
                        setEditing({ ...editing, color: e.target.value })
                      }
                      aria-label="Pick accent colour"
                      className="h-11 w-14 shrink-0 cursor-pointer rounded-xl border border-white/10 bg-transparent p-1"
                    />
                    <input
                      value={editing.color}
                      onChange={(e) =>
                        setEditing({ ...editing, color: e.target.value })
                      }
                      aria-label="Accent colour hex"
                      className="admin-input"
                    />
                  </div>
                </Field>
                <Field label="Web address (generated)">
                  {/* Frozen after creation: it is the /brands/:id segment and
                      every product's brandId. */}
                  <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-2.5">
                    <span className="shrink-0 text-sm text-steel-500">/brands/</span>
                    <span className="truncate text-sm text-steel-300">
                      {editing.id || slugify(editing.name) || "…"}
                    </span>
                  </div>
                </Field>
              </div>

              <div className="mt-4">
                <Field label="Description">
                  <textarea
                    rows={4}
                    value={editing.blurb}
                    onChange={(e) => setEditing({ ...editing, blurb: e.target.value })}
                    placeholder="Two or three sentences about the manufacturer and what they are known for."
                    className="admin-input resize-y leading-relaxed"
                  />
                </Field>
              </div>
            </FormSection>

            {/* ── 2. Logo ─────────────────────────────────────────────── */}
            <FormSection
              icon={ImageIcon}
              title="Brand logo"
              hint="Shown on a white plate, so a transparent or white-background PNG works best. Any shape is fine — it is scaled to fit."
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <div className="shrink-0">
                  <BrandLogoPlate
                    brand={{ ...editing, logo: logo[0] ?? "" }}
                    size="md"
                  />
                  <p className="mt-1.5 text-center text-[12px] uppercase tracking-wider text-steel-600">
                    Preview
                  </p>
                </div>
                <div className="min-w-0 flex-1">
                  <ImageInput value={logo} onChange={setLogo} max={1} />
                </div>
              </div>
            </FormSection>

            {/* ── 3. Product lines ────────────────────────────────────── */}
            <FormSection
              icon={Layers}
              title={`Product lines (${editing.lines.length})`}
              hint="Picture tiles on /products and cards on the brand page. Drag order is top-to-bottom — use the arrows. Click a line to edit it."
              action={
                // Plain button, not IconBtn — IconBtn has no type and would
                // submit the surrounding form.
                <button
                  type="button"
                  onClick={addLine}
                  className="btn-primary shrink-0 text-[14.5px]"
                >
                  <Plus className="h-4 w-4" /> Add line
                </button>
              }
            >
              {editing.lines.length === 0 ? (
                <div className="rounded-xl border border-dashed border-white/15 py-10 text-center">
                  <Layers className="mx-auto h-6 w-6 text-steel-600" />
                  <p className="mt-2 text-[14.5px] text-steel-400">
                    No product lines yet.
                  </p>
                  <p className="mt-1 text-[13px] text-steel-600">
                    e.g. “Electric Assembly Tools”, “Pop Rivet Tools”
                  </p>
                  <button
                    type="button"
                    onClick={addLine}
                    className="btn-ghost mx-auto mt-4 text-[14.5px]"
                  >
                    <Plus className="h-4 w-4" /> Add the first line
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {editing.lines.map((l, idx) => {
                    const inUse = productsOnLine(editing.id, l.id);
                    const isOpen = openLine === idx;
                    return (
                      <div
                        key={idx}
                        id={`brand-line-row-${idx}`}
                        className={cn(
                          "overflow-hidden rounded-xl border bg-ink-900 transition-colors",
                          isOpen ? "border-neo-600/40" : "border-white/10"
                        )}
                      >
                        {/* Row header — always visible */}
                        <div className="flex items-center gap-2 p-2.5">
                          <button
                            type="button"
                            onClick={() => setOpenLine(isOpen ? null : idx)}
                            aria-expanded={isOpen}
                            className="flex min-w-0 flex-1 items-center gap-3 rounded-lg px-1.5 py-1 text-left transition hover:bg-white/[0.04]"
                          >
                            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-white/[0.06] text-[13px] font-semibold text-steel-300">
                              {idx + 1}
                            </span>
                            <span className="h-9 w-14 shrink-0 overflow-hidden rounded-md border border-white/10 bg-ink-950">
                              <img
                                src={lineImage(l, products, editing.id)}
                                onError={onImgError}
                                alt=""
                                className="h-full w-full object-cover"
                              />
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-[14.5px] font-medium text-white">
                                {l.name || (
                                  <span className="text-steel-500">Untitled line</span>
                                )}
                              </span>
                              <span className="block truncate text-[13px] text-steel-500">
                                {inUse} product{inUse === 1 ? "" : "s"}
                                {l.brief ? ` · ${l.brief}` : " · no brief yet"}
                              </span>
                            </span>
                            <ChevronDown
                              className={cn(
                                "h-4 w-4 shrink-0 text-steel-400 transition-transform duration-300",
                                isOpen && "rotate-180"
                              )}
                            />
                          </button>

                          <div className="flex shrink-0 items-center gap-1">
                            <button
                              type="button"
                              onClick={() => moveLine(idx, -1)}
                              disabled={idx === 0}
                              title="Move up"
                              aria-label={`Move ${l.name || "line"} up`}
                              className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 text-steel-400 transition hover:border-white/25 hover:text-white disabled:pointer-events-none disabled:opacity-30"
                            >
                              <ChevronUp className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => moveLine(idx, 1)}
                              disabled={idx === editing.lines.length - 1}
                              title="Move down"
                              aria-label={`Move ${l.name || "line"} down`}
                              className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 text-steel-400 transition hover:border-white/25 hover:text-white disabled:pointer-events-none disabled:opacity-30"
                            >
                              <ChevronDown className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                // A tooltip is not a safeguard: removing a line
                                // products still point at orphans them.
                                if (
                                  inUse &&
                                  !window.confirm(
                                    `${inUse} product${inUse === 1 ? "" : "s"} still use "${l.name}".\n\n` +
                                      "Removing the line leaves them without one until you reassign them. Remove it anyway?"
                                  )
                                ) {
                                  return;
                                }
                                removeLine(idx);
                              }}
                              title={
                                inUse
                                  ? `${inUse} product(s) still use this line`
                                  : "Remove line"
                              }
                              aria-label={`Remove ${l.name || "line"}`}
                              className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 text-steel-400 transition hover:border-neo-600/40 hover:text-neo-400"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        {/* Row body — only the open line */}
                        {isOpen && (
                          <div className="space-y-4 border-t border-white/10 p-4">
                            <Field label="Line name *">
                              <input
                                value={l.name}
                                onChange={(e) =>
                                  patchLine(idx, { name: e.target.value })
                                }
                                placeholder="Electric Assembly Tools"
                                aria-label={`Product line ${idx + 1} name`}
                                className="admin-input"
                              />
                            </Field>

                            <Field label="Short brief">
                              <textarea
                                rows={3}
                                value={l.brief}
                                onChange={(e) =>
                                  patchLine(idx, { brief: e.target.value })
                                }
                                placeholder="One or two sentences shown under the line name on the site."
                                className="admin-input resize-y leading-relaxed"
                              />
                            </Field>

                            <div className="grid gap-4 sm:grid-cols-2">
                              <Field label="Models / series (one per line)">
                                <textarea
                                  rows={5}
                                  value={(l.models ?? []).join("\n")}
                                  onChange={(e) =>
                                    patchLine(idx, {
                                      models: e.target.value.split("\n"),
                                    })
                                  }
                                  placeholder={"Tensor STR\nTensor ST\nTensor ES"}
                                  className="admin-input resize-y leading-relaxed"
                                />
                              </Field>

                              <div className="space-y-4">
                                <Field label="Catalogue family">
                                  <select
                                    value={l.categoryId ?? ""}
                                    onChange={(e) =>
                                      patchLine(idx, {
                                        categoryId: e.target.value || undefined,
                                      })
                                    }
                                    className="admin-input"
                                  >
                                    <option value="">— none —</option>
                                    {categories.map((c) => (
                                      <option key={c.id} value={c.id}>
                                        {c.name}
                                      </option>
                                    ))}
                                  </select>
                                </Field>
                                <Field label="Web address (generated)">
                                  <div className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-2.5 text-sm text-steel-300">
                                    ?line={l.id || slugify(l.name) || "…"}
                                  </div>
                                </Field>
                              </div>
                            </div>

                            <Field label="Line image">
                              <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                                <span className="h-20 w-32 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-ink-950">
                                  <img
                                    src={lineImage(l, products, editing.id)}
                                    onError={onImgError}
                                    alt=""
                                    className="h-full w-full object-cover"
                                  />
                                </span>
                                <div className="min-w-0 flex-1">
                                  {/* paste={false}: the Ctrl+V listener is
                                      global, so only the brand-logo input owns
                                      it — otherwise one paste would land on
                                      every line at once. */}
                                  <ImageInput
                                    value={l.image ? [l.image] : []}
                                    onChange={(imgs) =>
                                      patchLine(idx, { image: imgs[0] ?? undefined })
                                    }
                                    max={1}
                                    paste={false}
                                  />
                                  <p className="mt-1.5 text-[13px] text-steel-500">
                                    {l.image
                                      ? "Custom image for this line."
                                      : "Optional — otherwise a product from this line, or the catalogue family photo, is used."}
                                  </p>
                                </div>
                              </div>
                            </Field>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </FormSection>

            {/* ── 4. Literature ───────────────────────────────────────── */}
            <FormSection
              icon={FileText}
              title="Manufacturer literature"
              hint="Optional download links shown on the brand page. One per line, as: Label | https://…"
            >
              <textarea
                rows={3}
                value={resourcesText}
                onChange={(e) => setResourcesText(e.target.value)}
                placeholder="Installation Guide (PDF) | https://example.com/guide.pdf"
                aria-label="Manufacturer literature links"
                className="admin-input resize-y leading-relaxed"
              />
            </FormSection>

            {/* Sticky actions — the form is long, so Save must always be one
                click away rather than a scroll to the bottom. */}
            <div className="sticky bottom-0 -mx-6 -mb-6 flex items-center gap-3 border-t border-white/10 bg-ink-900/95 px-6 py-4 backdrop-blur-xl">
              <p className="mr-auto hidden items-center gap-2 text-[13px] text-steel-500 sm:flex">
                <Info className="h-3.5 w-3.5" />
                Lines without a name are discarded on save.
              </p>
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="btn-ghost justify-center text-[14.5px]"
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary justify-center text-[14.5px]">
                {editing.id ? "Save changes" : "Create brand"}
              </button>
            </div>
          </AdminForm>
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && deleteBrand(deleteId)}
        title="Delete brand?"
        message="The brand, its product lines and its page will be removed from the website. Products assigned to it keep their brand id until you reassign them."
      />
    </div>
  );
}

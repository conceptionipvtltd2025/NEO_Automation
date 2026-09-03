import { useState } from "react";
import { Pencil, Trash2, Eye, EyeOff, FileText, LayoutGrid, Sparkles } from "lucide-react";
import { useCatalog } from "@/store/useCatalog";
import type { Product, ProductDocument } from "@/data/products";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { ImageInput } from "@/components/admin/ImageInput";
import { PdfInput } from "@/components/admin/PdfInput";
import { SpecsInput } from "@/components/admin/SpecsInput";
import {
  AdminToolbar,
  AdminForm,
  IconBtn,
  Field,
  usePagination,
  AdminPagination,
} from "./Categories";
import { slugify, cn } from "@/lib/utils";
import { safeImg, onImgError } from "@/lib/image";

// Mirrors LIMIT in components/home/SpecialProducts.tsx — shown in the form so
// an admin knows how many of their flagged products actually make the page.
const SPECIAL_LIMIT = 4;

// Brand/category defaults are filled from the live lists in openNew() — a
// hard-coded id here would break as soon as an admin renames or removes one.
const blank: Product = {
  id: "",
  slug: "",
  name: "",
  brandId: "",
  brand: "",
  categoryId: "",
  industries: [],
  //price: 0,
  rating: 4.5,
  shortDesc: "",
  description: "",
  features: [],
  specs: [],
  images: ["https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1000&q=80"],
  documents: [],
  visible: true,
};

export default function AdminProducts() {
  const { products, categories, industries, brands, upsertProduct, deleteProduct, toggleProduct } = useCatalog();
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Product | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  // image list + text mirrors for the other list fields
  const [images, setImages] = useState<string[]>([]);
  const [documents, setDocuments] = useState<ProductDocument[]>([]);
  const [featuresText, setFeaturesText] = useState("");
  // Specs are edited as real label/value rows (see components/admin/SpecsInput).
  // The old `Label: Value` textarea silently discarded any line it couldn't
  // split, so a filled-in form could save an empty spec table.
  const [specs, setSpecs] = useState<Product["specs"]>([]);

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase())
  );
  const { paged, ...pager } = usePagination(filtered, [search]);

  const openEdit = (p: Product) => {
    setEditing(p);
    setImages(p.images);
    setDocuments(p.documents ?? []);
    setFeaturesText(p.features.join("\n"));
    setSpecs(p.specs.map((s) => ({ ...s })));
  };

  const openNew = () => {
    // Default to the first brand/category that actually exists right now.
    const firstBrand = brands[0];
    setEditing({
      ...blank,
      brandId: firstBrand?.id ?? "",
      brand: firstBrand?.name ?? "",
      categoryId: categories[0]?.id ?? "",
    });
    setImages([...blank.images]);
    setDocuments([]);
    setFeaturesText("");
    // Start with one empty row so the section reads as fillable, not empty.
    setSpecs([{ label: "", value: "" }]);
  };

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    const id = editing.id || `prod-${slugify(editing.name)}`;
    const brandObj = brands.find((b) => b.id === editing.brandId);
    const product: Product = {
      ...editing,
      id,
      slug: editing.slug || slugify(editing.name),
      brand: brandObj?.name ?? editing.brand,
      images: images.filter(Boolean),
      // Drop half-finished rows: a document is only useful once it has a file.
      documents: documents
        .filter((d) => d.url.trim())
        .map((d) => ({ ...d, label: d.label.trim() || "Datasheet" })),
      features: featuresText.split("\n").map((s) => s.trim()).filter(Boolean),
      // Only complete rows are stored — and the editor has already flagged any
      // half-filled row in place, so nothing disappears without warning.
      specs: specs
        .map((s) => ({ label: s.label.trim(), value: s.value.trim() }))
        .filter((s) => s.label && s.value),
    };
    upsertProduct(product);
    setEditing(null);
  };

  const toggleIndustry = (id: string) => {
    if (!editing) return;
    const has = editing.industries.includes(id);
    setEditing({
      ...editing,
      industries: has
        ? editing.industries.filter((i) => i !== id)
        : [...editing.industries, id],
    });
  };

  return (
    <div className="space-y-6">
      <AdminToolbar
        title="Products"
        subtitle="Add, edit and manage your full product catalogue."
        search={search}
        setSearch={setSearch}
        onAdd={openNew}
        addLabel="Add product"
      />

      {/* Desktop table. Below lg it is replaced by the card list underneath:
          the 5-column layout needs 720px, and side-scrolling a table hid the
          Status and Actions columns entirely on a phone. */}
      <div className="hidden overflow-x-auto rounded-2xl border border-white/10 bg-ink-900 lg:block">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wider text-steel-500">
              <th className="px-5 py-4 font-medium">Product</th>
              <th className="px-5 py-4 font-medium">Brand</th>
              <th className="px-5 py-4 font-medium">Home page</th>
              <th className="px-5 py-4 font-medium">Status</th>
              <th className="px-5 py-4 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((p) => (
              <tr key={p.id} className="border-b border-white/[0.06] last:border-0 hover:bg-white/[0.02]">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <img src={safeImg(p.images[0])} onError={onImgError} alt="" className="h-11 w-11 rounded-lg object-cover" />
                    <div>
                      <p className="font-medium text-white">{p.name}</p>
                      {/* At-a-glance marker for which products carry literature. */}
                      {(p.documents?.length ?? 0) > 0 && (
                        <p className="flex items-center gap-1 text-xs text-neo-400">
                          <FileText className="h-3 w-3" /> {p.documents!.length} PDF
                        </p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-steel-300">{p.brand}</td>
                {/* Which landing-page sections this product is pinned to, and
                    its manual position — the flags are otherwise invisible
                    until you open the editor. */}
                <td className="px-5 py-4">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {p.featured && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-neo-600/30 bg-neo-600/10 px-2 py-0.5 text-[11px] font-medium text-neo-300" title="Shown in the Our Catalogue grid">
                        <LayoutGrid className="h-3 w-3" /> Catalogue
                      </span>
                    )}
                    {p.special && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/30 bg-amber-400/10 px-2 py-0.5 text-[11px] font-medium text-amber-300" title="Shown in Signature Engineering">
                        <Sparkles className="h-3 w-3" /> Signature
                      </span>
                    )}
                    {!p.featured && !p.special && (
                      <span className="text-xs text-steel-500">—</span>
                    )}
                    {typeof p.homeOrder === "number" && (
                      <span className="text-[11px] text-steel-500" title="Display order">
                        #{p.homeOrder}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-5 py-4">
                  <button
                    onClick={() => toggleProduct(p.id)}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition",
                      p.visible !== false
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                        : "border-white/10 bg-white/[0.04] text-steel-400"
                    )}
                  >
                    {p.visible !== false ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                    {p.visible !== false ? "Visible" : "Hidden"}
                  </button>
                </td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    <IconBtn onClick={() => openEdit(p)} title="Edit">
                      <Pencil className="h-4 w-4" />
                    </IconBtn>
                    <IconBtn onClick={() => setDeleteId(p.id)} title="Delete" danger>
                      <Trash2 className="h-4 w-4" />
                    </IconBtn>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-steel-500">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile / tablet card list — every action from the table stays reachable. */}
      <div className="space-y-3 lg:hidden">
        {paged.map((p) => (
          <div key={p.id} className="rounded-2xl border border-white/10 bg-ink-900 p-3.5">
            <div className="flex items-start gap-3">
              <img src={safeImg(p.images[0])} onError={onImgError} alt="" className="h-14 w-14 shrink-0 rounded-lg object-cover" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium leading-snug text-white">{p.name}</p>
                <p className="mt-0.5 text-xs text-steel-400">{p.brand}</p>
                {(p.documents?.length ?? 0) > 0 && (
                  <p className="mt-1 flex items-center gap-1 text-xs text-neo-400">
                    <FileText className="h-3 w-3" /> {p.documents!.length} PDF
                  </p>
                )}
              </div>
              <div className="flex shrink-0 gap-1.5">
                <IconBtn onClick={() => openEdit(p)} title="Edit">
                  <Pencil className="h-4 w-4" />
                </IconBtn>
                <IconBtn onClick={() => setDeleteId(p.id)} title="Delete" danger>
                  <Trash2 className="h-4 w-4" />
                </IconBtn>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-white/[0.06] pt-3">
              <button
                onClick={() => toggleProduct(p.id)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium transition",
                  p.visible !== false
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                    : "border-white/10 bg-white/[0.04] text-steel-400"
                )}
              >
                {p.visible !== false ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                {p.visible !== false ? "Visible" : "Hidden"}
              </button>
              {p.featured && (
                <span className="inline-flex items-center gap-1 rounded-full border border-neo-600/30 bg-neo-600/10 px-2 py-0.5 text-[11px] font-medium text-neo-300">
                  <LayoutGrid className="h-3 w-3" /> Catalogue
                </span>
              )}
              {p.special && (
                <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/30 bg-amber-400/10 px-2 py-0.5 text-[11px] font-medium text-amber-300">
                  <Sparkles className="h-3 w-3" /> Signature
                </span>
              )}
              {typeof p.homeOrder === "number" && (
                <span className="text-[11px] text-steel-500">#{p.homeOrder}</span>
              )}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="rounded-2xl border border-white/10 bg-ink-900 px-5 py-12 text-center text-steel-500">
            No products found.
          </p>
        )}
      </div>

      <AdminPagination {...pager} />

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing?.id ? "Edit product" : "Add product"}
        maxWidth="max-w-2xl"
      >
        {editing && (
          <AdminForm onSubmit={save} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Product name">
                <input required value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className="admin-input" />
              </Field>
              <Field label="Badge (optional)">
                <input value={editing.badge ?? ""} onChange={(e) => setEditing({ ...editing, badge: e.target.value })} className="admin-input" placeholder="Best Seller" />
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Brand">
                {/* Changing brand clears the line — lines belong to one brand. */}
                <select value={editing.brandId} onChange={(e) => setEditing({ ...editing, brandId: e.target.value, line: undefined })} className="admin-input">
                  {brands.map((b) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </Field>
              <Field label="Category">
                <select value={editing.categoryId} onChange={(e) => setEditing({ ...editing, categoryId: e.target.value })} className="admin-input">
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </Field>
            </div>

            <Field label="Product line (within the brand)">
              <select value={editing.line ?? ""} onChange={(e) => setEditing({ ...editing, line: e.target.value || undefined })} className="admin-input">
                <option value="">— none —</option>
                {(brands.find((b) => b.id === editing.brandId)?.lines ?? []).map((l) => (
                  <option key={l.id} value={l.id}>{l.name}</option>
                ))}
              </select>
            </Field>

            <Field label="Industries">
              <div className="flex flex-wrap gap-2">
                {industries.map((ind) => {
                  const active = editing.industries.includes(ind.id);
                  return (
                    <button
                      type="button"
                      key={ind.id}
                      onClick={() => toggleIndustry(ind.id)}
                      className={cn(
                        "rounded-full border px-3 py-1.5 text-xs font-medium transition",
                        active
                          ? "border-neo-600/50 bg-neo-600/15 text-white"
                          : "border-white/10 text-steel-400 hover:text-white"
                      )}
                    >
                      {ind.name}
                    </button>
                  );
                })}
              </div>
            </Field>

            <Field label="Short description">
              <input value={editing.shortDesc} onChange={(e) => setEditing({ ...editing, shortDesc: e.target.value })} className="admin-input" />
            </Field>
            <Field label="Full description">
              <textarea rows={3} value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className="admin-input resize-none" />
            </Field>

            <Field label="Product images">
              <ImageInput value={images} onChange={setImages} />
            </Field>

            <Field label="Product documents (PDF) — datasheets, manuals, certificates">
              <PdfInput value={documents} onChange={setDocuments} />
            </Field>

            <Field label="Features (one per line)">
              <textarea rows={4} value={featuresText} onChange={(e) => setFeaturesText(e.target.value)} className="admin-input resize-none" placeholder={"Shut-off clutch for repeatable torque\nCool-running at high duty cycles"} />
            </Field>

            <Field label="Specifications">
              <SpecsInput value={specs} onChange={setSpecs} />
            </Field>

            <div className="flex flex-wrap items-center gap-4 rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <ToggleChip label="Visible" checked={editing.visible !== false} onChange={(v) => setEditing({ ...editing, visible: v })} />
              <span className="text-xs text-steel-400">
                Hidden products disappear from the whole site, home page included.
              </span>
            </div>

            {/* Home page placement — these two flags decide which products the
                landing page shows, so they get their own labelled block rather
                than sitting anonymously beside "Visible". */}
            <div className="space-y-4 rounded-xl border border-neo-600/25 bg-neo-600/[0.06] p-4">
              <div>
                <p className="text-sm font-medium text-white">Home page placement</p>
                <p className="mt-0.5 text-xs text-steel-400">
                  Choose where this product appears on the landing page. Hidden products never
                  show, whatever is ticked here.
                </p>
              </div>

              <PlacementRow
                icon={LayoutGrid}
                title="Our Catalogue grid"
                hint="The 8-card grid under “Precision tools for every process”."
                checked={!!editing.featured}
                onChange={(v) => setEditing({ ...editing, featured: v })}
              />
              <PlacementRow
                icon={Sparkles}
                title="Signature Engineering"
                hint={`The flagship list beside the 3D showpiece — top ${SPECIAL_LIMIT} shown.`}
                checked={!!editing.special}
                onChange={(v) => setEditing({ ...editing, special: v })}
              />

              <div className="flex flex-wrap items-center gap-3 border-t border-white/10 pt-4">
                <span className="text-sm text-white">Display order</span>
                <input
                  type="number"
                  min="1"
                  step="1"
                  placeholder="—"
                  value={editing.homeOrder ?? ""}
                  onChange={(e) => {
                    const n = Number(e.target.value);
                    setEditing({
                      ...editing,
                      // Blank (or nonsense) means unranked, which sorts last —
                      // not position zero, which would jump it to the front.
                      homeOrder: e.target.value === "" || !Number.isFinite(n) ? undefined : n,
                    });
                  }}
                  className="w-20 rounded-lg border border-white/10 bg-white/[0.03] px-2 py-1.5 text-sm text-white outline-none"
                />
                <span className="text-xs text-steel-400">
                  Lower numbers come first. Leave blank to sort after the numbered ones.
                </span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setEditing(null)} className="btn-ghost flex-1 justify-center text-[14.5px]">Cancel</button>
              <button type="submit" className="btn-primary flex-1 justify-center text-[14.5px]">Save product</button>
            </div>
          </AdminForm>
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && deleteProduct(deleteId)}
        title="Delete product?"
        message="This product will be permanently removed from the catalogue."
      />
    </div>
  );
}

/**
 * One home-page destination: an icon, a name, a line of explanation and the
 * switch. A single button so the whole row is one hit target (a <label> around
 * ToggleChip would fire the toggle twice).
 */
function PlacementRow({
  icon: Icon,
  title,
  hint,
  checked,
  onChange,
}: {
  icon: React.ElementType;
  title: string;
  hint: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      aria-pressed={checked}
      className={cn(
        "flex w-full items-start gap-3 rounded-lg border p-3 text-left transition",
        checked
          ? "border-neo-600/45 bg-neo-600/10"
          : "border-white/10 bg-white/[0.02] hover:border-white/20"
      )}
    >
      <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", checked ? "text-neo-400" : "text-steel-500")} />
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium text-white">{title}</span>
        <span className="block text-xs text-steel-400">{hint}</span>
      </span>
      <span
        className={cn(
          "relative mt-0.5 h-5 w-9 shrink-0 rounded-full transition",
          checked ? "bg-neo-600" : "bg-white/10"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all",
            checked ? "left-[18px]" : "left-0.5"
          )}
        />
      </span>
    </button>
  );
}

function ToggleChip({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        "flex items-center gap-2 text-sm transition",
        checked ? "text-white" : "text-steel-400"
      )}
    >
      <span
        className={cn(
          "relative h-5 w-9 rounded-full transition",
          checked ? "bg-neo-600" : "bg-white/10"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all",
            checked ? "left-[18px]" : "left-0.5"
          )}
        />
      </span>
      {label}
    </button>
  );
}

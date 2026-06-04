import { useState } from "react";
import { Pencil, Trash2, Eye, EyeOff, Star } from "lucide-react";
import { useCatalog } from "@/store/useCatalog";
import type { Product } from "@/data/products";
import { brands } from "@/data/brands";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { AdminToolbar, IconBtn, Field } from "./Categories";
import { formatINR, slugify, cn } from "@/lib/utils";

const blank: Product = {
  id: "",
  slug: "",
  name: "",
  brandId: "atlas-copco",
  brand: "Atlas Copco",
  categoryId: "assembly-tools",
  industries: [],
  price: 0,
  rating: 4.5,
  shortDesc: "",
  description: "",
  features: [],
  specs: [],
  images: ["https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1000&q=80"],
  visible: true,
};

export default function AdminProducts() {
  const { products, categories, industries, upsertProduct, deleteProduct, toggleProduct } = useCatalog();
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Product | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  // text mirrors for list fields
  const [imagesText, setImagesText] = useState("");
  const [featuresText, setFeaturesText] = useState("");
  const [specsText, setSpecsText] = useState("");

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase())
  );

  const openEdit = (p: Product) => {
    setEditing(p);
    setImagesText(p.images.join("\n"));
    setFeaturesText(p.features.join("\n"));
    setSpecsText(p.specs.map((s) => `${s.label}: ${s.value}`).join("\n"));
  };

  const openNew = () => {
    setEditing({ ...blank });
    setImagesText(blank.images.join("\n"));
    setFeaturesText("");
    setSpecsText("");
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
      images: imagesText.split("\n").map((s) => s.trim()).filter(Boolean),
      features: featuresText.split("\n").map((s) => s.trim()).filter(Boolean),
      specs: specsText
        .split("\n")
        .map((line) => {
          const [label, ...rest] = line.split(":");
          return { label: label?.trim() ?? "", value: rest.join(":").trim() };
        })
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

      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-ink-900">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wider text-steel-500">
              <th className="px-5 py-4 font-medium">Product</th>
              <th className="px-5 py-4 font-medium">Brand</th>
              <th className="px-5 py-4 font-medium">Price</th>
              <th className="px-5 py-4 font-medium">Status</th>
              <th className="px-5 py-4 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-b border-white/[0.06] last:border-0 hover:bg-white/[0.02]">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <img src={p.images[0]} alt="" className="h-11 w-11 rounded-lg object-cover" />
                    <div>
                      <p className="font-medium text-white">{p.name}</p>
                      <p className="flex items-center gap-1 text-xs text-steel-500">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" /> {p.rating}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-steel-300">{p.brand}</td>
                <td className="px-5 py-4 font-medium text-white">{formatINR(p.price)}</td>
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

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing?.id ? "Edit product" : "Add product"}
        maxWidth="max-w-2xl"
      >
        {editing && (
          <form onSubmit={save} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Product name">
                <input required value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className="admin-input" />
              </Field>
              <Field label="Badge (optional)">
                <input value={editing.badge ?? ""} onChange={(e) => setEditing({ ...editing, badge: e.target.value })} className="admin-input" placeholder="Best Seller" />
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Brand">
                <select value={editing.brandId} onChange={(e) => setEditing({ ...editing, brandId: e.target.value })} className="admin-input">
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
              <Field label="Price (INR)">
                <input type="number" value={editing.price} onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })} className="admin-input" />
              </Field>
            </div>

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

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Image URLs (one per line)">
                <textarea rows={3} value={imagesText} onChange={(e) => setImagesText(e.target.value)} className="admin-input resize-none" />
              </Field>
              <Field label="Features (one per line)">
                <textarea rows={3} value={featuresText} onChange={(e) => setFeaturesText(e.target.value)} className="admin-input resize-none" />
              </Field>
            </div>

            <Field label="Specs (one per line — Label: Value)">
              <textarea rows={3} value={specsText} onChange={(e) => setSpecsText(e.target.value)} className="admin-input resize-none" placeholder={"Torque Range: 5 – 50 Nm\nWeight: 1.1 kg"} />
            </Field>

            <div className="flex flex-wrap items-center gap-4 rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <ToggleChip label="Visible" checked={editing.visible !== false} onChange={(v) => setEditing({ ...editing, visible: v })} />
              <ToggleChip label="Featured" checked={!!editing.featured} onChange={(v) => setEditing({ ...editing, featured: v })} />
              <ToggleChip label="Special / Flagship" checked={!!editing.special} onChange={(v) => setEditing({ ...editing, special: v })} />
              <div className="ml-auto flex items-center gap-2">
                <span className="text-xs text-steel-400">Rating</span>
                <input type="number" step="0.1" min="0" max="5" value={editing.rating} onChange={(e) => setEditing({ ...editing, rating: Number(e.target.value) })} className="w-16 rounded-lg border border-white/10 bg-white/[0.03] px-2 py-1.5 text-sm text-white outline-none" />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setEditing(null)} className="btn-ghost flex-1 justify-center text-[13px]">Cancel</button>
              <button type="submit" className="btn-primary flex-1 justify-center text-[13px]">Save product</button>
            </div>
          </form>
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

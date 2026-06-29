import { useState } from "react";
import { Plus, Pencil, Trash2, Search, Tags } from "lucide-react";
import { useCatalog } from "@/store/useCatalog";
import type { Category } from "@/data/categories";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { slugify } from "@/lib/utils";

const empty: Category = { id: "", name: "", description: "", icon: "Tags" };

export default function AdminCategories() {
  const { categories, upsertCategory, deleteCategory } = useCatalog();
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Category | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    const id = editing.id || slugify(editing.name);
    upsertCategory({ ...editing, id });
    setEditing(null);
  };

  return (
    <div className="space-y-6">
      <AdminToolbar
        title="Categories"
        subtitle="Organise your product catalogue."
        search={search}
        setSearch={setSearch}
        onAdd={() => setEditing({ ...empty })}
        addLabel="Add category"
      />

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-ink-900">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wider text-steel-500">
              <th className="px-5 py-4 font-medium">Name</th>
              <th className="px-5 py-4 font-medium">Description</th>
              <th className="px-5 py-4 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="border-b border-white/[0.06] last:border-0 hover:bg-white/[0.02]">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-neo-600/15 text-neo-400">
                      <Tags className="h-4 w-4" />
                    </span>
                    <span className="font-medium text-white">{c.name}</span>
                  </div>
                </td>
                <td className="max-w-md px-5 py-4 text-steel-400">{c.description}</td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    <IconBtn onClick={() => setEditing(c)} title="Edit">
                      <Pencil className="h-4 w-4" />
                    </IconBtn>
                    <IconBtn onClick={() => setDeleteId(c.id)} title="Delete" danger>
                      <Trash2 className="h-4 w-4" />
                    </IconBtn>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={3} className="px-5 py-12 text-center text-steel-500">
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing?.id ? "Edit category" : "Add category"}
      >
        {editing && (
          <form onSubmit={save} className="space-y-4">
            <Field label="Name">
              <input
                required
                value={editing.name}
                onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                className="admin-input"
                placeholder="e.g. Assembly & Tightening"
              />
            </Field>
            <Field label="Description">
              <textarea
                rows={3}
                value={editing.description}
                onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                className="admin-input resize-none"
                placeholder="Short description"
              />
            </Field>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setEditing(null)} className="btn-ghost flex-1 justify-center text-[13px]">
                Cancel
              </button>
              <button type="submit" className="btn-primary flex-1 justify-center text-[13px]">
                Save category
              </button>
            </div>
          </form>
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && deleteCategory(deleteId)}
        title="Delete category?"
        message="Products in this category will keep their reference. This cannot be undone."
      />
    </div>
  );
}

/* ---- shared admin bits (exported for reuse) ---- */

export function AdminToolbar({
  title,
  subtitle,
  search,
  setSearch,
  onAdd,
  addLabel,
  children,
}: {
  title: string;
  subtitle: string;
  search: string;
  setSearch: (v: string) => void;
  onAdd?: () => void;
  addLabel?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">{title}</h1>
        <p className="mt-1 text-sm text-steel-400">{subtitle}</p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-steel-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search…"
            className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-2.5 pl-10 pr-4 text-sm text-white outline-none transition focus:border-neo-600/50 sm:w-56"
          />
        </div>
        {children}
        {onAdd && (
          <button onClick={onAdd} className="btn-primary text-[13px]">
            <Plus className="h-4 w-4" /> {addLabel}
          </button>
        )}
      </div>
    </div>
  );
}

export function IconBtn({
  children,
  onClick,
  title,
  danger,
}: {
  children: React.ReactNode;
  onClick: () => void;
  title: string;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-steel-300 transition ${
        danger ? "hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-300" : "hover:border-white/20 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-steel-400">
        {label}
      </label>
      {children}
    </div>
  );
}

import { useState } from "react";
import { Pencil, Trash2, Factory, Eye, EyeOff } from "lucide-react";
import { useCatalog } from "@/store/useCatalog";
import type { Industry } from "@/data/industries";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { ImageInput } from "@/components/admin/ImageInput";
import { AdminToolbar, IconBtn, Field, usePagination, AdminPagination } from "./Categories";
import { slugify, cn } from "@/lib/utils";

const empty: Industry = {
  id: "",
  name: "",
  short: "",
  tagline: "",
  description: "",
  image: "https://images.unsplash.com/photo-1565514020179-026b92b84bb6?auto=format&fit=crop&w=1200&q=80",
  icon: "Factory",
  accent: "#ed1c24",
  capabilities: [],
  stat: { value: "", label: "" },
};

export default function AdminIndustries() {
  const { industries, upsertIndustry, deleteIndustry, toggleIndustry } = useCatalog();
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Industry | null>(null);
  const [capsText, setCapsText] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = industries.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase())
  );
  const { paged, ...pager } = usePagination(filtered, [search]);

  const openEdit = (ind: Industry) => {
    setEditing(ind);
    setCapsText(ind.capabilities.join("\n"));
  };

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    const id = editing.id || slugify(editing.name);
    upsertIndustry({
      ...editing,
      id,
      capabilities: capsText.split("\n").map((s) => s.trim()).filter(Boolean),
    });
    setEditing(null);
  };

  return (
    <div className="space-y-6">
      <AdminToolbar
        title="Industries"
        subtitle="Manage the industry verticals shown on the website."
        search={search}
        setSearch={setSearch}
        onAdd={() => {
          setEditing({ ...empty });
          setCapsText("");
        }}
        addLabel="Add industry"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {paged.map((ind) => (
          <div
            key={ind.id}
            className="group overflow-hidden rounded-2xl border border-white/10 bg-ink-900"
          >
            <div className="relative h-36 overflow-hidden">
              <img
                src={ind.image}
                alt={ind.name}
                className={cn(
                  "h-full w-full object-cover",
                  ind.visible === false && "opacity-40 grayscale"
                )}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-900 to-transparent" />
              <span
                className="absolute left-3 top-3 grid h-9 w-9 place-items-center rounded-lg backdrop-blur"
                style={{ background: `${ind.accent}33`, color: ind.accent }}
              >
                <Factory className="h-4 w-4" />
              </span>
              <span
                className={cn(
                  "absolute right-3 top-3 inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium backdrop-blur",
                  ind.visible === false
                    ? "border-white/10 bg-black/40 text-steel-300"
                    : "border-emerald-500/30 bg-emerald-500/15 text-emerald-300"
                )}
              >
                {ind.visible === false ? "Disabled" : "Enabled"}
              </span>
            </div>
            <div className="p-4">
              <h3 className="font-display text-base font-semibold text-white">{ind.name}</h3>
              <p className="mt-1 line-clamp-2 text-xs text-steel-400">{ind.tagline}</p>
              <div className="mt-3 flex justify-end gap-2">
                <IconBtn
                  onClick={() => toggleIndustry(ind.id)}
                  title={ind.visible === false ? "Enable (show on site)" : "Disable (hide from site)"}
                >
                  {ind.visible === false ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </IconBtn>
                <IconBtn onClick={() => openEdit(ind)} title="Edit">
                  <Pencil className="h-4 w-4" />
                </IconBtn>
                <IconBtn onClick={() => setDeleteId(ind.id)} title="Delete" danger>
                  <Trash2 className="h-4 w-4" />
                </IconBtn>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="col-span-full py-12 text-center text-steel-500">
            No industries found.
          </p>
        )}
      </div>

      <AdminPagination {...pager} />

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing?.id ? "Edit industry" : "Add industry"}
        maxWidth="max-w-xl"
      >
        {editing && (
          <form onSubmit={save} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Name">
                <input required value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className="admin-input" />
              </Field>
              <Field label="Short label">
                <input value={editing.short} onChange={(e) => setEditing({ ...editing, short: e.target.value })} className="admin-input" />
              </Field>
            </div>
            <Field label="Tagline">
              <input value={editing.tagline} onChange={(e) => setEditing({ ...editing, tagline: e.target.value })} className="admin-input" />
            </Field>
            <Field label="Description">
              <textarea rows={3} value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className="admin-input resize-none" />
            </Field>
            <Field label="Image">
              <ImageInput
                value={editing.image ? [editing.image] : []}
                onChange={(imgs) => setEditing({ ...editing, image: imgs[imgs.length - 1] ?? "" })}
                max={1}
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Accent">
                <input type="color" value={editing.accent} onChange={(e) => setEditing({ ...editing, accent: e.target.value })} className="h-10 w-full cursor-pointer rounded-xl border border-white/10 bg-transparent" />
              </Field>
              <Field label="Stat value">
                <input value={editing.stat.value} onChange={(e) => setEditing({ ...editing, stat: { ...editing.stat, value: e.target.value } })} className="admin-input" placeholder="40%" />
              </Field>
              <Field label="Stat label">
                <input value={editing.stat.label} onChange={(e) => setEditing({ ...editing, stat: { ...editing.stat, label: e.target.value } })} className="admin-input" placeholder="faster cycles" />
              </Field>
            </div>
            <Field label="Capabilities (one per line)">
              <textarea rows={4} value={capsText} onChange={(e) => setCapsText(e.target.value)} className="admin-input resize-none" />
            </Field>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setEditing(null)} className="btn-ghost flex-1 justify-center text-[13px]">Cancel</button>
              <button type="submit" className="btn-primary flex-1 justify-center text-[13px]">Save industry</button>
            </div>
          </form>
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && deleteIndustry(deleteId)}
        title="Delete industry?"
        message="This industry page will be removed from the website."
      />
    </div>
  );
}

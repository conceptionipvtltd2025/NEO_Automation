import { useMemo, useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Trash2,
  Eye,
  Download,
  Package,
  Clock,
} from "lucide-react";
import {
  useInquiries,
  type Inquiry,
  type InquiryStatus,
} from "@/store/useInquiries";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { AdminToolbar, IconBtn } from "./Categories";
import { cn } from "@/lib/utils";

const statuses: InquiryStatus[] = ["new", "read", "responded", "closed"];

const statusStyle: Record<InquiryStatus, string> = {
  new: "bg-neo-600/15 text-neo-300 border-neo-600/30",
  read: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  responded: "bg-volt-500/15 text-volt-400 border-volt-500/30",
  closed: "bg-white/[0.06] text-steel-400 border-white/10",
};

const timeAgo = (ts: number) => {
  const diff = Date.now() - ts;
  const h = Math.floor(diff / 3600000);
  if (h < 1) return "Just now";
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

export default function AdminInquiries() {
  const { inquiries, setStatus, remove } = useInquiries();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<InquiryStatus | "all">("all");
  const [viewing, setViewing] = useState<Inquiry | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return inquiries.filter((i) => {
      const matchSearch =
        i.name.toLowerCase().includes(search.toLowerCase()) ||
        i.email.toLowerCase().includes(search.toLowerCase()) ||
        (i.productName ?? "").toLowerCase().includes(search.toLowerCase());
      const matchFilter = filter === "all" || i.status === filter;
      return matchSearch && matchFilter;
    });
  }, [inquiries, search, filter]);

  const exportCSV = () => {
    const headers = ["Name", "Email", "Phone", "Address", "Product", "Status", "Date", "Message"];
    const rows = filtered.map((i) => [
      i.name,
      i.email,
      i.phone,
      i.address ?? "",
      i.productName ?? "",
      i.status,
      new Date(i.createdAt).toLocaleString(),
      i.message.replace(/\n/g, " "),
    ]);
    const csv = [headers, ...rows]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `neo-inquiries-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const openView = (inq: Inquiry) => {
    setViewing(inq);
    if (inq.status === "new") setStatus(inq.id, "read");
  };

  return (
    <div className="space-y-6">
      <AdminToolbar
        title="Inquiries"
        subtitle="View, respond to and manage customer inquiries."
        search={search}
        setSearch={setSearch}
      >
        <button onClick={exportCSV} className="btn-ghost text-[13px]">
          <Download className="h-4 w-4" /> Export CSV
        </button>
      </AdminToolbar>

      {/* Status filter pills */}
      <div className="flex flex-wrap gap-2">
        {(["all", ...statuses] as const).map((s) => {
          const count =
            s === "all"
              ? inquiries.length
              : inquiries.filter((i) => i.status === s).length;
          return (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={cn(
                "flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium capitalize transition",
                filter === s
                  ? "border-neo-600/50 bg-neo-600/15 text-white"
                  : "border-white/10 text-steel-400 hover:text-white"
              )}
            >
              {s}
              <span className="rounded-full bg-white/[0.08] px-1.5 text-xs">{count}</span>
            </button>
          );
        })}
      </div>

      <div className="space-y-3">
        {filtered.map((inq) => (
          <div
            key={inq.id}
            className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-ink-900 p-4 sm:flex-row sm:items-center"
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-neo-600/15 font-display text-base font-bold text-neo-300">
              {inq.name.charAt(0)}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium text-white">{inq.name}</p>
                <span className="flex items-center gap-1 text-xs text-steel-500">
                  <Clock className="h-3 w-3" /> {timeAgo(inq.createdAt)}
                </span>
              </div>
              <p className="mt-0.5 truncate text-sm text-steel-400">{inq.email}</p>
              {inq.productName && (
                <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-white/[0.05] px-2 py-0.5 text-xs text-steel-300">
                  <Package className="h-3 w-3" /> {inq.productName}
                </span>
              )}
            </div>

            <select
              value={inq.status}
              onChange={(e) => setStatus(inq.id, e.target.value as InquiryStatus)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium capitalize outline-none",
                statusStyle[inq.status]
              )}
            >
              {statuses.map((s) => (
                <option key={s} value={s} className="bg-ink-850 text-white">
                  {s}
                </option>
              ))}
            </select>

            <div className="flex gap-2">
              <IconBtn onClick={() => openView(inq)} title="View">
                <Eye className="h-4 w-4" />
              </IconBtn>
              <a
                href={`mailto:${inq.email}?subject=Re: Your inquiry to Neo Automation`}
                title="Reply"
                className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-steel-300 transition hover:border-white/20 hover:text-white"
              >
                <Mail className="h-4 w-4" />
              </a>
              <IconBtn onClick={() => setDeleteId(inq.id)} title="Delete" danger>
                <Trash2 className="h-4 w-4" />
              </IconBtn>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-ink-900 py-16 text-center text-steel-500">
            No inquiries found.
          </div>
        )}
      </div>

      {/* Detail modal */}
      <Modal
        open={!!viewing}
        onClose={() => setViewing(null)}
        title="Inquiry details"
        maxWidth="max-w-lg"
      >
        {viewing && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-neo-600/15 font-display text-lg font-bold text-neo-300">
                  {viewing.name.charAt(0)}
                </span>
                <div>
                  <p className="font-semibold text-white">{viewing.name}</p>
                  <p className="text-xs text-steel-500">
                    {new Date(viewing.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <span className={cn("rounded-full border px-3 py-1 text-xs font-medium capitalize", statusStyle[viewing.status])}>
                {viewing.status}
              </span>
            </div>

            <div className="grid gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-4 text-sm">
              <a href={`mailto:${viewing.email}`} className="flex items-center gap-3 text-steel-300 hover:text-white">
                <Mail className="h-4 w-4 text-neo-500" /> {viewing.email}
              </a>
              <a href={`tel:${viewing.phone}`} className="flex items-center gap-3 text-steel-300 hover:text-white">
                <Phone className="h-4 w-4 text-neo-500" /> {viewing.phone}
              </a>
              {viewing.address && (
                <p className="flex items-center gap-3 text-steel-300">
                  <MapPin className="h-4 w-4 text-neo-500" /> {viewing.address}
                </p>
              )}
              {viewing.productName && (
                <p className="flex items-center gap-3 text-steel-300">
                  <Package className="h-4 w-4 text-neo-500" /> {viewing.productName}
                </p>
              )}
            </div>

            <div>
              <p className="mb-1.5 text-xs uppercase tracking-wider text-steel-500">Message</p>
              <p className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-sm leading-relaxed text-steel-200">
                {viewing.message}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {statuses.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setStatus(viewing.id, s);
                    setViewing({ ...viewing, status: s });
                  }}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-medium capitalize transition",
                    viewing.status === s
                      ? statusStyle[s]
                      : "border-white/10 text-steel-400 hover:text-white"
                  )}
                >
                  Mark {s}
                </button>
              ))}
              <a
                href={`mailto:${viewing.email}?subject=Re: Your inquiry to Neo Automation`}
                className="btn-primary ml-auto text-[13px]"
              >
                <Mail className="h-4 w-4" /> Reply by email
              </a>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && remove(deleteId)}
        title="Delete inquiry?"
        message="This inquiry will be permanently removed."
      />
    </div>
  );
}

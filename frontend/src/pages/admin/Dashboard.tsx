import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Package,
  Tags,
  Factory,
  Inbox,
  TrendingUp,
  ArrowUpRight,
  Clock,
} from "lucide-react";
import { useCatalog } from "@/store/useCatalog";
import { useInquiries, type InquiryStatus } from "@/store/useInquiries";
import { ADMIN_BASE } from "@/lib/adminPath";
import { cn } from "@/lib/utils";

const statusStyle: Record<InquiryStatus, string> = {
  new: "bg-neo-600/15 text-neo-300 border-neo-600/30",
  read: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  responded: "bg-volt-500/15 text-volt-400 border-volt-500/30",
  closed: "bg-white/[0.06] text-steel-400 border-white/10",
};

export default function Dashboard() {
  const { products, categories, industries } = useCatalog();
  const inquiries = useInquiries((s) => s.inquiries);

  const newCount = inquiries.filter((i) => i.status === "new").length;

  const stats = [
    { label: "Products", value: products.length, icon: Package, to: `${ADMIN_BASE}/products`, color: "text-neo-400 bg-neo-600/15" },
    { label: "Categories", value: categories.length, icon: Tags, to: `${ADMIN_BASE}/categories`, color: "text-volt-400 bg-volt-500/15" },
    { label: "Industries", value: industries.length, icon: Factory, to: `${ADMIN_BASE}/industries`, color: "text-amber-400 bg-amber-500/15" },
    { label: "Inquiries", value: inquiries.length, icon: Inbox, to: `${ADMIN_BASE}/inquiries`, color: "text-emerald-400 bg-emerald-500/15", badge: newCount },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-steel-400">
          Welcome back — here's what's happening across your catalogue.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <Link
              to={s.to}
              className="group relative block overflow-hidden rounded-2xl border border-white/10 bg-ink-900 p-5 transition hover:border-white/20"
            >
              <div className="flex items-start justify-between">
                <span className={cn("grid h-11 w-11 place-items-center rounded-xl", s.color)}>
                  <s.icon className="h-5 w-5" />
                </span>
                {s.badge ? (
                  <span className="rounded-full bg-neo-600 px-2 py-0.5 text-[11px] font-bold text-pure">
                    {s.badge} new
                  </span>
                ) : (
                  <ArrowUpRight className="h-4 w-4 text-steel-600 transition group-hover:text-white" />
                )}
              </div>
              <p className="mt-4 font-display text-3xl font-bold text-white">
                {s.value}
              </p>
              <p className="mt-1 text-sm text-steel-400">{s.label}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
        {/* Recent inquiries */}
        <div className="rounded-2xl border border-white/10 bg-ink-900 p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-white">
              Recent inquiries
            </h2>
            <Link to={`${ADMIN_BASE}/inquiries`} className="text-sm text-neo-400 hover:text-neo-300">
              View all →
            </Link>
          </div>
          <div className="mt-5 space-y-3">
            {inquiries.slice(0, 5).map((inq) => (
              <div
                key={inq.id}
                className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.02] p-4"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-neo-600/15 font-display text-sm font-bold text-neo-300">
                  {inq.name.charAt(0)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white">{inq.name}</p>
                  <p className="truncate text-xs text-steel-400">
                    {inq.productName ?? "General inquiry"}
                  </p>
                </div>
                <span
                  className={cn(
                    "shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-medium capitalize",
                    statusStyle[inq.status]
                  )}
                >
                  {inq.status}
                </span>
              </div>
            ))}
            {inquiries.length === 0 && (
              <p className="py-8 text-center text-sm text-steel-500">No inquiries yet.</p>
            )}
          </div>
        </div>

        {/* Quick stats */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-neo-600/15 to-transparent p-6">
            <TrendingUp className="h-7 w-7 text-neo-400" />
            <p className="mt-4 font-display text-3xl font-bold text-white">
              {Math.round((inquiries.filter((i) => i.status === "responded" || i.status === "closed").length / Math.max(inquiries.length, 1)) * 100)}%
            </p>
            <p className="mt-1 text-sm text-steel-300">Inquiries handled</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-ink-900 p-6">
            <Clock className="h-7 w-7 text-volt-400" />
            <p className="mt-4 font-display text-3xl font-bold text-white">{newCount}</p>
            <p className="mt-1 text-sm text-steel-300">Awaiting response</p>
            <Link to={`${ADMIN_BASE}/inquiries`} className="btn-ghost mt-4 w-full justify-center text-[13px]">
              Review now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

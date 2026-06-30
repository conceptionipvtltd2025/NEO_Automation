import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  Tags,
  Factory,
  Inbox,
  LogOut,
  ExternalLink,
  Menu,
  X,
  AlertTriangle,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useAuth } from "@/store/useAuth";
import { useInquiries } from "@/store/useInquiries";
import { useCatalog } from "@/store/useCatalog";
import { ADMIN_BASE, ADMIN_LOGIN } from "@/lib/adminPath";
import { cn } from "@/lib/utils";

const links = [
  { to: ADMIN_BASE, label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: `${ADMIN_BASE}/products`, label: "Products", icon: Package },
  { to: `${ADMIN_BASE}/categories`, label: "Categories", icon: Tags },
  { to: `${ADMIN_BASE}/industries`, label: "Industries", icon: Factory },
  { to: `${ADMIN_BASE}/inquiries`, label: "Inquiries", icon: Inbox },
];

export function AdminLayout() {
  const navigate = useNavigate();
  const logout = useAuth((s) => s.logout);
  const user = useAuth((s) => s.user);
  const newCount = useInquiries((s) => s.inquiries.filter((i) => i.status === "new").length);
  const lastError = useCatalog((s) => s.lastError);
  const clearError = useCatalog((s) => s.clearError);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Pull live inquiries + catalogue from the backend when entering the admin.
  useEffect(() => {
    useInquiries.getState().load();
    useCatalog.getState().load();
  }, []);

  const handleLogout = () => {
    logout();
    navigate(ADMIN_LOGIN, { replace: true });
  };

  const SidebarContent = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-6 py-5">
        <Logo />
        <button
          onClick={() => setMobileOpen(false)}
          className="text-steel-400 lg:hidden"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.end}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              cn(
                "group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition",
                isActive
                  ? "bg-neo-600/15 text-white"
                  : "text-steel-400 hover:bg-white/[0.04] hover:text-white"
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.span
                    layoutId="admin-active"
                    className="absolute left-0 h-6 w-1 rounded-r-full bg-neo-600"
                  />
                )}
                <l.icon className="h-5 w-5" />
                {l.label}
                {l.label === "Inquiries" && newCount > 0 && (
                  <span className="ml-auto grid h-5 min-w-5 place-items-center rounded-full bg-neo-600 px-1.5 text-[11px] font-bold text-pure">
                    {newCount}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="space-y-2 border-t border-white/10 p-3">
        <Link
          to="/"
          className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-steel-400 transition hover:bg-white/[0.04] hover:text-white"
        >
          <ExternalLink className="h-4 w-4" /> View website
        </Link>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-steel-400 transition hover:bg-red-500/10 hover:text-red-300"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-ink-950">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-white/10 bg-ink-900 lg:block">
        {SidebarContent}
      </aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div className="absolute inset-0 bg-ink-950/80" onClick={() => setMobileOpen(false)} />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className="absolute inset-y-0 left-0 w-64 border-r border-white/10 bg-ink-900"
            >
              {SidebarContent}
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-white/10 bg-ink-900/80 px-5 py-4 backdrop-blur-xl">
          <button
            onClick={() => setMobileOpen(true)}
            className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 text-white lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="ml-auto flex items-center gap-3">
            <ThemeToggle />
            <div className="text-right">
              <p className="text-sm font-medium text-white">{user ?? "Admin"}</p>
              <p className="text-xs text-steel-500">Administrator</p>
            </div>
            <span className="grid h-10 w-10 place-items-center rounded-full bg-neo-600 font-display text-sm font-bold text-pure">
              {(user ?? "A").charAt(0).toUpperCase()}
            </span>
          </div>
        </header>

        {lastError && (
          <div className="flex items-start gap-3 border-b border-red-500/30 bg-red-500/10 px-5 py-3 text-sm text-red-200 sm:px-8">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
            <p className="flex-1">{lastError}</p>
            <button
              onClick={clearError}
              aria-label="Dismiss"
              className="shrink-0 rounded-lg p-1 text-red-300 transition hover:bg-red-500/20 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <main className="p-5 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

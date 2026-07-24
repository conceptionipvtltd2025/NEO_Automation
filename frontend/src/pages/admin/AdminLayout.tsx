import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  Tags,
  Boxes,
  Factory,
  Inbox,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";
import { Logo, LogoMark } from "@/components/Logo";
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
  { to: `${ADMIN_BASE}/brands`, label: "Brands", icon: Boxes },
  { to: `${ADMIN_BASE}/industries`, label: "Industries", icon: Factory },
  { to: `${ADMIN_BASE}/inquiries`, label: "Enquiries", icon: Inbox },
];

export function AdminLayout() {
  const navigate = useNavigate();
  const logout = useAuth((s) => s.logout);
  const user = useAuth((s) => s.user);
  const newCount = useInquiries((s) => s.inquiries.filter((i) => i.status === "new").length);
  const lastError = useCatalog((s) => s.lastError);
  const clearError = useCatalog((s) => s.clearError);
  const [mobileOpen, setMobileOpen] = useState(false);
  // Desktop sidebar collapse, remembered between visits — the catalogue tables
  // and the brand form are wide, and 16rem of chrome is a lot to give up.
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem("neo-admin-sidebar") === "collapsed";
    } catch {
      return false;
    }
  });
  const toggleCollapsed = () =>
    setCollapsed((c) => {
      const next = !c;
      try {
        localStorage.setItem("neo-admin-sidebar", next ? "collapsed" : "expanded");
      } catch {
        /* ignore storage errors */
      }
      return next;
    });

  // Pull live inquiries + catalogue from the backend when entering the admin.
  useEffect(() => {
    useInquiries.getState().load();
    useCatalog.getState().load();
  }, []);

  const handleLogout = () => {
    logout();
    navigate(ADMIN_LOGIN, { replace: true });
  };

  /** `mini` renders the icon-only rail; the mobile drawer is always full width. */
  const sidebar = (mini: boolean) => (
    <div className="flex h-full flex-col">
      <div
        className={cn(
          "flex items-center gap-2 py-5",
          mini ? "justify-center px-3" : "justify-between px-5"
        )}
      >
        {/* compact lockup — the full-size one overflows a 16rem sidebar */}
        {mini ? <LogoMark className="h-10 w-10 xl:h-10 xl:w-10" /> : <Logo compact />}
        <button
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
          className="shrink-0 text-steel-400 transition hover:text-white lg:hidden"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className={cn("flex-1 space-y-1 py-4", mini ? "px-2" : "px-3")}>
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.end}
            onClick={() => setMobileOpen(false)}
            title={mini ? l.label : undefined}
            className={({ isActive }) =>
              cn(
                "group relative flex items-center rounded-xl text-sm font-medium transition-all duration-200",
                mini ? "justify-center px-0 py-3" : "gap-3 px-4 py-3",
                isActive
                  ? "bg-neo-600/15 text-white"
                  : "text-steel-400 hover:bg-white/[0.06] hover:text-white"
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
                <l.icon
                  className={cn(
                    "h-5 w-5 shrink-0 transition-transform duration-200",
                    !isActive && "group-hover:scale-110"
                  )}
                />
                {!mini && <span className="truncate">{l.label}</span>}
                {l.label === "Enquiries" && newCount > 0 && (
                  <span
                    className={cn(
                      "grid place-items-center rounded-full bg-neo-600 font-bold text-pure",
                      mini
                        ? "absolute right-1.5 top-1.5 h-4 min-w-4 px-1 text-[9px]"
                        : "ml-auto h-5 min-w-5 px-1.5 text-[11px]"
                    )}
                  >
                    {newCount}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className={cn("space-y-1 border-t border-white/10 p-3", mini && "px-2")}>
        <Link
          to="/"
          title={mini ? "View website" : undefined}
          className={cn(
            "flex items-center rounded-xl py-2.5 text-sm text-steel-400 transition hover:bg-white/[0.06] hover:text-white",
            mini ? "justify-center px-0" : "gap-3 px-4"
          )}
        >
          <ExternalLink className="h-4 w-4 shrink-0" />
          {!mini && "View website"}
        </Link>
        <button
          onClick={handleLogout}
          title={mini ? "Sign out" : undefined}
          className={cn(
            "flex w-full items-center rounded-xl py-2.5 text-sm text-steel-400 transition hover:bg-red-500/10 hover:text-red-300",
            mini ? "justify-center px-0" : "gap-3 px-4"
          )}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!mini && "Sign out"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-ink-950">
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 hidden border-r border-white/10 bg-ink-900 transition-[width] duration-300 lg:block",
          collapsed ? "w-[4.5rem]" : "w-64"
        )}
      >
        {sidebar(collapsed)}
        {/* Collapse handle, straddling the sidebar edge so it reads as a
            control of the panel rather than of the page. */}
        <button
          onClick={toggleCollapsed}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!collapsed}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="absolute -right-3 top-24 z-10 hidden h-7 w-7 place-items-center rounded-full border border-white/15 bg-ink-850 text-steel-300 shadow-card transition hover:border-neo-600/50 hover:text-white lg:grid"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
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
              {sidebar(false)}
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className={cn("transition-[padding] duration-300", collapsed ? "lg:pl-[4.5rem]" : "lg:pl-64")}>
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

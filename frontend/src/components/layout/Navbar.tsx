import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, ArrowUpRight, ChevronDown } from "lucide-react";
import { Logo } from "@/components/Logo";
import { useNavItems } from "@/lib/useNavItems";
import { Magnetic } from "@/components/ui/Magnetic";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { NavSearch } from "@/components/layout/NavSearch";
import { MegaMenu } from "@/components/layout/MegaMenu";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeMega, setActiveMega] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const closeTimer = useRef<number>();
  const { pathname } = useLocation();
  const navItems = useNavItems();

  // The navbar floats over a full-bleed dark media hero on these routes; while
  // it is transparent (not scrolled) it must render in light "on-dark" chrome.
  const overDarkHero =
    !scrolled && (pathname === "/" || /^\/industries\/[^/]+$/.test(pathname));

  const activeItem = navItems.find((i) => i.label === activeMega) ?? null;

  const openMega = (label: string) => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setActiveMega(label);
  };
  const scheduleClose = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setActiveMega(null), 140);
  };
  const closeMega = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setActiveMega(null);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menus on navigation.
  useEffect(() => {
    setOpen(false);
    setActiveMega(null);
    setMobileExpanded(null);
  }, [pathname]);

  // Escape closes the desktop mega panel.
  useEffect(() => {
    if (!activeMega) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMega();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [activeMega]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 top-0 z-40"
      >
        <div className="container-px">
          <div className="relative" onMouseLeave={scheduleClose}>
            <div
              className={cn(
                "mt-3 flex items-center justify-between rounded-2xl border px-4 py-2 transition-all duration-500 sm:px-5",
                scrolled || activeMega || searchOpen
                  ? "border-white/10 bg-ink-900/80 shadow-card backdrop-blur-xl"
                  : "border-transparent bg-transparent",
                overDarkHero && !activeMega && !searchOpen && "force-dark"
              )}
            >
              <Link to="/" className="shrink-0" onClick={closeMega}>
                <Logo />
              </Link>

              <nav className="hidden items-center gap-0.5 md:flex">
                {navItems.map((item) => {
                  const hasMega = !!item.mega;
                  const routeActive =
                    item.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(item.href);
                  const megaOpen = activeMega === item.label;
                  return (
                    <div
                      key={item.href}
                      onMouseEnter={() =>
                        hasMega ? openMega(item.label) : closeMega()
                      }
                    >
                      <NavLink
                        to={item.href}
                        onFocus={() =>
                          hasMega ? openMega(item.label) : closeMega()
                        }
                        onClick={closeMega}
                        aria-expanded={hasMega ? megaOpen : undefined}
                        className={cn(
                          "group relative flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-2 text-[13px] font-medium transition-colors lg:px-3 xl:px-4 xl:text-sm",
                          routeActive || megaOpen
                            ? "text-white"
                            : "text-steel-300 hover:text-white"
                        )}
                      >
                        <span className="relative z-10">{item.label}</span>
                        {hasMega && (
                          <ChevronDown
                            className={cn(
                              "relative z-10 h-3.5 w-3.5 text-steel-500 transition-transform duration-300",
                              megaOpen && "rotate-180 text-steel-200"
                            )}
                          />
                        )}
                        {routeActive && (
                          <motion.span
                            layoutId="nav-pill"
                            className="absolute inset-0 rounded-full border border-white/10 bg-white/[0.06]"
                            transition={{ type: "spring", stiffness: 350, damping: 30 }}
                          />
                        )}
                        <span
                          className={cn(
                            "absolute inset-x-4 -bottom-px h-px bg-gradient-to-r from-transparent via-neo-600 to-transparent transition-transform duration-300",
                            megaOpen ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                          )}
                        />
                      </NavLink>
                    </div>
                  );
                })}
              </nav>

              <div
                className="flex items-center gap-2"
                onMouseEnter={closeMega}
              >
                <NavSearch onOpenChange={setSearchOpen} />
                <ThemeToggle />
                <Magnetic className="hidden xl:block">
                  <Link to="/inquiry" className="btn-primary whitespace-nowrap text-[13px]">
                    Get a Quote
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </Magnetic>
                <button
                  onClick={() => setOpen(true)}
                  aria-label="Open menu"
                  className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-white md:hidden"
                >
                  <Menu className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Desktop mega-menu panel */}
            <AnimatePresence>
              {activeItem?.mega && (
                <MegaMenu
                  key={activeItem.label}
                  item={activeItem}
                  onNavigate={closeMega}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 md:hidden"
          >
            <div
              className="absolute inset-0 bg-ink-950/80 backdrop-blur-xl"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className="absolute right-0 top-0 flex h-full w-[88%] max-w-sm flex-col border-l border-white/10 bg-ink-900/95 p-6"
            >
              <div className="flex items-center justify-between">
                <Logo />
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="mt-8 flex flex-1 flex-col gap-1 overflow-y-auto pb-4">
                {navItems.map((item, i) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.06 + i * 0.05 }}
                  >
                    {item.mega ? (
                      <div>
                        <button
                          onClick={() =>
                            setMobileExpanded((e) =>
                              e === item.label ? null : item.label
                            )
                          }
                          aria-expanded={mobileExpanded === item.label}
                          className={cn(
                            "flex w-full items-center justify-between rounded-xl px-4 py-3.5 text-lg font-medium transition",
                            mobileExpanded === item.label
                              ? "bg-white/[0.05] text-white"
                              : "text-steel-300 hover:bg-white/[0.04] hover:text-white"
                          )}
                        >
                          {item.label}
                          <ChevronDown
                            className={cn(
                              "h-5 w-5 text-steel-500 transition-transform duration-300",
                              mobileExpanded === item.label && "rotate-180"
                            )}
                          />
                        </button>
                        <AnimatePresence initial={false}>
                          {mobileExpanded === item.label && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                              className="overflow-hidden"
                            >
                              <div className="space-y-4 px-3 pb-4 pt-2">
                                <Link
                                  to={item.href}
                                  className="inline-flex items-center gap-1 px-1 text-sm font-medium text-neo-400"
                                >
                                  View all {item.label}
                                  <ArrowUpRight className="h-3.5 w-3.5" />
                                </Link>
                                {item.mega.columns.map((col) => (
                                  <div key={col.heading}>
                                    <p className="px-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-steel-500">
                                      {col.heading}
                                    </p>
                                    <ul className="mt-1.5 space-y-0.5">
                                      {col.links.map((l) => (
                                        <li key={l.label + l.href}>
                                          <Link
                                            to={l.href}
                                            className="block rounded-lg px-3 py-2 text-sm text-steel-300 transition hover:bg-white/[0.04] hover:text-white"
                                          >
                                            {l.label}
                                          </Link>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <NavLink
                        to={item.href}
                        className={({ isActive }) =>
                          cn(
                            "flex items-center justify-between rounded-xl px-4 py-3.5 text-lg font-medium transition",
                            isActive
                              ? "bg-white/[0.06] text-white"
                              : "text-steel-300 hover:bg-white/[0.04] hover:text-white"
                          )
                        }
                      >
                        {item.label}
                        <ArrowUpRight className="h-4 w-4 opacity-50" />
                      </NavLink>
                    )}
                  </motion.div>
                ))}
              </nav>

              <Link to="/inquiry" className="btn-primary mt-2 w-full shrink-0">
                Get a Quote <ArrowUpRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

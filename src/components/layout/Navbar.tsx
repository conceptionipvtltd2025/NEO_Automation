import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/Logo";
import { navItems } from "@/data/site";
import { Magnetic } from "@/components/ui/Magnetic";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  // The navbar floats over a full-bleed dark media hero on these routes; while
  // it is transparent (not scrolled) it must render in light "on-dark" chrome.
  const overDarkHero =
    !scrolled && (pathname === "/" || /^\/industries\/[^/]+$/.test(pathname));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 top-0 z-40"
      >
        <div className="container-px">
          <div
            className={cn(
              "mt-3 flex items-center justify-between rounded-2xl border px-4 py-2 transition-all duration-500 sm:px-5",
              scrolled
                ? "border-white/10 bg-ink-900/80 shadow-card backdrop-blur-xl"
                : "border-transparent bg-transparent",
              overDarkHero && "force-dark"
            )}
          >
            <Link to="/" className="shrink-0">
              <Logo />
            </Link>

            <nav className="hidden items-center gap-0.5 md:flex">
              {navItems.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      "group relative rounded-full px-3 py-2 text-[13px] font-medium transition-colors lg:px-4 lg:text-sm",
                      isActive
                        ? "text-white"
                        : "text-steel-300 hover:text-white"
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span className="relative z-10">{item.label}</span>
                      {isActive && (
                        <motion.span
                          layoutId="nav-pill"
                          className="absolute inset-0 rounded-full border border-white/10 bg-white/[0.06]"
                          transition={{ type: "spring", stiffness: 350, damping: 30 }}
                        />
                      )}
                      <span className="absolute inset-x-4 -bottom-px h-px scale-x-0 bg-gradient-to-r from-transparent via-neo-600 to-transparent transition-transform duration-300 group-hover:scale-x-100" />
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Magnetic className="hidden lg:block">
                <Link to="/inquiry" className="btn-primary text-[13px]">
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
              className="absolute right-0 top-0 flex h-full w-[86%] max-w-sm flex-col border-l border-white/10 bg-ink-900/95 p-6"
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
              <nav className="mt-10 flex flex-col gap-1">
                {navItems.map((item, i) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 + i * 0.06 }}
                  >
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
                  </motion.div>
                ))}
              </nav>
              <Link to="/inquiry" className="btn-primary mt-auto w-full">
                Get a Quote <ArrowUpRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

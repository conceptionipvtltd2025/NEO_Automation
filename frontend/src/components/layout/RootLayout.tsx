import { Outlet, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { ScrollToTop } from "./ScrollToTop";
import { FloatingWidgets } from "@/components/FloatingWidgets";
import { AmbientBackground } from "@/components/ui/Backgrounds";
import { ScrollProgress } from "@/components/ui/ScrollProgress";

export function RootLayout() {
  const { pathname } = useLocation();
  return (
    <div className="relative flex min-h-screen flex-col">
      <AmbientBackground />
      <ScrollProgress />
      <ScrollToTop />
      <Navbar />
      {/* Keyed mount-fade per route. No AnimatePresence/exit handoff, so the
          incoming page can never get stuck at its hidden initial state. */}
      <motion.main
        key={pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="flex-1"
      >
        <Outlet />
      </motion.main>
      <Footer />
      <FloatingWidgets />
    </div>
  );
}

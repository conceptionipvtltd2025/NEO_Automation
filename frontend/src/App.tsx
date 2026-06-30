import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useCatalog } from "./store/useCatalog";
import { RootLayout } from "./components/layout/RootLayout";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Industries from "./pages/Industries";
import IndustryDetail from "./pages/IndustryDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Inquiry from "./pages/Inquiry";
import NSW from "./pages/NSW";
import Legal from "./pages/Legal";
import NotFound from "./pages/NotFound";

// Admin
import { AdminLayout } from "./pages/admin/AdminLayout";
import AdminLogin from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/Products";
import AdminCategories from "./pages/admin/Categories";
import AdminIndustries from "./pages/admin/Industries";
import AdminInquiries from "./pages/admin/Inquiries";
import { RequireAuth } from "./pages/admin/RequireAuth";
import { ADMIN_BASE, ADMIN_LOGIN } from "./lib/adminPath";

export default function App() {
  // Hydrate the catalogue from the backend on first load (falls back to the
  // persisted/seed data if the API is offline).
  useEffect(() => {
    useCatalog.getState().load();
  }, []);

  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:slug" element={<ProductDetail />} />
        <Route path="/industries" element={<Industries />} />
        <Route path="/industries/:id" element={<IndustryDetail />} />
        <Route path="/nsw" element={<NSW />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/inquiry" element={<Inquiry />} />
        <Route path="/terms" element={<Legal kind="terms" />} />
        <Route path="/privacy" element={<Legal kind="privacy" />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Admin */}
      <Route path={ADMIN_LOGIN} element={<AdminLogin />} />
      <Route
        path={ADMIN_BASE}
        element={
          <RequireAuth>
            <AdminLayout />
          </RequireAuth>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="industries" element={<AdminIndustries />} />
        <Route path="inquiries" element={<AdminInquiries />} />
      </Route>
    </Routes>
  );
}

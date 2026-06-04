import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";
import { Aurora, GridBackground } from "@/components/ui/Backgrounds";

export default function NotFound() {
  return (
    <section className="relative grid min-h-[80svh] place-items-center overflow-hidden pt-24">
      <GridBackground />
      <Aurora />
      <div className="container-px relative z-10 text-center">
        <p className="font-display text-[clamp(6rem,22vw,16rem)] font-bold leading-none text-gradient-neo">
          404
        </p>
        <h1 className="mt-2 font-display text-2xl font-bold text-white sm:text-3xl">
          This page took an unscheduled downtime
        </h1>
        <p className="mx-auto mt-3 max-w-md text-steel-400">
          The page you're looking for has been moved, removed, or never existed.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link to="/" className="btn-primary">
            <Home className="h-4 w-4" /> Back home
          </Link>
          <Link to="/products" className="btn-ghost">
            <ArrowLeft className="h-4 w-4" /> Browse products
          </Link>
        </div>
      </div>
    </section>
  );
}

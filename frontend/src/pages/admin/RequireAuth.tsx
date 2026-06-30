import { type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/store/useAuth";
import { ADMIN_LOGIN } from "@/lib/adminPath";

export function RequireAuth({ children }: { children: ReactNode }) {
  const isAuthed = useAuth((s) => s.isAuthed);
  const location = useLocation();
  if (!isAuthed) {
    return <Navigate to={ADMIN_LOGIN} state={{ from: location }} replace />;
  }
  return <>{children}</>;
}

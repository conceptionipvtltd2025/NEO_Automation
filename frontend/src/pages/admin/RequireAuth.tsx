import { type ReactNode, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/store/useAuth";
import { ADMIN_LOGIN } from "@/lib/adminPath";

export function RequireAuth({ children }: { children: ReactNode }) {
  const isAuthed = useAuth((s) => s.isAuthed);
  const checkSession = useAuth((s) => s.checkSession);
  const location = useLocation();

  // The signed-in flag is persisted but the JWT behind it expires after a week.
  // Re-validating on entry means a stale session lands on the login screen
  // instead of looking fine until the first save comes back 401.
  useEffect(() => {
    checkSession();
  }, [checkSession, location.pathname]);

  if (!isAuthed) {
    return <Navigate to={ADMIN_LOGIN} state={{ from: location }} replace />;
  }
  return <>{children}</>;
}

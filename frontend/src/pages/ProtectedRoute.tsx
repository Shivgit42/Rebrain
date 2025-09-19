import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;

  if (!isAuthenticated) {
    if (location.pathname !== "/signin") {
      toast.error("Please sign in or sign up to continue.", {
        id: "auth-error",
      });
    }
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

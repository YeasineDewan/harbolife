import { useEffect, useRef } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

export default function AdminRoute({ children }) {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const location = useLocation();
  const hasToasted = useRef(false);

  const isAdmin = ["admin", "super_admin"].includes(user?.role);

  useEffect(() => {
    if (isAuthenticated && !isAdmin && !hasToasted.current) {
      toast.error("Access denied. Admin privileges required.");
      hasToasted.current = true;
    }
  }, [isAuthenticated, isAdmin]);

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}

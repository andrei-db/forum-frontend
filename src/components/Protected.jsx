import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export function Protected({ children, staffOnly = false }) {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (staffOnly && !user.group?.isStaff) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export function Guest({ children }) {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
}
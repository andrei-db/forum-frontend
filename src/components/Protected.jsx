import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export function Protected({ children }) {
  const { authed } = useAuth();
  return authed ? children : <Navigate to="/login" />;
}

export function Guest({ children }) {
  const { authed } = useAuth();
  return authed ? <Navigate to="/" /> : children;
}

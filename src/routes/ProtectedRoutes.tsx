import { Navigate } from "react-router";
import { type JSX } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";

interface ProtectedRouteProps {
  element: JSX.Element;
  reverse?: boolean;
  adminOnly?: boolean;
}

const ADMIN_PANEL_ALLOWED_LOGIN_TYPES = ["admin", "client"];

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element, reverse = false, adminOnly = false }) => {
  const isAuthenticated = !!localStorage.getItem('token');
  const user = useSelector((state: RootState) => state.user);
  const loginType = (user.loginType || user.userType || "").toLowerCase();
  const canAccessAdminPanel = ADMIN_PANEL_ALLOWED_LOGIN_TYPES.includes(loginType);

  if (!isAuthenticated) {
    localStorage.clear();
  }

  if (reverse) {
    return isAuthenticated ? <Navigate to="/" replace /> : element;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !canAccessAdminPanel) {
    return <Navigate to="/" replace />;
  }

  return element;
};

export default ProtectedRoute;

import { Navigate } from "react-router";
import { type JSX } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { getUserAccessConfig } from "../config/userAccess";

interface ProtectedRouteProps {
  element: JSX.Element;
  reverse?: boolean;
  adminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element, reverse = false, adminOnly = false }) => {
  const isAuthenticated = !!localStorage.getItem('token');
  const user = useSelector((state: RootState) => state.user);
  const userAccess = getUserAccessConfig(user.loginType, user.userType);

  if (!isAuthenticated) {
    localStorage.clear();
  }

  if (reverse) {
    return isAuthenticated ? <Navigate to="/" replace /> : element;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !userAccess.canAccessAdminPanel) {
    return <Navigate to="/" replace />;
  }

  return element;
};

export default ProtectedRoute;

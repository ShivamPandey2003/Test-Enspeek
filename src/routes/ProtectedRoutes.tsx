import { Navigate } from "react-router";
import { type JSX } from "react";

interface ProtectedRouteProps {
  element: JSX.Element;
  reverse?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element, reverse = false }) => {
  const isAuthenticated = !!localStorage.getItem('token');

  if (!isAuthenticated) {
    localStorage.clear();
  }

  if (reverse) {
    return isAuthenticated ? <Navigate to="/" replace /> : element;
  }

  return isAuthenticated ? element : <Navigate to="/login" replace />;
};

export default ProtectedRoute;

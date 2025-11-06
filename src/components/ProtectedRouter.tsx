import { useSelector } from "react-redux"; 
import { Navigate } from "react-router-dom";
import { selectIsAuthenticated, selectUser } from "@/store/slices/authSlice";
import type { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";


interface ProtectedRouteProps {
  children: ReactNode;
  requiredRoles?: string[];
}

const ProtectedRoute = ({ children, requiredRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/403" replace />;
  }

  if (
    requiredRoles &&
    Array.isArray(requiredRoles) &&
    !requiredRoles.includes(user?.role)
  ) {
    
    return <Navigate to="/403" replace />;
  }

  return children;
};

export default ProtectedRoute;
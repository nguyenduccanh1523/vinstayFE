import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, requiredRole }) => {
  // Get user from localStorage, context, or your auth state management
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userRole = user?.role_id?.name;

  // Check if user is logged in
  if (!user || !userRole) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has required role
  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;

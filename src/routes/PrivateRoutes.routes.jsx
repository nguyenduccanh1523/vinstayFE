import React from "react";
import AdminHome from "../pages/admin/AdminHome";
import AdminRole from "../pages/admin/AdminRole";
import AdminHotel from "../pages/admin/AdminHotel";
import AdminCustomer from "../pages/admin/AdminCustomer";
import ProtectedRoute from "../components/ProtectedRoute";
import AdminRoom from "../pages/admin/AdminRoom";
import AdminBooking from "../pages/admin/AdminBooking";

const privateRoutes = [
  {
    path: "/admin",
    element: (
      <ProtectedRoute requiredRole="admin">
        <AdminHome />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/roles",
    element: (
      <ProtectedRoute requiredRole="admin">
        <AdminRole />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/hotels",
    element: (
      <ProtectedRoute requiredRole="admin">
        <AdminHotel />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/customers",
    element: (
      <ProtectedRoute requiredRole="admin">
        <AdminCustomer />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/rooms",
    element: (
      <ProtectedRoute requiredRole="admin">
        <AdminRoom />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/bookings",
    element: (
      <ProtectedRoute requiredRole="admin">
        <AdminBooking />
      </ProtectedRoute>
    ),
  },
];

export default privateRoutes;

import React from "react";
import { Route, Routes } from "react-router-dom";
import publicRoutes from "./PublicRoutes.routes";
import privateRoutes from "./PrivateRoutes.routes";
import MainLayout from "../layouts/MainLayout/MainLayout";
import AdminLayout from "../layouts/AdminLayout/AdminLayout";
import { SimpleRouter } from "./SimpleRoutes.routes";
import ProtectedRoute from "../components/ProtectedRoute";
import OwnerLayout from "../layouts/OwnerLayout/OwnerLayout";
import OwnerBookings from "../pages/owner/bookings/OwnerBookings";
import OwnerHotels from "../pages/owner/hotels/OwnerHotels";
import OwnerDashboard from "../pages/owner/OwnerDashboard";
import OwnerRevenue from "../pages/owner/revenue/OwnerRevenue";
import OwnerRooms from "../pages/owner/rooms/OwnerRooms";

const AppRoutes = () => {
  return (
    <Routes>
      {publicRoutes.map(({ path, element }) => (
        <Route
          key={path}
          path={path}
          element={<MainLayout>{element}</MainLayout>}
        />
      ))}
      {privateRoutes.map(({ path, element }) => (
        <Route
          key={path}
          path={path}
          element={<AdminLayout>{element}</AdminLayout>}
        />
      ))}
      {SimpleRouter.map(({ path, element }) => (
        <Route key={path} path={path} element={element} />
      ))}

      <Route
        path="/manage-hotel"
        element={
          <ProtectedRoute requiredRole="hotel_owner">
            <OwnerLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<OwnerDashboard />} />
        <Route path="hotels" element={<OwnerHotels />} />
        <Route path="rooms" element={<OwnerRooms />} />
        <Route path="bookings" element={<OwnerBookings />} />
        <Route path="revenue" element={<OwnerRevenue />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;

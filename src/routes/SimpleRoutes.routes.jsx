import ProtectedRoute from "../components/ProtectedRoute";
import OwnerLayout from "../layouts/OwnerLayout/OwnerLayout";
import Login from "../pages/main/auth/Login";
import Register from "../pages/main/auth/Register";
import OwnerBookings from "../pages/owner/bookings/OwnerBookings";
import OwnerHotels from "../pages/owner/hotels/OwnerHotels";
import OwnerDashboard from "../pages/owner/OwnerDashboard";
import OwnerRevenue from "../pages/owner/revenue/OwnerRevenue";
import OwnerRooms from "../pages/owner/rooms/OwnerRooms";

export const SimpleRouter = [
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  // {
  //   path: "/manage-hotel",
  //   element: (
  //     <ProtectedRoute requiredRole="hotel_owner">
  //       <OwnerLayout />
  //     </ProtectedRoute>
  //   ),
  //   children: [
  //     { index: true, element: <OwnerDashboard /> },
  //     { path: "hotels", element: <OwnerHotels /> },
  //     { path: "rooms", element: <OwnerRooms /> },
  //     { path: "bookings", element: <OwnerBookings /> },
  //     { path: "revenue", element: <OwnerRevenue /> },
  //   ],
  // },
]
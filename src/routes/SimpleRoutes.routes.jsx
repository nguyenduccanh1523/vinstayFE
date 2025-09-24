import ProtectedRoute from "../components/ProtectedRoute";
import Login from "../pages/main/auth/Login";
import Register from "../pages/main/auth/Register";
import HotelOwner from "../pages/owner/HotelOwner";

export const SimpleRouter = [
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
      path: "/manage-hotel",
      element: (
        <ProtectedRoute requiredRole="hotel_owner">
          <HotelOwner />
        </ProtectedRoute>
      ),
    },
]
import HomePage from "../pages/main/HomePage";
import HotelPage from "../pages/main/HotelPage";
import RoomPage from "../pages/main/RoomPage";
import HotelDetail from "../features/HotelFeature/HotelDetail";
import RoomDetail from "../features/RoomFeature/RoomDetail";
import Unauthorized from "../pages/Unauthorized";
import ProtectedRoute from "../components/ProtectedRoute";
import BookingPage from "../pages/main/BookingPage";
import ProfilePage from "../pages/main/ProfilePage";

const publicRoutes = [
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/hotels",
    element: <HotelPage />,
  },
  {
    path: "/rooms",
    element: <RoomPage />,
  },
  {
    path: "/hotel-detail/:id",
    element: <HotelDetail />,
  },
  {
    path: "/room-detail/:id",
    element: <RoomDetail />,
  },
  {
    path: "/bookings",
    element: <BookingPage />,
  },
  {
    path: "/profile",
    element: <ProfilePage />,
  },
  {
    path: "/unauthorized",
    element: <Unauthorized />,
  },
];

export default publicRoutes;

import HomePage from "../pages/main/HomePage";
import HotelPage from "../pages/main/HotelPage";
import RoomPage from "../pages/main/RoomPage";
import HotelDetail from "../features/HotelFeature/HotelDetail";
import RoomDetail from "../features/RoomFeature/RoomDetail";
import Unauthorized from "../pages/Unauthorized";

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
    path: "/unauthorized",
    element: <Unauthorized />,
  }
];

export default publicRoutes;

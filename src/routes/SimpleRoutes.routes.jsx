import Login from "../pages/main/auth/Login";
import Register from "../pages/main/auth/Register";

export const SimpleRouter = [
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  }
]
import React from "react";
import AdminHome from "../pages/admin/AdminHome";
import AdminRole from "../pages/admin/AdminRole";

const privateRoutes = [
  {
    path: "/admin",
    element: <AdminHome />,
  },
  {
    path: "/admin/roles",
    element: <AdminRole />,
  },
];

export default privateRoutes;

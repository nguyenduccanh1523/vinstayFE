import React from "react";
import { Route, Routes } from "react-router-dom";
import publicRoutes from "./PublicRoutes.routes";
import privateRoutes from "./PrivateRoutes.routes";
import MainLayout from "../layouts/MainLayout/MainLayout";
import AdminLayout from "../layouts/AdminLayout/AdminLayout";
import { SimpleRouter } from "./SimpleRoutes.routes";

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
    </Routes>
  );
};

export default AppRoutes;

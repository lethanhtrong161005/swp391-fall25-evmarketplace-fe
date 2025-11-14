import React, { lazy } from "react";
import { Navigate } from "react-router-dom";
import RoleBasedRoute from "@components/RoleBasedRoute";
import LayoutAdmin from "@layouts/LayoutAdmin";

const ManageAccounts = lazy(() => import("@pages/Admin/ManageAccounts"));
const CategoryManagement = lazy(() => import("@pages/Admin/CategoryManagement/CategoryManagement"));
const BrandManagement = lazy(() => import("@pages/Admin/BrandManagement/BrandManagement"));
const ModelManagement = lazy(() => import("@pages/Admin/ModelManagement/ModelManagement"));
const ProductVehicleManagement = lazy(() => import("@pages/Admin/ProductVehicleManagement/ProductVehicleManagement"));
const ProductBatteryManagement = lazy(() => import("@pages/Admin/ProductBatteryManagement/ProductBatteryManagement"));

export default [
  {
    path: "/admin",
    element: (
      <RoleBasedRoute allowedRoles={["admin"]}>
        <LayoutAdmin />
      </RoleBasedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/admin/accounts" replace /> },
      { path: "accounts", element: <ManageAccounts /> },
      { path: "product/category", element: <CategoryManagement /> },
      { path: "product/brand", element: <BrandManagement /> },
      { path: "product/model", element: <ModelManagement /> },
      { path: "product/vehicle", element: <ProductVehicleManagement /> },
      { path: "product/battery", element: <ProductBatteryManagement /> },
    ],
  },
];

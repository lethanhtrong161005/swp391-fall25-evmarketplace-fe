import React, { lazy } from "react";
import RoleBasedRoute from "@components/RoleBasedRoute";
import LayoutManager from "@layouts/LayoutManager";

const ManagerDashboard = lazy(() => import("@pages/Manager/ManagerDashboard"));
const ManagerConsigmentsAssign = lazy(() =>
  import("@pages/Manager/ManagerConsignmentsAssign/ManagerConsignmentsAssign")
);
const ManagerConsigmentsManagement = lazy(() =>
  import(
    "@pages/Manager/ManagerConsignmentsManagement/ManagerConsignmentsManagement"
  )
);
const ManagerAgreementsManagement = lazy(() =>
  import(
    "@pages/Manager/ManagerAgreementsManagement/ManagerAgreementsManagement"
  )
);
const ManagerListingManagement = lazy(() =>
  import("@pages/Manager/ManagerListing/ManagerListingManagement")
);

export default [
  {
    path: "/manager",
    element: (
      <RoleBasedRoute allowedRoles={["manager"]}>
        <LayoutManager />
      </RoleBasedRoute>
    ),
    children: [
      { index: true, element: <ManagerDashboard /> },
      { path: "dashboard/transaction", element: <ManagerDashboard /> },
      { path: "dashboard/revenue", element: <ManagerDashboard /> },
      { path: "dashboard/market", element: <ManagerDashboard /> },
      { path: "consignment/assign", element: <ManagerConsigmentsAssign /> },
      {
        path: "consignment/management",
        element: <ManagerConsigmentsManagement />,
      },
      {
        path: "agreement/management",
        element: <ManagerAgreementsManagement />,
      },
      { path: "listings", element: <ManagerListingManagement /> },
    ],
  },
];

import React, { lazy } from "react";
import RoleBasedRoute from "@components/RoleBasedRoute";
import LayoutModerator from "@layouts/LayoutModerator";

const ModeratorDashboard = lazy(() => import("@pages/Moderator/ModeratorDashboard"));
const ModeratorApprovalListings = lazy(() => import("@pages/Moderator/ApprovalListings"));
const ModeratorHistoryPage = lazy(() => import("@pages/Moderator/ModeratorHistory"));

export default [
  {
    path: "/moderator",
    element: (
      <RoleBasedRoute allowedRoles={["moderator"]}>
        <LayoutModerator />
      </RoleBasedRoute>
    ),
    children: [
      { index: true, element: <ModeratorDashboard /> },
      { path: "approval", element: <ModeratorApprovalListings /> },
      { path: "history", element: <ModeratorHistoryPage /> },
    ],
  },
];

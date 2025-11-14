import React, { lazy } from "react";
import { Navigate } from "react-router-dom";
import RoleBasedRoute from "@components/RoleBasedRoute";
import LayoutModerator from "@layouts/LayoutModerator";

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
      { index: true, element: <Navigate to="/moderator/approval" replace /> },
      { path: "approval", element: <ModeratorApprovalListings /> },
      { path: "history", element: <ModeratorHistoryPage /> },
    ],
  },
];

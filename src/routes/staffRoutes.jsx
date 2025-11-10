import React, { lazy } from "react";
import RoleBasedRoute from "@components/RoleBasedRoute";
import LayoutStaff from "@layouts/LayoutStaff";

const StaffDashboard = lazy(() => import("@pages/Staff/StaffDashboard"));
const StaffConsignmentsManagement = lazy(() => import("@pages/Staff/StaffConsignmentsManagement/StaffConsignmentsManagement"));
const StaffConsignmentsConsider = lazy(() => import("@pages/Staff/StaffConsignmentsConsider/StaffConsignmentsConsider"));
const StaffInspectionSchedule = lazy(() => import("@pages/Staff/StaffInspectionSchedule/StaffInspectionSchedule"));
const StaffInspectingManagement = lazy(() => import("@pages/Staff/StaffInspectingsManagement/StaffInspectingManagement"));
const StaffAgreementManagement = lazy(() => import("@pages/Staff/StaffAgreementManagement/StaffAgreementManagement"));
const StaffOrder = lazy(() => import("@pages/Staff/StaffOrder"));
const StaffContract = lazy(() => import("@pages/Staff/StaffContract"));
const StaffListing = lazy(() => import("@pages/Staff/StaffListing"));

export default [
  {
    path: "/staff",
    element: (
      <RoleBasedRoute allowedRoles={["staff"]}>
        <LayoutStaff />
      </RoleBasedRoute>
    ),
    children: [
      { index: true, element: <StaffDashboard /> },
      { path: "consignment/management", element: <StaffConsignmentsManagement /> },
      { path: "consignment/consider", element: <StaffConsignmentsConsider /> },
      { path: "consignment/inspection-schedule", element: <StaffInspectionSchedule /> },
      { path: "consignment/inspecting", element: <StaffInspectingManagement /> },
      { path: "consignment/agreement", element: <StaffAgreementManagement /> },
      { path: "order", element: <StaffOrder /> },
      { path: "listings", element: <StaffListing /> },
      { path: "contract", element: <StaffContract /> },
    ],
  },
];

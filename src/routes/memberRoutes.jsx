import React, { lazy } from "react";
import  RoleBasedRoute  from "@components/RoleBasedRoute/index";
import LayoutDefault from "@layouts/LayoutDefault";

const HomeWrapper = lazy(() => import("@pages/Member/HomeWrapper/HomeWrapper"));
const Vehicle = lazy(() => import("@pages/Member/Vehicle"));
const Battery = lazy(() => import("@pages/Member/Battery"));
const ProductDetail = lazy(() => import("@pages/Member/ProductDetail/ProductDetail"));
const ListingCreate = lazy(() => import("@pages/Member/ListingCreate"));
const ListingEdit = lazy(() => import("@pages/Member/ListingEdit"));
const ManagerListing = lazy(() => import("@pages/Member/ManagerListing"));
const MyFavoritesPage = lazy(() => import("@pages/Member/MyFavoritesPage/MyFavoritesPage"));
const MyOrder = lazy(() => import("@pages/Member/MyOrder"));
const VnpReturnPage = lazy(() => import("@pages/Payment"));
const MemberConsignment = lazy(() => import("@pages/Member/MemberConsignment/MemberConsignment"));
const ConsignmentForm = lazy(() => import("@pages/Member/ConsignmentCreate/ConsignmentCreate"));
const InspectionAvailabilityPage = lazy(() =>
  import("@pages/Member/MemberConsignment/InpectionAvailabilityPage/InspectionAvailabilityPage")
);
const InfoUser = lazy(() => import("@pages/Member/InfoUser"));

export default [
  {
    path: "/",
    element: <LayoutDefault />,
    children: [
      { index: true, element: <HomeWrapper /> },
      { path: "vehicle", element: <Vehicle /> },
      { path: "battery", element: <Battery /> },
      { path: "detail/:id", element: <ProductDetail /> },
      {
        element: <RoleBasedRoute allowedRoles={["member", "staff", "admin"]} />,
        children: [
          { path: "info-user", element: <InfoUser /> },
          { path: "listing/new", element: <ListingCreate /> },
          { path: "listing/edit/:id", element: <ListingEdit /> },
          { path: "my-ads", element: <ManagerListing /> },
          { path: "my-favorites", element: <MyFavoritesPage /> },
          { path: "my-order", element: <MyOrder /> },
          { path: "payment/vnpay/call_back", element: <VnpReturnPage /> },
          {
            path: "consignment",
            children: [
              { index: true, element: <MemberConsignment /> },
              { path: "new", element: <ConsignmentForm mode="create" /> },
              { path: "edit/:id", element: <ConsignmentForm mode="update" /> },
              { path: "availability", element: <InspectionAvailabilityPage /> },
            ],
          },
        ],
      },
    ],
  },
];

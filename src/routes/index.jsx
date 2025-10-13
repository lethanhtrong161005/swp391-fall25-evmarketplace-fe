import RoleBasedRoute from "@components/RoleBasedRoute";

// Layouts
import LayoutDefault from "@layouts/LayoutDefault";
import LayoutAdmin from "@layouts/LayoutAdmin";
import LayoutStaff from "@layouts/LayoutStaff";

// Admin pages
import AdminDashboard from "@pages/Admin/AdminDashboard";
import ManageAccounts from "@pages/Admin/ManageAccounts";
import CategoryManagement from "@pages/Admin/CategoryManagement/CategoryManagement";
import BrandManagement from "@pages/Admin/BrandManagement/BrandManagement";
import ModelManagement from "@pages/Admin/ModelManagement/ModelManagement";
import ProductVehicleManagement from "@pages/Admin/ProductVehicleManagement/ProductVehicleManagement";
import ProductBatteryManagement from "@pages/Admin/ProductBatteryManagement/ProductBatteryManagement";

// Staff pages
import StaffDashboard from "@pages/Staff/StaffDashboard";
import ManageListingPage from "@pages/Staff/ManageListing";
import ManageListingDetail from "@pages/Staff/ManageListingDetail";

// Common (member)
import HomeWrapper from "@pages/Member/HomeWrapper/HomeWrapper";
import InfoUser from "@pages/Member/InfoUser";
import Battery from "@pages/Member/Battery";
import Vehicle from "@pages/Member/Vehicle";
import GoogleCallback from "@pages/Auth/GoogleCallback";
import ProductDetail from "@pages/Member/ProductDetail/ProductDetail";
import ListingCreate from "@pages/Member/ListingCreate";
import ListingEdit from "@pages/Member/ListingEdit";
import ManagerListing from "@pages/Member/ManagerListing";
import VnpReturnPage from "@pages/Payment";

// Errors
import Error403 from "@pages/Errors/Error403";
import Error404 from "@pages/Errors/Error404";
import ManageFavoriteListing from "../pages/Member/ManagerFavoriteListing";

export const routes = () => [
  {
    path: "/",
    element: <LayoutDefault />,
    children: [
      { index: true, element: <HomeWrapper /> },
      { path: "vehicle", element: <Vehicle /> },
      { path: "battery", element: <Battery /> },
      { path: "detail/:type/:id", element: <ProductDetail /> },
      { path: "auth/google/callback", element: <GoogleCallback /> },

      {
        element: <RoleBasedRoute allowedRoles={["member", "staff", "admin"]} />,
        children: [
          { path: "info-user", element: <InfoUser /> },
          { path: "listing/new", element: <ListingCreate /> },
          { path: "listing/edit/:id", element: <ListingEdit /> },
          { path: "my-ads", element: <ManagerListing /> },
          { path: "payment/vnpay/call_back", element: <VnpReturnPage/>},
          { path: "my-ads", element: <ManagerListing /> },
          { path: "my-favorite", element: <ManageFavoriteListing/> },
        ],
      },
    ],
  },

  // STAFF
  {
    path: "/",
    element: <LayoutStaff />,
    children: [
      {
        element: <RoleBasedRoute allowedRoles={["staff"]} />,
        children: [
          { path: "staff", element: <StaffDashboard /> },
          { path: "staff/listings", element: <ManageListingPage /> },
          { path: "staff/listings/:id", element: <ManageListingDetail /> },
        ],
      },
    ],
  },

  // ADMIN
  {
    path: "/",
    element: <LayoutAdmin />,
    children: [
      {
        element: <RoleBasedRoute allowedRoles={["admin"]} />,
        children: [
          { path: "admin", element: <AdminDashboard /> },
          {
            path: "admin/product/category",
            element: <CategoryManagement />,
          },
          {
            path: "admin/product/brand",
            element: <BrandManagement />,
          },
          {
            path: "admin/product/model",
            element: <ModelManagement />,
          },
          {
            path: "admin/product/vehicle",
            element: <ProductVehicleManagement />,
          },
          {
            path: "admin/product/battery",
            element: <ProductBatteryManagement />,
          },
          { path: "admin/accounts", element: <ManageAccounts /> },
        ],
      },
    ],
  },
  { path: "/403", element: <Error403 /> },
  { path: "*", element: <Error404 /> },
];

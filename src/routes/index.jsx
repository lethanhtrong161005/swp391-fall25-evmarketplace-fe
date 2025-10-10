import RoleBasedRoute from "@components/RoleBasedRoute";

// Layouts
import LayoutDefault from "@layouts/LayoutDefault";
import LayoutAdmin from "@layouts/LayoutAdmin";
import LayoutStaff from "@layouts/LayoutStaff";
import LayoutManager from "@layouts/LayoutManager";
import LayoutInspector from "@layouts/LayoutInspector";

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

// Manager pages
import ManagerDashboard from "@pages/Manager/ManagerDashboard";

// Inspector pages
import InspectorDashboard from "@pages/Inspector/InspectorDashboard";

// Common (member)
import HomeWrapper from "@pages/Member/HomeWrapper/HomeWrapper";
import InfoUser from "@pages/Member/InfoUser";
import Battery from "@pages/Member/Battery";
import Vehicle from "@pages/Member/Vehicle";
import GoogleCallback from "@pages/Auth/GoogleCallback";
import ProductDetail from "@pages/Member/ProductDetail/ProductDetail";
import ListingCreate from "@pages/Member/ListingCreate";

// Errors
import Error403 from "@pages/Errors/Error403";
import Error404 from "@pages/Errors/Error404";

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

  // MANAGER
  {
    path: "/",
    element: <LayoutManager />,
    children: [
      {
        element: <RoleBasedRoute allowedRoles={["manager"]} />,
        children: [{ path: "manager", element: <ManagerDashboard /> }],
      },
    ],
  },

  // INSPECTOR
  {
    path: "/",
    element: <LayoutInspector />,
    children: [
      {
        element: <RoleBasedRoute allowedRoles={["inspector"]} />,
        children: [{ path: "inspector", element: <InspectorDashboard /> }],
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

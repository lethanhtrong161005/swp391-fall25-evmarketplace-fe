import RoleBasedRoute from "@components/RoleBasedRoute";
import LayoutAdmin from "@layouts/LayoutAdmin";
import LayoutDefault from "@layouts/LayoutDefault";
import AdminDashboard from "@pages/Admin/AdminDashboard";
import Error403 from "@pages/Errors/Error403";
import Error404 from "@pages/Errors/Error404";
import HomeWrapper from "@pages/Member/HomeWrapper/HomeWrapper";
import InfoUser from "@pages/Member/InfoUser";
import StaffDashboard from "@pages/Staff/StaffDashboard";
import LayoutStaff from "@layouts/LayoutStaff";
import Battery from "@pages/Member/Battery";
import Vehicle from "@pages/Member/Vehicle";
import GoogleCallback from "@pages/Auth/GoogleCallback";
import ProductDetail from "@pages/Member/ProductDetail/ProductDetail";
import ListingCreate from "@pages/Member/ListingCreate";
import StaffListingManagement from "@pages/Staff/StaffListingManagement/StaffListingManagement";
import CategoryManagement from "@pages/Staff/CategoryManagement/CategoryManagement";
import BrandManagement from "../pages/Staff/BrandManagement/BrandManagement";
import ModelManagement from "../pages/Staff/ModelManagement/ModelManagement";

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

  // Staff
  {
    path: "/",
    element: <LayoutStaff />,
    children: [
      {
        element: <RoleBasedRoute allowedRoles={["staff", "admin"]} />,
        children: [
          {
            path: "staff",
            element: <StaffDashboard />,
          },
          {
            path: "staff/listingmanagement",
            element: <StaffListingManagement />,
          },
          { path: "staff/info", 
            element: <InfoUser /> 
          },
          {
            path: "/staff/product/category",
            element: <CategoryManagement />
          },
          {
            path: "/staff/product/brand",
            element: <BrandManagement />
          },
           {
            path: "/staff/product/model",
            element: <ModelManagement />
          }
        ],
      },
    ],
  },

  // Admin
  {
    path: "/",
    element: <LayoutAdmin />,
    children: [
      {
        element: <RoleBasedRoute allowedRoles={["admin"]} />,
        children: [{ path: "admin", element: <AdminDashboard /> }],
      },
    ],
  },

  { path: "/403", element: <Error403 /> },
  { path: "*", element: <Error404 /> },
];

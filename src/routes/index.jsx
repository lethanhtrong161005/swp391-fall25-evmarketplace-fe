import RoleBasedRoute from "@components/RoleBasedRoute";
import LayoutAdmin from "@layouts/LayoutAdmin";
import LayoutDefault from "@layouts/LayoutDefault";
import AdminDashboard from "@pages/Admin/AdminDashboard";
import Error403 from "@pages/Errors/Error403";
import Error404 from "@pages/Errors/Error404";
import Home from "@pages/Member/Home";
import InfoUser from "@pages/Member/InfoUser";
import StaffDashboard from "@pages/Staff/StaffDashboard";
import LayoutStaff from "@layouts/LayoutStaff";
import Battery from "@pages/Member/Battery";
import Vehicle from "@pages/Member/Vehicle";
import GoogleCallback from "@pages/Auth/GoogleCallback";
import ProductDetail from "../pages/Member/ProductDetail";

export const routes = () => [
  //Route cho guest + member
  {
    path: "/",
    element: <LayoutDefault />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "vehicle",
        element: <Vehicle />,
      },
      {
        path: "battery",
        element: <Battery />,
      },
      {
        path: "auth/google/callback",
        element: <GoogleCallback />,
      },
      {
        path: "detail/:id",
        element: <ProductDetail/>,
      },

      //Route chỉ dành cho member
      {
        element: <RoleBasedRoute allowedRoles={["member", "staff", "admin"]} />,
        children: [
          {
            path: "info-user",
            element: <InfoUser />,
          },
        ],
      },
    ],
  },

  //Staff
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
        children: [
          {
            path: "admin",
            element: <AdminDashboard />,
          },
        ],
      },
    ],
  },

  //Chặn nếu không có quyền truy cập
  {
    path: "/403",
    element: <Error403 />,
  },
  //Nếu gọi tới đường dẫn không có
  {
    path: "*",
    element: <Error404 />,
  },
];

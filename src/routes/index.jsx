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
import ListingCreate from "@pages/Member/ListingCreate";

export const routes = () => [
  {
    path: "/",
    element: <LayoutDefault />,
    children: [
      { index: true, element: <Home /> },
      { path: "vehicle", element: <Vehicle /> },
      { path: "battery", element: <Battery /> },
      { path: "auth/google/callback", element: <GoogleCallback /> },

      // ✅ TẤT CẢ ROUTE CẦN LOGIN/ROLE để ở ĐÂY
      {
        element: <RoleBasedRoute allowedRoles={["member", "staff", "admin"]} />,
        children: [
          { path: "info-user", element: <InfoUser /> },
          { path: "listing/new", element: <ListingCreate /> }, // <- chuyển vào đây
        ],
      },
    ],
  },

  // Staff (nếu muốn có layout riêng)
  {
    path: "/",
    element: <LayoutStaff />,
    children: [
      {
        element: <RoleBasedRoute allowedRoles={["staff", "admin"]} />,
        children: [{ path: "staff", element: <StaffDashboard /> }],
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

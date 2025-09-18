import RoleBasedRoute from "../components/RoleBasedRoute";
import LayoutAdmin from "../layouts/LayoutAdmin";
import LayoutDefault from "../layouts/LayoutDefault";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import Error403 from "../pages/Errors/Error403";
import Error404 from "../pages/Errors/Error404";
import Home from "../pages/Member/Home";
import InfoUser from "../pages/Member/InfoUser";
import StaffDashboard from "../pages/Staff/StaffDashboard";
import Login from "../pages/Member/Login";
import LayoutStaff from "../layouts/LayoutStaff";
import About from "../pages/Member/About";
import Car from "../pages/Member/Car";
import Motor from "../pages/Member/Motor";
import Bike from "../pages/Member/Bike";
import Battery from "../pages/Member/Battery";

export const routes = (user) => [
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
        path: "login",
        element: <Login />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "car",
        element: <Car />,
      },
      {
        path: "motor",
        element: <Motor />,
      },
      {
        path: "bike",
        element: <Bike />,
      },
      {
        path: "battery",
        element: <Battery />,
      },

      //Route chỉ dành cho member
      {
        element: (
          <RoleBasedRoute
            allowedRoles={["member", "staff", "admin"]}
            user={user}
          />
        ),
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
        element: (
          <RoleBasedRoute allowedRoles={["staff", "admin"]} user={user} />
        ),
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
        element: <RoleBasedRoute allowedRoles={["admin"]} user={user} />,
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

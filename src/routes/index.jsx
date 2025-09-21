import RoleBasedRoute from "../components/RoleBasedRoute"
import LayoutAdmin from "../layouts/LayoutAdmin"
import LayoutDefault from "../layouts/LayoutDefault"
import AdminDashboard from "../pages/Admin/AdminDashboard"
import Error403 from "../pages/Errors/Error403"
import Error404 from "../pages/Errors/Error404"
import Home from "../pages/Member/Home"
import InfoUser from "../pages/Member/InfoUser"
import StaffDashboard from "../pages/Staff/StaffDashboard"
import Login from "../pages/Member/Login"
import LayoutStaff from "../layouts/LayoutStaff"
import Battery from "../pages/Member/Battery"
import Vehicle from "../pages/Member/Vehicle"


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
                element: <Login />
            },
            {
                path: "vehicle",
                element: <Vehicle />
            },
             {
                path: "battery",
                element: <Battery/>
            },
            
            //Route chỉ dành cho member
            {
                element: <RoleBasedRoute allowedRoles={["member", "staff", "admin"]} user={user} />,
                children: [
                    {
                        path: "info-user",
                        element: <InfoUser />
                    }
                ]
            }
        ],
    },

    //Staff
    {
        path: "/",
        element: <LayoutStaff/>,
        children: [
            {
                element: <RoleBasedRoute allowedRoles={["staff", "admin"]} user={user} />,
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
        element: <Error403 />
    },
    //Nếu gọi tới đường dẫn không có
    {
        path: "*",
        element: <Error404 />
    }
]
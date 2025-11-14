import React, { Suspense } from "react";
import { Spin } from "antd";
import memberRoutes from "./memberRoutes";
import adminRoutes from "./adminRoutes";
import staffRoutes from "./staffRoutes";
import managerRoutes from "./managerRoutes";
import moderatorRoutes from "./moderatorRoutes";
import Error403 from "@pages/Errors/Error403";
import Error404 from "@pages/Errors/Error404";


export const routes = () => [
  ...memberRoutes,
  ...adminRoutes,
  ...staffRoutes,
  ...managerRoutes,
  ...moderatorRoutes,
  { path: "/403", element: <Error403 /> },
  { path: "*", element: <Error404 /> },
];

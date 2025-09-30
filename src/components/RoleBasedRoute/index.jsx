import React from "react";
import { Spin } from "antd";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@hooks/useAuth";

const RoleBasedRoute = ({ allowedRoles = [] }) => {
  const { isLoggedIn, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <Spin size="large" tip="Đang tải thông tin..." />
      </div>
    );
  }
  if (!isLoggedIn) {
    return <Navigate to="/403" replace state={{ from: location }} />;
  }

  const role = (user?.role || "").toLowerCase();
  if (allowedRoles.length && !allowedRoles.includes(role)) {
    return <Navigate to="/403" replace />;
  }

  return <Outlet />;
};

export default RoleBasedRoute;

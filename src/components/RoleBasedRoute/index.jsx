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
        <Spin size="large" />
      </div>
    );
  }

  if (!isLoggedIn || !user) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  const role = String(user.role || "").toLowerCase();
  const normAllowed = allowedRoles.map((r) => r.toLowerCase());

  if (normAllowed.length && !normAllowed.includes(role)) {
    return <Navigate to="/403" replace />;
  }
  return <Outlet />;
};

export default RoleBasedRoute;

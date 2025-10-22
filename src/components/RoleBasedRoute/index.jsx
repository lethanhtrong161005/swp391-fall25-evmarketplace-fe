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
        <div style={{ marginLeft: 16, fontSize: 16 }}>
          Đang tải thông tin...
        </div>
      </div>
    );
  }

  if (!isLoggedIn || !user) {
    // Nếu cố truy cập trang quản lý mà chưa đăng nhập -> 403
    if (
      location.pathname.startsWith("/admin") ||
      location.pathname.startsWith("/staff") ||
      location.pathname.startsWith("/manager") ||
      location.pathname.startsWith("/inspector")
    ) {
      return <Navigate to="/403" replace />;
    }
    // Các trang khác -> về trang chủ
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

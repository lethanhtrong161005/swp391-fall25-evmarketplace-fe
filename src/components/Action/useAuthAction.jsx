import React from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { useState } from "react";
import { hasDashboardAccess, getDashboardPath } from "@config/roles";
import {
  UserOutlined,
  HeartOutlined,
  HistoryOutlined,
  LogoutOutlined,
  DashboardOutlined,
} from "@ant-design/icons";

export const useAuthAction = ({ isLoggedIn, user, login, logout }) => {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [redirectAfterLogin, setRedirectAfterLogin] = useState(null);
  const [openLogin, setOpenLogin] = useState(false);

  const handleLoginSubmit = async (dto) => {
    const result = await login(dto);
    if (!result) return false;

    setTimeout(() => {
      if (redirectAfterLogin) {
        navigate(redirectAfterLogin, { replace: true });
        setRedirectAfterLogin(null);
      } else {
        navigate("/", { replace: true });
      }
    });
    return true;
  };

  const handleLoginRequire = (path, messageText) => {
    if (isLoggedIn) {
      navigate(path);
    } else {
      setRedirectAfterLogin(path);
      messageApi.info(messageText);
      setOpenLogin(true);
    }
  };

  const getMenuItems = () => {
    const items = [];

    // Dashboard section for roles with dashboard access
    if (hasDashboardAccess(user?.role)) {
      const dashboardPath = getDashboardPath(user?.role);
      if (dashboardPath) {
        items.push({
          key: "dashboard",
          label: (
            <span
              style={{ display: "flex", alignItems: "center", gap: "12px" }}
            >
              <DashboardOutlined />
              Dashboard
            </span>
          ),
          path: dashboardPath,
        });
      }
    }

    // Personal section
    items.push(
      {
        key: "profile",
        label: (
          <span style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <UserOutlined />
            Hồ sơ
          </span>
        ),
        path: "/info-user",
      },
      {
        key: "favorites",
        label: (
          <span style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <HeartOutlined />
            Tin đăng đã lưu
          </span>
        ),
        path: "/my-favorites",
      },
      {
        key: "history-transaction",
        label: (
          <span style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <HistoryOutlined />
            Lịch sử giao dịch
          </span>
        ),
        path: "/history/transactions",
      }
    );

    // Logout section
    items.push({
      key: "logout",
      label: (
        <span style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <LogoutOutlined />
          Đăng xuất
        </span>
      ),
      danger: true,
    });

    return items;
  };

  const handleMenuClick = async ({ key }) => {
    if (key === "dashboard") {
      const path = getDashboardPath(user?.role);
      if (path) navigate(path);
    } else if (key === "profile") {
      navigate("/info-user");
    } else if (key === "favorites") {
      navigate("/my-favorites");
    } else if (key === "history-transaction") {
      navigate("/history/transactions");
    } else if (key === "logout") {
      await logout();
    }
  };

  return {
    isLoggedIn,
    user,
    contextHolder,
    messageApi,
    openLogin,
    setOpenLogin,
    redirectAfterLogin,
    setRedirectAfterLogin,
    handleLoginSubmit,
    handleLoginRequire,
    getMenuItems,
    handleMenuClick,
    login,
    logout,
  };
};

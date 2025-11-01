import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { useState } from "react";
import { hasDashboardAccess, getDashboardPath } from "@config/roles";
import {
  UserOutlined,
  HeartOutlined,
  HistoryOutlined,
  ClockCircleOutlined,
  SettingOutlined,
  LogoutOutlined,
  DashboardOutlined,
  RightOutlined,
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
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <DashboardOutlined />
                Dashboard
              </span>
              <RightOutlined className="profile-menu-arrow" />
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
          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{ display: "flex", alignItems: "center", gap: "12px" }}
            >
              <UserOutlined />
              Hồ sơ
            </span>
            <RightOutlined className="profile-menu-arrow" />
          </span>
        ),
        path: "/info-user",
      },
      {
        key: "favorites",
        label: (
          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{ display: "flex", alignItems: "center", gap: "12px" }}
            >
              <HeartOutlined />
              Tin đăng đã lưu
            </span>
            <RightOutlined className="profile-menu-arrow" />
          </span>
        ),
        path: "/my-favorites",
      },
      {
        key: "history-view",
        label: (
          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{ display: "flex", alignItems: "center", gap: "12px" }}
            >
              <ClockCircleOutlined />
              Lịch sử xem tin
            </span>
            <RightOutlined className="profile-menu-arrow" />
          </span>
        ),
        path: "/history/view",
      },
      {
        key: "history-transaction",
        label: (
          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{ display: "flex", alignItems: "center", gap: "12px" }}
            >
              <HistoryOutlined />
              Lịch sử giao dịch
            </span>
            <RightOutlined className="profile-menu-arrow" />
          </span>
        ),
        path: "/history/transactions",
      }
    );

    // Settings section
    items.push({
      key: "settings",
      label: (
        <span
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <SettingOutlined />
            Cài đặt tài khoản
          </span>
          <RightOutlined className="profile-menu-arrow" />
        </span>
      ),
      path: "/settings",
    });

    // Logout section
    items.push({
      key: "logout",
      label: (
        <span
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <LogoutOutlined />
            Đăng xuất
          </span>
          <RightOutlined className="profile-menu-arrow" />
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
    } else if (key === "history-view") {
      navigate("/history/view");
    } else if (key === "history-transaction") {
      navigate("/history/transactions");
    } else if (key === "settings") {
      navigate("/settings");
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

import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { useState } from "react";
import { hasDashboardAccess, getDashboardPath } from "@config/roles";

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
    const items = [{ key: "infouser", label: "Hồ sơ", path: "/infouser" }];
    if (hasDashboardAccess(user?.role)) {
      const dashboardPath = getDashboardPath(user?.role);
      if (dashboardPath)
        items.unshift({
          key: "dashboard",
          label: "Dashboard",
          path: dashboardPath,
        });
    }
    items.push({ key: "logout", label: "Đăng xuất" });
    return items;
  };

  const handleMenuClick = async ({ key }) => {
    if (key === "dashboard") {
      const path = getDashboardPath(user?.role);
      if (path) navigate(path);
    } else if (key === "infouser") {
      navigate("/info-user");
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

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

    let items = [
      { key: "infouser", label: "Hồ sơ", path: "/info-user" },
      { key: "order", label: "Đơn hàng", path: "/my-order" }
    ];

    if (user?.role !== "member") {
      items = items.filter(i => i.key !== "order");
    }

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

  const handleMenuClick = async ({ key, domEvent }) => {
    domEvent?.stopPropagation?.();
    if (key === "logout") {
      await logout();
      return;
    }

    const item = getMenuItems().find((i) => i.key === key);
    if (item?.path) navigate(item.path);
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

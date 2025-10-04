import React from "react";
import { theme } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export function useStaffLayout() {
  const { token } = theme.useToken();
  const { user, logout: rawLogout } = useAuth();
  const nav = useNavigate();
  const { pathname } = useLocation();

  const selectedKey = React.useMemo(() => {
    if (pathname.startsWith("/staff/listings")) return "listings";
    if (pathname.startsWith("/staff")) return "dashboard";
    return "dashboard";
  }, [pathname]);

  const headerTitle = React.useMemo(() => {
    if (pathname.startsWith("/staff/listings")) return "Quản lý bài đăng";
    return "Bảng điều khiển";
  }, [pathname]);

  const [notifications] = React.useState([
    { id: 1, title: "Có 1 tin chờ duyệt", time: "10:35 hôm nay" },
    { id: 2, title: "Tin #100123 vừa cập nhật", time: "Hôm qua" },
  ]);
  const [notiOpen, setNotiOpen] = React.useState(false);

  const openNoti = () => setNotiOpen(true);
  const closeNoti = () => setNotiOpen(false);
  const goProfile = () => nav("/info-user");
  const logout = async () => {
    try {
      await rawLogout();
    } finally {
      nav("/");
    }
  };

  return {
    token,
    user,
    selectedKey,
    headerTitle,
    notifications,
    notiOpen,
    openNoti,
    closeNoti,
    goProfile,
    logout,
  };
}

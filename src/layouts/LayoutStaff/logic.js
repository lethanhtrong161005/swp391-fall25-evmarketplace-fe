import React from "react";
import { theme } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@hooks/useUserProfile";

export function useStaffLayout() {
  const { token } = theme.useToken();
  const { logout: rawLogout } = useAuth();
  const { user: enhancedUser } = useUserProfile(); // Use enhanced user data
  const nav = useNavigate();
  const { pathname } = useLocation();

  const selectedKey = React.useMemo(() => {
    if (pathname.startsWith("/staff/listings")) return "listings";
    if (pathname.startsWith("/staff")) return "dashboard";
    return "dashboard";
  }, [pathname]);

  const headerTitle = React.useMemo(() => {
    // Bỏ title ở header để tránh trùng lặp với title trong content
    return "";
  }, []);

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
    user: enhancedUser, // Return enhanced user with profile data
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

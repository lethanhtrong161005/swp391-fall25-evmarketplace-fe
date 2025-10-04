import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export function useLayoutAdmin() {
  const [notiOpen, setNotiOpen] = useState(false);
  const nav = useNavigate();
  const { pathname } = useLocation();
  const { user, logout } = useAuth();

  // Chọn menu theo path
  const selected = (() => {
    if (pathname.startsWith("/admin/accounts")) return "accounts";
    if (pathname.startsWith("/admin")) return "dashboard";
    return "dashboard";
  })();

  // Get header title based on current route
  const getHeaderTitle = () => {
    if (pathname.startsWith("/admin/accounts")) return "Quản lý tài khoản";
    if (pathname === "/admin") return "Bảng điều khiển Admin";
    return "Admin Panel";
  };

  // Mock thông báo – sau nối BE/WS
  const notifications = [
    { id: 1, title: "Tài khoản mới được tạo", time: "5 phút trước" },
    { id: 2, title: "Báo cáo doanh thu tuần", time: "1 giờ trước" },
    { id: 3, title: "Cập nhật hệ thống", time: "2 giờ trước" },
  ];

  const handleMenuClick = ({ key }) => {
    if (key === "dashboard") nav("/admin");
    if (key === "accounts") nav("/admin/accounts");
  };

  const handleProfileClick = () => {
    // TODO: Implement profile modal or navigation
    console.log("Profile clicked");
  };

  const handleLogout = () => {
    logout();
    nav("/");
  };

  return {
    notiOpen,
    setNotiOpen,
    selected,
    headerTitle: getHeaderTitle(),
    notifications,
    user,
    handleMenuClick,
    handleProfileClick,
    handleLogout,
  };
}

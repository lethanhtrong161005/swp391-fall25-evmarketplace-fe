import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@hooks/useUserProfile";
import { useSidebarMenu } from "./SidebarMenu/logic";

export function useLayoutAdmin() {
  const [notiOpen, setNotiOpen] = useState(false);
  const nav = useNavigate();
  const { pathname } = useLocation();
  const { logout } = useAuth();
  const { user: enhancedUser } = useUserProfile(); // Use enhanced user data

  // 🔹 Lấy menuItems từ SidebarMenu
  const { menuItems } = useSidebarMenu({});

  // 🔹 Hàm đệ quy tìm path theo key
  const findPathByKey = (items, targetKey) => {
    for (const item of items) {
      if (item.key === targetKey && item.path) return item.path;
      if (item.children) {
        const found = findPathByKey(item.children, targetKey);
        if (found) return found;
      }
    }
    return null;
  };

  // 🔹 Tự động detect key đang selected theo URL
  const selected = (() => {
    const findKeyByPath = (items, currentPath) => {
      for (const item of items) {
        if (item.path && currentPath.startsWith(item.path)) return item.key;
        if (item.children) {
          const found = findKeyByPath(item.children, currentPath);
          if (found) return found;
        }
      }
      return "dashboard";
    };
    return findKeyByPath(menuItems, pathname);
  })();

  // Get header title based on current route
  const getHeaderTitle = () => {
    // Bỏ title ở header để tránh trùng lặp với title trong content
    return "";
  };

  // Mock thông báo – sau nối BE/WS
  const notifications = [
    { id: 1, title: "Tài khoản mới được tạo", time: "5 phút trước" },
    { id: 2, title: "Báo cáo doanh thu tuần", time: "1 giờ trước" },
    { id: 3, title: "Cập nhật hệ thống", time: "2 giờ trước" },
  ];

  const handleMenuClick = ({ key }) => {
    const path = findPathByKey(menuItems, key);
    if (path) nav(path);
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
    user: enhancedUser, // Return enhanced user with profile data
    handleMenuClick,
    handleProfileClick,
    handleLogout,
  };
}

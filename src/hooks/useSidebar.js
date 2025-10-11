import { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { theme } from "antd";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@hooks/useUserProfile";

// Custom hook để quản lý logic chung cho sidebar
export function useSidebar({
  menuItems = [],
  notifications = [],
  profilePath = "/info-user",
  homePath = "/",
}) {
  const [notiOpen, setNotiOpen] = useState(false);
  const nav = useNavigate();
  const { pathname } = useLocation();
  const { logout } = useAuth();
  const { user: enhancedUser } = useUserProfile();
  const { token } = theme.useToken();

  // Tìm selected key dựa trên pathname (ưu tiên khớp chính xác và đường dẫn dài nhất)
  const findSelectedKey = useMemo(() => {
    return (items, path) => {
      let bestMatch = { key: menuItems[0]?.key || "dashboard", len: -1 };

      const traverse = (arr) => {
        for (const item of arr) {
          if (item.path) {
            const isExact = item.path === path;
            const isPrefix =
              !isExact && item.path !== "/" && path.startsWith(item.path);
            if (isExact || isPrefix) {
              const currLen = item.path.length;
              if (currLen > bestMatch.len) {
                bestMatch = { key: item.key, len: currLen };
              }
            }
          }
          if (item.children) traverse(item.children);
        }
      };

      traverse(items);
      return bestMatch.key;
    };
  }, [menuItems]);

  const selectedKeys = useMemo(
    () => [findSelectedKey(menuItems, pathname)],
    [findSelectedKey, menuItems, pathname]
  );

  // Tìm open keys cho submenu
  const findOpenKeys = useMemo(
    () => (items, path) => {
      const openKeys = [];
      for (const item of items) {
        if (item.children) {
          const hasSelectedChild = item.children.some(
            (child) => path.startsWith(child.path) || child.path === path
          );
          if (hasSelectedChild) {
            openKeys.push(item.key);
          }
        }
      }
      return openKeys;
    },
    []
  );

  const defaultOpenKeys = useMemo(
    () => findOpenKeys(menuItems, pathname),
    [findOpenKeys, menuItems, pathname]
  );

  const handleMenuClick = ({ key }) => {
    // Tìm item có key tương ứng trong menuItems
    const findItem = (items, targetKey) => {
      for (const item of items) {
        if (item.key === targetKey) return item;
        if (item.children) {
          const found = findItem(item.children, targetKey);
          if (found) return found;
        }
      }
      return null;
    };

    const item = findItem(menuItems, key);
    if (item && item.path) {
      nav(item.path);
    }
  };

  const handleProfileClick = () => {
    nav(profilePath);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      nav(homePath);
    }
  };

  const openNotification = () => setNotiOpen(true);
  const closeNotification = () => setNotiOpen(false);

  return {
    // State
    notiOpen,

    // Data
    user: enhancedUser,
    token,
    menuItems,
    selectedKeys,
    defaultOpenKeys,
    notifications,

    // Handlers
    handleMenuClick,
    handleProfileClick,
    handleLogout,
    openNotification,
    closeNotification,
  };
}

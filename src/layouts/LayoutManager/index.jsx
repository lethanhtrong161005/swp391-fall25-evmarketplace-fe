import React from "react";
import { Outlet } from "react-router-dom";
import { Layout, theme } from "antd";
import Sidebar from "@components/Sidebar";
import { useAuth } from "@hooks/useAuth";
import { ROLES } from "@config/roles";
import { useLayoutManager } from "./logic";
import "./LayoutManager.scss";

const LayoutManager = () => {
  const { user } = useAuth();
  const { token } = theme.useToken();
  const {
    menuItems,
    selectedKeys,
    defaultOpenKeys,
    notifications,
    handleMenuClick,
    handleProfileClick,
    handleLogout,
    handleOpenNotification,
  } = useLayoutManager();

  if (user?.role !== ROLES.MANAGER) {
    return <div>Không có quyền truy cập</div>;
  }

  return (
    <div className="manager-layout">
      <aside className="sidebar">
        <Sidebar
          width={260}
          theme="light"
          token={token}
          user={user}
          menuItems={menuItems}
          selectedKeys={selectedKeys}
          defaultOpenKeys={defaultOpenKeys}
          onMenuClick={handleMenuClick}
          onProfileClick={handleProfileClick}
          onLogout={handleLogout}
          onOpenNotification={handleOpenNotification}
        />
      </aside>

      <main className="content">
        <Outlet />
      </main>
    </div>
  );
};

export default LayoutManager;

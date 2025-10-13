import React from "react";
import { Outlet } from "react-router-dom";
import { Layout, theme } from "antd";
import Sidebar from "@components/Sidebar";
import { useAuth } from "@hooks/useAuth";
import { ROLES } from "@config/roles";
import { useLayoutManager } from "./logic";

const { Content } = Layout;

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

  // Kiểm tra quyền truy cập
  if (user?.role !== ROLES.MANAGER) {
    return <div>Không có quyền truy cập</div>;
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
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
      <Layout>
        <Content
          style={{ margin: 0, padding: 0, background: token.colorBgLayout }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default LayoutManager;

import React from "react";
import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import s from "./LayoutAdmin.module.scss";
import { useLayoutAdmin } from "./logic.jsx";
import Sidebar from "@components/Sidebar";
import NotificationDrawer from "@components/Sidebar/NotificationDrawer";

const { Content } = Layout;

// Admin layout with reusable sidebar + content
export default function LayoutAdmin() {
  const sidebarProps = useLayoutAdmin();

  return (
    <Layout className={s.layout}>
      <Sidebar
        width={260}
        {...sidebarProps}
        onMenuClick={sidebarProps.handleMenuClick}
        onProfileClick={sidebarProps.handleProfileClick}
        onLogout={sidebarProps.handleLogout}
        onOpenNotification={sidebarProps.openNotification}
      />

      <Content className={s.content}>
        <Outlet />
      </Content>

      <NotificationDrawer
        open={sidebarProps.notiOpen}
        onClose={sidebarProps.closeNotification}
        data={sidebarProps.notifications}
      />
    </Layout>
  );
}

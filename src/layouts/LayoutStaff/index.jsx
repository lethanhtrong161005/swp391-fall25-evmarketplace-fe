import React from "react";
import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import s from "./styles.module.scss";
import { useStaffLayout } from "./logic.jsx";
import Sidebar from "@components/Sidebar";
import NotificationDrawer from "@components/Sidebar/NotificationDrawer";

const { Content } = Layout;

// Staff layout shares the same sidebar pattern as Admin
export default function LayoutStaff() {
  const sidebarProps = useStaffLayout();

  return (
    <Layout className={s.root}>
      <Sidebar
        width={240}
        theme="light"
        {...sidebarProps}
        onMenuClick={sidebarProps.handleMenuClick}
        onProfileClick={sidebarProps.handleProfileClick}
        onLogout={sidebarProps.handleLogout}
        onOpenNotification={sidebarProps.openNotification}
      />

      <Content
        className={s.content}
        style={{ background: sidebarProps.token?.colorBgLayout }}
      >
        <div className={s.inner}>
          <Outlet />
        </div>
      </Content>

      <NotificationDrawer
        open={sidebarProps.notiOpen}
        onClose={sidebarProps.closeNotification}
        data={sidebarProps.notifications}
      />
    </Layout>
  );
}
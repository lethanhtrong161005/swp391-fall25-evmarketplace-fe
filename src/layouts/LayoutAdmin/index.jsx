import React from "react";
import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import s from "./LayoutAdmin.module.scss";
import { useLayoutAdmin } from "./logic.jsx";
import Sidebar from "@components/Sidebar";

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
      />

      <Content className={s.content}>
        <Outlet />
      </Content>
    </Layout>
  );
}

import React from "react";
import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import s from "./styles.module.scss";
import { useModeratorLayout } from "./logic.jsx";
import Sidebar from "@components/Sidebar";

const { Content } = Layout;

export default function LayoutModerator() {
  const sidebarProps = useModeratorLayout();

  return (
    <Layout className={s.root}>
      <Sidebar
        width={240}
        theme="light"
        {...sidebarProps}
        onMenuClick={sidebarProps.handleMenuClick}
        onProfileClick={sidebarProps.handleProfileClick}
        onLogout={sidebarProps.handleLogout}
      />

      <Content
        className={s.content}
        style={{ background: sidebarProps.token?.colorBgLayout }}
      >
        <div className={s.inner}>
          <Outlet />
        </div>
      </Content>
    </Layout>
  );
}

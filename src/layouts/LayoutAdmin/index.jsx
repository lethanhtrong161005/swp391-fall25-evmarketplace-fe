import React from "react";
import { Layout, theme } from "antd";
import { Outlet } from "react-router-dom";
import s from "./LayoutAdmin.module.scss";
import { useLayoutAdmin } from "./logic";

import SidebarBrand from "./SidebarBrand";
import SidebarProfile from "./SidebarProfile";
import SidebarMenu from "./SidebarMenu";
import SidebarBottomActions from "./SidebarBottomActions";
import NotificationDrawer from "./NotificationDrawer";

const { Sider, Header, Content } = Layout;

/**
 * Layout chính cho trang Admin - bao gồm sidebar và content area
 */
export default function LayoutAdmin() {
  const {
    notiOpen,
    setNotiOpen,
    selected,
    notifications,
    user,
    handleMenuClick,
    handleProfileClick,
    handleLogout,
  } = useLayoutAdmin();

  const { token } = theme.useToken();

  return (
    <Layout className={s.layout}>
      <Sider width={260} className={s.sider}>
        <div className={s.sidebarContent}>
          <SidebarBrand borderColor={token.colorBorderSecondary} />
          <SidebarProfile user={user} onClick={handleProfileClick} />
          <div className={s.menuContainer}>
            <SidebarMenu
              selected={selected}
              onClick={handleMenuClick}
              token={token}
            />
          </div>
        </div>
        <SidebarBottomActions
          onOpenNoti={() => setNotiOpen(true)}
          onLogout={handleLogout}
        />
      </Sider>

      {/* Bỏ hẳn Header component */}
      <Content className={s.content}>
        <Outlet />
      </Content>

      <NotificationDrawer
        open={notiOpen}
        onClose={() => setNotiOpen(false)}
        data={notifications}
      />
    </Layout>
  );
}

import React from "react";
import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import s from "./styles.module.scss";
import { useStaffLayout } from "./logic";

import SidebarBrand from "@layouts/LayoutAdmin/SidebarBrand";
import SidebarProfile from "@layouts/LayoutAdmin/SidebarProfile";
import SidebarBottomActions from "@layouts/LayoutAdmin/SidebarBottomActions";
import NotificationDrawer from "@layouts/LayoutAdmin/NotificationDrawer";
import StaffMenu from "./StaffMenu";

const { Sider, Header, Content } = Layout;

export default function LayoutStaff() {
  const {
    token,
    user,
    selectedKey,
    headerTitle,
    notifications,
    notiOpen,
    openNoti,
    closeNoti,
    goProfile,
    logout,
  } = useStaffLayout();

  return (
    <Layout className={s.root}>
      <Sider
        theme="light"
        width={240}
        trigger={null}
        className={s.sider}
        style={{
          background: token.colorBgContainer,
          borderRight: `1px solid ${token.colorBorderSecondary}`,
        }}
      >
        <SidebarBrand borderColor={token.colorBorderSecondary} />
        <SidebarProfile user={user} onClick={goProfile} />
        <StaffMenu selected={selectedKey} />
        <SidebarBottomActions onOpenNoti={openNoti} onLogout={logout} />
      </Sider>

      <Layout className={s.main}>
        <Header
          className={s.header}
          style={{
            background: "#fff",
            borderBottom: `1px solid ${token.colorBorderSecondary}`,
          }}
        >
          {headerTitle}
        </Header>
        <Content
          className={s.content}
          style={{ background: token.colorBgLayout }}
        >
          <div className={s.inner}>
            <Outlet />
          </div>
        </Content>
      </Layout>

      <NotificationDrawer
        open={notiOpen}
        onClose={closeNoti}
        data={notifications}
      />
    </Layout>
  );
}

import React from "react";
import { Layout } from "antd";
import SidebarBrand from "./SidebarBrand";
import SidebarProfile from "./SidebarProfile";
import SidebarMenu from "./SidebarMenu";
import SidebarBottomActions from "./SidebarBottomActions";
import s from "./Sidebar.module.scss";

const { Sider } = Layout;

// Sidebar component có thể tái sử dụng cho tất cả các role
export default function Sidebar({
  width = 260,
  theme = "light",
  token,
  user,
  menuItems = [],
  selectedKeys = [],
  defaultOpenKeys = [],
  onMenuClick,
  onProfileClick,
  onLogout,
  onOpenNotification,
  className,
  style,
  children,
}) {
  const siderStyle = {
    background: token?.colorBgContainer,
    borderRight: `1px solid ${token?.colorBorderSecondary}`,
    ...style,
  };

  return (
    <Sider
      width={width}
      theme={theme}
      trigger={null}
      className={`${s.sider} ${className || ""}`}
      style={siderStyle}
    >
      <div className={s.sidebarContent}>
        <SidebarBrand borderColor={token?.colorBorderSecondary} />
        <SidebarProfile user={user} onClick={onProfileClick} />
        <div className={s.menuContainer}>
          <SidebarMenu
            menuItems={menuItems}
            selectedKeys={selectedKeys}
            defaultOpenKeys={defaultOpenKeys}
            onClick={onMenuClick}
            token={token}
          />
          {children}
        </div>
      </div>
      <SidebarBottomActions
        onOpenNoti={onOpenNotification}
        onLogout={onLogout}
      />
    </Sider>
  );
}

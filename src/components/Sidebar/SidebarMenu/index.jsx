import React from "react";
import { Menu, ConfigProvider } from "antd";
import { useSidebarMenu } from "./logic";
import s from "./SidebarMenu.module.scss";

export default function SidebarMenu({
  menuItems = [],
  selectedKeys = [],
  defaultOpenKeys = [],
  onClick,
  token,
}) {
  const { menuConfig } = useSidebarMenu(token);

  const buildMenuItems = (items) =>
    items.map((item) => ({
      key: item.key,
      icon: item.icon,
      label: item.label,
      children: item.children ? buildMenuItems(item.children) : undefined,
    }));

  return (
    <ConfigProvider theme={{ components: { Menu: menuConfig } }}>
      <Menu
        mode="inline"
        selectedKeys={selectedKeys}
        defaultOpenKeys={defaultOpenKeys}
        onClick={onClick}
        className={s.sidebarMenu}
        style={{ background: "transparent", borderInlineEnd: 0, padding: 8 }}
        items={buildMenuItems(menuItems)}
      />
    </ConfigProvider>
  );
}

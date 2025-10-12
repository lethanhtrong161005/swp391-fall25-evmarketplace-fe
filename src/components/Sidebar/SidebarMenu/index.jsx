import React from "react";
import { Menu, ConfigProvider } from "antd";
import { useSidebarMenu } from "./logic";

export default function SidebarMenu({
  menuItems = [],
  selectedKeys = [],
  defaultOpenKeys = [],
  onClick,
  token,
}) {
  const { menuConfig } = useSidebarMenu(token);

  return (
    <ConfigProvider theme={{ components: { Menu: menuConfig } }}>
      <Menu
        mode="inline"
        selectedKeys={selectedKeys}
        defaultOpenKeys={defaultOpenKeys}
        onClick={onClick}
        style={{ background: "transparent", borderInlineEnd: 0, padding: 8 }}
        items={menuItems}
      />
    </ConfigProvider>
  );
}

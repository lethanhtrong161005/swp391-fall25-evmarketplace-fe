import React from "react";
import { Menu, ConfigProvider } from "antd";
import { useSidebarMenu } from "./logic";

export default function SidebarMenu({ selected, onClick, token }) {
  const { menuConfig, menuItems } = useSidebarMenu(token);

  return (
    <ConfigProvider theme={{ components: { Menu: menuConfig } }}>
      <Menu
        mode="inline"
        selectedKeys={[selected]}
        onClick={onClick}
        style={{ background: "transparent", borderInlineEnd: 0, padding: 8 }}
        items={menuItems}
      />
    </ConfigProvider>
  );
}

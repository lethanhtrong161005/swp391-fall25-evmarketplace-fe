import React from "react";
import { Menu, ConfigProvider } from "antd";
import {
  DashboardOutlined,
  TeamOutlined,
  DatabaseOutlined,
} from "@ant-design/icons";

export default function SidebarMenu({ selected, onClick, token }) {
  return (
    <ConfigProvider
      theme={{
        components: {
          Menu: {
            itemHeight: 42,
            itemMarginBlock: 6,
            itemMarginInline: 8,
            itemBorderRadius: 10, // pill
            itemSelectedColor: token.colorPrimaryBg,
            itemSelectedBg: token.colorPrimary,
            itemHoverBg: token.colorFillTertiary,
          },
        },
      }}
    >
      <Menu
        mode="inline"
        selectedKeys={[selected]}
        onClick={onClick}
        style={{ background: "transparent", borderInlineEnd: 0, padding: 8 }}
        items={[
          { key: "dashboard", icon: <DashboardOutlined />, label: "Dashboard" },
          {
            key: "accounts",
            icon: <TeamOutlined />,
            label: "Quản lý tài khoản",
          },
          {
            key: "listings",
            icon: <DatabaseOutlined />,
            label: "Quản lý bài đăng",
          },
        ]}
      />
    </ConfigProvider>
  );
}

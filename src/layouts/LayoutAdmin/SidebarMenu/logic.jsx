import React from "react";
import { DashboardOutlined, TeamOutlined } from "@ant-design/icons";

export function useSidebarMenu(token) {
  const menuConfig = {
    itemHeight: 42,
    itemMarginBlock: 6,
    itemMarginInline: 8,
    itemBorderRadius: 10, // pill
    itemSelectedColor: token.colorPrimaryBg,
    itemSelectedBg: token.colorPrimary,
    itemHoverBg: token.colorFillTertiary,
  };

  const menuItems = [
    {
      key: "dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
    },
    {
      key: "accounts",
      icon: <TeamOutlined />,
      label: "Quản lý tài khoản",
    },
  ];

  return {
    menuConfig,
    menuItems,
  };
}

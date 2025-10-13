import React from "react";
import {
  DashboardOutlined,
  TeamOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";

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
      path: "/admin",
    },
    {
      key: "accounts",
      icon: <TeamOutlined />,
      label: "Quản lý tài khoản",
      path: "/admin/accounts",
    },
    {
      key: "product-management",
      icon: <AppstoreOutlined />,
      label: "Quản lý sản phẩm",
      children: [
        {
          key: "category",
          label: "Quản lý danh mục",
          path: "/admin/product/category",
        },

        {
          key: "brand",
          label: "Quản lý thương hiệu",
          path: "/admin/product/brand",
        },

        {
          key: "model",
          label: "Quản lý mẫu mã",
          path: "/admin/product/model",
        },
        {
          key: "vehicle",
          label: "Quản lý phương tiện",
          path: "/admin/product/vehicle",
        },
        {
          key: "battery",
          label: "Quản lý pin",
          path: "/admin/product/battery",
        },
      ],
    },
  ];

  return {
    menuConfig,
    menuItems,
  };
}

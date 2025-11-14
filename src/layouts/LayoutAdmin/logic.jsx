import {
  TeamOutlined,
  AppstoreOutlined,
  CarOutlined,
  ThunderboltOutlined,
  TagsOutlined,
  CrownOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { useSidebar } from "@hooks/useSidebar";

export function useLayoutAdmin() {
  // Menu items configuration
  const menuItems = [
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
          icon: <TagsOutlined />,
          label: "Danh mục",
          path: "/admin/product/category",
        },
        {
          key: "brand",
          icon: <CrownOutlined />,
          label: "Thương hiệu",
          path: "/admin/product/brand",
        },
        {
          key: "model",
          icon: <SettingOutlined />,
          label: "Mẫu xe",
          path: "/admin/product/model",
        },
        {
          key: "vehicle",
          icon: <CarOutlined />,
          label: "Xe điện",
          path: "/admin/product/vehicle",
        },
        {
          key: "battery",
          icon: <ThunderboltOutlined />,
          label: "Pin xe điện",
          path: "/admin/product/battery",
        },
      ],
    },
  ];

  // Mock notifications - replace with real data
  const notifications = [
    { id: 1, title: "Có tài khoản mới đăng ký", time: "10:35 hôm nay" },
    { id: 2, title: "Cập nhật hệ thống", time: "Hôm qua" },
  ];

  const sidebarConfig = {
    menuItems,
    notifications,
    profilePath: "/info-user",
    homePath: "/",
  };

  return useSidebar(sidebarConfig);
}

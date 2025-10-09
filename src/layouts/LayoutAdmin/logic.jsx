import { DashboardOutlined, TeamOutlined } from "@ant-design/icons";
import { useSidebar } from "@hooks/useSidebar";

export function useLayoutAdmin() {
  // Menu items configuration
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

import {
  DashboardOutlined,
  TeamOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import { useSidebar } from "@hooks/useSidebar";

export function useLayoutManager() {
  // Menu items configuration cho Manager
  const menuItems = [
    {
      key: "dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
      path: "/manager",
    },
    {
      key: "staff-management",
      icon: <TeamOutlined />,
      label: "Quản lý nhân viên",
      path: "/manager/staff",
    },
    {
      key: "listing-management",
      icon: <FileTextOutlined />,
      label: "Quản lý tin đăng",
      path: "/manager/listings",
    },
    {
      key: "approval",
      icon: <CheckCircleOutlined />,
      label: "Duyệt tin đăng",
      path: "/manager/approval",
    },
    {
      key: "reports",
      icon: <BarChartOutlined />,
      label: "Báo cáo",
      path: "/manager/reports",
    },
  ];

  // Mock notifications - replace with real data
  const notifications = [
    { id: 1, title: "Có tin đăng mới cần duyệt", time: "10:35 hôm nay" },
    { id: 2, title: "Báo cáo tháng đã sẵn sàng", time: "Hôm qua" },
  ];

  const sidebarConfig = {
    menuItems,
    notifications,
    profilePath: "/info-user",
    homePath: "/",
  };

  return useSidebar(sidebarConfig);
}

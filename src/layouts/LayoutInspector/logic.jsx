import {
  DashboardOutlined,
  SearchOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  FileTextOutlined,
  AlertOutlined,
} from "@ant-design/icons";
import { useSidebar } from "@hooks/useSidebar";

export function useLayoutInspector() {
  // Menu items configuration cho Inspector (Kỹ thuật viên)
  const menuItems = [
    {
      key: "dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
      path: "/inspector",
    },
    {
      key: "inspections",
      icon: <SearchOutlined />,
      label: "Kiểm định xe",
      path: "/inspector/inspections",
    },
    {
      key: "vehicle-issues",
      icon: <CloseCircleOutlined />,
      label: "Lỗi kỹ thuật",
      path: "/inspector/vehicle-issues",
    },
    {
      key: "reports",
      icon: <FileTextOutlined />,
      label: "Báo cáo kỹ thuật",
      path: "/inspector/reports",
    },
    {
      key: "alerts",
      icon: <AlertOutlined />,
      label: "Cảnh báo",
      path: "/inspector/alerts",
    },
  ];

  // Mock notifications - replace with real data
  const notifications = [
    { id: 1, title: "Có xe mới cần kiểm định", time: "10:35 hôm nay" },
    { id: 2, title: "Báo cáo kỹ thuật cần xử lý", time: "Hôm qua" },
  ];

  const sidebarConfig = {
    menuItems,
    notifications,
    profilePath: "/info-user",
    homePath: "/",
  };

  return useSidebar(sidebarConfig);
}

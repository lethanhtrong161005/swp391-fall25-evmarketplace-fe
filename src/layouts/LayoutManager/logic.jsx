import {
  DashboardOutlined,
  TeamOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  BarChartOutlined,
  FileDoneOutlined,
} from "@ant-design/icons";
import { useSidebar } from "@hooks/useSidebar";

export function useLayoutManager() {
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
      key: "consignment",
      icon: <CheckCircleOutlined />,
      label: "Quản lí ký gửi ",
      path: "/manager/consignment",
      children: [
        {
          key: "consignment/management",
          label: "Danh sách ký gửi",
          path: "/manager/consignment/management",
        },
        {
          key: "consignment/assign",
          label: "Phân công yêu cầu",
          path: "/manager/consignment/assign",
        },
      ],
    },
    {
      key: "agreement",
      icon: <FileDoneOutlined />,
      label: "Danh sách hợp đồng",
      path: "/manager/agreement/management",
    },
    {
      key: "reports",
      icon: <BarChartOutlined />,
      label: "Báo cáo",
      path: "/manager/reports",
    },
  ];

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

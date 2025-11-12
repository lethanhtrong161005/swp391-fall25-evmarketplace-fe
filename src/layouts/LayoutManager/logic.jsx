import {
  TeamOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  BarChartOutlined,
  FileDoneOutlined,
  LineChartOutlined,
  DollarOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import { useSidebar } from "@hooks/useSidebar";

export function useLayoutManager() {
  const menuItems = [
    {
      key: "dashboard",
      icon: <BarChartOutlined />,
      label: "Dashboard",
      path: "/manager",
      children: [
        {
          key: "dashboard/transaction",
          icon: <LineChartOutlined />,
          label: "Báo cáo Giao Dịch",
          path: "/manager/dashboard/transaction",
        },
        {
          key: "dashboard/revenue",
          icon: <DollarOutlined />,
          label: "Báo cáo Doanh Thu",
          path: "/manager/dashboard/revenue",
        },
        {
          key: "dashboard/market",
          icon: <ShopOutlined />,
          label: "Báo cáo Thị Trường",
          path: "/manager/dashboard/market",
        },
      ],
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
  ];

  const sidebarConfig = {
    menuItems,
    profilePath: "/info-user",
    homePath: "/",
  };

  return useSidebar(sidebarConfig);
}

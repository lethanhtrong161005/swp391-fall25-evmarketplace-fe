import React from "react";
import { DashboardOutlined, FileTextOutlined } from "@ant-design/icons";
import { useSidebar } from "@hooks/useSidebar";

export function useStaffLayout() {
  // Menu items configuration for staff
  const menuItems = [
    {
      key: "dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
      path: "/staff",
    },
    {
      key: "listings",
      icon: <FileTextOutlined />,
      label: "Quản lý tin đăng",
      children: [
        {
          key: "all-listings",
          label: "Quản lý tất cả tin đăng",
          path: "/staff/listings",
        },
        {
          key: "approval-listings",
          label: "Quản lý duyệt bài",
          path: "/staff/approval",
        },
      ],
    },
  ];

  // Mock notifications for staff
  const notifications = [
    { id: 1, title: "Có 1 tin chờ duyệt", time: "10:35 hôm nay" },
    { id: 2, title: "Tin #100123 vừa cập nhật", time: "Hôm qua" },
  ];

  const sidebarConfig = {
    menuItems,
    notifications,
    profilePath: "/info-user",
    homePath: "/",
  };

  return useSidebar(sidebarConfig);
}

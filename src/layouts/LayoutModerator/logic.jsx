import React from "react";
import {
  DashboardOutlined,
  FileTextOutlined,
  HistoryOutlined,
} from "@ant-design/icons";
import { useSidebar } from "@hooks/useSidebar";

export function useModeratorLayout() {
  // Cấu hình menu cho moderator
  const menuItems = [
    {
      key: "dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
      path: "/moderator",
    },
    {
      key: "approval",
      icon: <FileTextOutlined />,
      label: "Tin đăng chờ duyệt",
      path: "/moderator/approval",
    },
    {
      key: "history",
      icon: <HistoryOutlined />,
      label: "Lịch sử duyệt",
      path: "/moderator/history",
    },
  ];

  // Thông báo mẫu cho moderator
  const notifications = [
    { id: 1, title: "Có 5 tin chờ duyệt", time: "10:35 hôm nay" },
    { id: 2, title: "Tin #100123 vừa được khóa", time: "Hôm qua" },
  ];

  const sidebarConfig = {
    menuItems,
    notifications,
    profilePath: "/info-user",
    homePath: "/",
  };

  return useSidebar(sidebarConfig);
}

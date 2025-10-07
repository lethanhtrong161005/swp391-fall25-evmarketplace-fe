import React from "react";
import { DashboardOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

export function useStaffMenu() {
  const nav = useNavigate();

  const menuItems = [
    {
      key: "dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
    },
    {
      key: "listings",
      icon: <UnorderedListOutlined />,
      label: "Quản lý bài đăng",
    },
  ];

  const handleMenuClick = ({ key }) => {
    if (key === "dashboard") nav("/staff");
    if (key === "listings") nav("/staff/listings");
  };

  return {
    menuItems,
    handleMenuClick,
  };
}

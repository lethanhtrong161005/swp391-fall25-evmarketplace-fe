import React from "react";
import { Menu } from "antd";
import {
  DashboardOutlined,
  FileTextOutlined,
  UserOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

export default function SidebarStaff() {
  const navigate = useNavigate();

  const menuItems = [
    { key: "dashboard", icon: <DashboardOutlined />, label: "Dashboard", path: "/staff" },
    { key: "posts", icon: <FileTextOutlined />, label: "Quản lý đăng tin", path: "/staff/listingmanagement" },
    { key: "account", icon: <UserOutlined />, label: "Tài khoản", path: "/staff/account" },
    { key: "settings", icon: <SettingOutlined />, label: "Cài đặt", path: "/staff/settings" },
  ];

  return (
    <>
      <div style={{ padding: 16, fontWeight: 700, fontSize: 18 }}>ReEV Staff</div>
      <Menu
        mode="inline"
        defaultSelectedKeys={["dashboard"]}
        onClick={(e) => {
          const item = menuItems.find((m) => m.key === e.key);
          if (item?.path) navigate(item.path);
        }}
        items={menuItems}
      />
    </>
  );
}

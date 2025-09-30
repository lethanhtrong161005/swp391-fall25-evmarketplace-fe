import React, { useMemo } from "react";
import { Menu, Dropdown, Space, Avatar } from "antd";
import {
  DashboardOutlined,
  FileTextOutlined,
  UserOutlined,
  SettingOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext"; // 👈 import từ chỗ bạn đặt AuthProvider

export default function SidebarStaff() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const menuItems = [
    { key: "dashboard", icon: <DashboardOutlined />, label: "Dashboard", path: "/staff" },
    { key: "posts", icon: <FileTextOutlined />, label: "Quản lý đăng tin", path: "/staff/listingmanagement" },
    { key: "account", icon: <UserOutlined />, label: "Tài khoản", path: "/staff/account" },
    { key: "settings", icon: <SettingOutlined />, label: "Cài đặt", path: "/staff/settings" },
  ];

  // Map path -> key để khi reload giữ menu đang chọn
  const currentKey = useMemo(() => {
    const found = menuItems.find((item) => location.pathname.startsWith(item.path));
    return found ? found.key : "dashboard";
  }, [location.pathname]);

  // Menu cho dropdown user
  const userMenu = {
    items: [
      {
        key: "profile",
        label: "Hồ sơ",
        onClick: () => navigate("/staff/info"),
      },
      {
        key: "logout",
        label: "Đăng xuất",
        onClick: () => {
          logout(); // 👈 gọi thẳng hàm logout trong AuthProvider
          navigate("/login");
        },
      },
    ],
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ padding: 16, fontWeight: 700, fontSize: 18 }}>ReEV Staff</div>

      <Menu
        mode="inline"
        selectedKeys={[currentKey]} // sync theo URL

        onClick={(e) => {
          const item = menuItems.find((m) => m.key === e.key);
          if (item?.path) navigate(item.path);
        }}
        items={menuItems}
        style={{ flex: 1 }}
      />

      {/* User info ở cuối sidebar */}
      <div style={{ padding: 16, borderTop: "1px solid #f0f0f0" }}>
        <Dropdown menu={userMenu} placement="topLeft" trigger={["click"]}>
          <Space style={{ cursor: "pointer" }}>
            <Avatar icon={<UserOutlined />} src={user?.avatar || null} />
            <span>{user?.fullName || user?.username || "Người dùng"}</span>
            <DownOutlined />
          </Space>
        </Dropdown>
      </div>
    </div>
  );
}

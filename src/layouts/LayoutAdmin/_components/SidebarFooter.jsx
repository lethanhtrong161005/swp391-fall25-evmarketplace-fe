import React from "react";
import { Space, Button, Badge, Dropdown, Avatar, Typography } from "antd";
import {
  BellOutlined,
  UserOutlined,
  LogoutOutlined,
  ProfileOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

export default function SidebarFooter({
  collapsed,
  token,
  notifications = [],
  user,
  onOpenNoti,
  onGoProfile,
  onLogout,
}) {
  const accountMenu = {
    items: [
      {
        key: "profile",
        icon: <ProfileOutlined />,
        label: "Hồ sơ",
        onClick: onGoProfile,
      },
      { type: "divider" },
      {
        key: "logout",
        danger: true,
        icon: <LogoutOutlined />,
        label: "Đăng xuất",
        onClick: onLogout,
      },
    ],
  };

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        padding: 12,
        borderTop: `1px solid ${token.colorBorderSecondary}`,
        background: token.colorBgContainer,
      }}
    >
      <Space style={{ width: "100%", justifyContent: "space-between" }}>
        <Badge count={notifications.length} size="small">
          <Button
            type="text"
            icon={<BellOutlined />}
            shape="circle"
            onClick={onOpenNoti}
            style={{ color: token.colorTextTertiary }}
          />
        </Badge>

        <Dropdown menu={accountMenu} trigger={["click"]} placement="topRight">
          <Space style={{ cursor: "pointer" }}>
            <Avatar size={collapsed ? 28 : 32} icon={<UserOutlined />} />
            {!collapsed && (
              <div style={{ lineHeight: 1 }}>
                <Text strong>{user?.name || "Admin User"}</Text>
                <br />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {user?.email || "admin@reev.com"}
                </Text>
              </div>
            )}
          </Space>
        </Dropdown>
      </Space>
    </div>
  );
}

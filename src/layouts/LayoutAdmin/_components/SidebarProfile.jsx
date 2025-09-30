import React from "react";
import { Avatar, Typography, Space } from "antd";
import { UserOutlined } from "@ant-design/icons";

const { Text } = Typography;

export default function SidebarProfile({ user, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: 16,
        cursor: "pointer",
        borderBottom: "1px solid rgba(5,5,5,0.06)",
      }}
    >
      <Space align="center">
        <Avatar size={40} icon={<UserOutlined />} />
        <div style={{ lineHeight: 1 }}>
          <Text strong>{user?.name || user?.sub || "Admin User"}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>
            {user?.email || "admin@reev.com"}
          </Text>
        </div>
      </Space>
    </div>
  );
}

import React from "react";
import { Space, Button, Badge, theme, Tooltip } from "antd";
import { BellOutlined, LogoutOutlined } from "@ant-design/icons";

export default function SidebarBottomActions({ onOpenNoti, onLogout }) {
  const { token } = theme.useToken();
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
        <Tooltip title="Thông báo">
          <Badge count={5} size="small">
            <Button
              type="text"
              shape="circle"
              icon={<BellOutlined />}
              onClick={onOpenNoti}
            />
          </Badge>
        </Tooltip>

        <Tooltip title="Đăng xuất">
          <Button
            type="text"
            danger
            icon={<LogoutOutlined />}
            onClick={onLogout}
          >
            Đăng xuất
          </Button>
        </Tooltip>
      </Space>
    </div>
  );
}

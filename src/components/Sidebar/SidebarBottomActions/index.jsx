import React from "react";
import { Space, Button, Badge, theme, Tooltip } from "antd";
import { BellOutlined, LogoutOutlined } from "@ant-design/icons";
import s from "./SidebarBottomActions.module.scss";
import { useSidebarBottomActions } from "./logic";

export default function SidebarBottomActions({ onOpenNoti, onLogout }) {
  const { token } = theme.useToken();
  const { notificationCount } = useSidebarBottomActions();

  return (
    <div
      className={s.bottomActions}
      style={{
        borderTop: `1px solid ${token.colorBorderSecondary}`,
        background: token.colorBgContainer,
      }}
    >
      <div className={s.actionsContainer}>
        <Tooltip title="Thông báo" placement="top">
          <Badge count={notificationCount} size="small">
            <Button
              type="text"
              size="large"
              shape="circle"
              icon={<BellOutlined style={{ fontSize: "16px" }} />}
              onClick={onOpenNoti}
              className={s.actionButton}
            />
          </Badge>
        </Tooltip>

        <Tooltip title="Đăng xuất" placement="top">
          <Button
            type="text"
            size="large"
            danger
            icon={<LogoutOutlined style={{ fontSize: "16px" }} />}
            onClick={onLogout}
            className={s.logoutButton}
          >
            Đăng xuất
          </Button>
        </Tooltip>
      </div>
    </div>
  );
}

import React from "react";
import { Button, theme, Tooltip } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import s from "./SidebarBottomActions.module.scss";

export default function SidebarBottomActions({ onLogout }) {
  const { token } = theme.useToken();

  return (
    <div
      className={s.bottomActions}
      style={{
        borderTop: `1px solid ${token.colorBorderSecondary}`,
        background: token.colorBgContainer,
      }}
    >
      <div className={s.actionsContainer}>
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

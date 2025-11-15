import React from "react";
import { Button, theme } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import s from "./SidebarBottomActions.module.scss";

export default function SidebarBottomActions({ onLogout }) {
  const { token } = theme.useToken();

  return (
    <div 
      className={s.bottomActions}
      style={{
        background: token?.colorPrimary || "#1B2A41", // Đồng bộ với màu primary của sidebar
      }}
    >
      <div className={s.actionsContainer}>
        <Button
          type="text"
          size="large"
          icon={<LogoutOutlined style={{ fontSize: "16px" }} />}
          onClick={onLogout}
          className={s.logoutButton}
        >
          Đăng xuất
        </Button>
      </div>
    </div>
  );
}

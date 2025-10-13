import React from "react";
import { Avatar, Typography, Space } from "antd";
import { UserOutlined } from "@ant-design/icons";
import s from "./SidebarProfile.module.scss";
import { useSidebarProfile } from "./logic";
import RoleLabel from "@components/RoleLabel";

const { Text } = Typography;

export default function SidebarProfile({ user, onClick }) {
  const { displayName, displayEmail, avatarUrl } = useSidebarProfile(user);

  return (
    <div onClick={onClick} className={s.profile}>
      <Space align="center">
        <Avatar
          size={40}
          src={avatarUrl}
          icon={<UserOutlined />}
          style={{
            backgroundColor: avatarUrl ? "transparent" : "#1890ff",
            border: avatarUrl ? "1px solid #d9d9d9" : "none",
          }}
        />
        <div className={s.userInfo}>
          <Text strong className={s.displayName}>
            {displayName}
          </Text>
          <br />
          <Text type="secondary" className={s.email}>
            {displayEmail}
          </Text>
          <br />
          <RoleLabel role={user?.role} size="small" />
        </div>
      </Space>
    </div>
  );
}

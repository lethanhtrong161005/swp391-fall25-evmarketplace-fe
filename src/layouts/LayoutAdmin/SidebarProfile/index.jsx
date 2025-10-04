import React from "react";
import { Avatar, Typography, Space } from "antd";
import { UserOutlined } from "@ant-design/icons";
import s from "./SidebarProfile.module.scss";
import { useSidebarProfile } from "./logic";

const { Text } = Typography;

export default function SidebarProfile({ user, onClick }) {
  const { displayName, displayEmail } = useSidebarProfile(user);

  return (
    <div onClick={onClick} className={s.profile}>
      <Space align="center">
        <Avatar size={40} icon={<UserOutlined />} />
        <div className={s.userInfo}>
          <Text strong>{displayName}</Text>
          <br />
          <Text type="secondary" className={s.email}>
            {displayEmail}
          </Text>
        </div>
      </Space>
    </div>
  );
}

import React from "react";
import { Avatar, Typography } from "antd";
import { UserOutlined, PhoneOutlined, MailOutlined } from "@ant-design/icons";
import s from "../AccountTable.module.scss";

const { Text } = Typography;

const UserCell = ({ record }) => (
  <div className={s.userCell}>
    <Avatar
      size={40}
      src={record.profile?.avatarUrl}
      icon={<UserOutlined />}
      className={s.avatar}
      style={{
        backgroundColor:
          record.role === "ADMIN"
            ? "#f5222d"
            : record.role === "MANAGER"
            ? "#1890ff"
            : record.role === "INSPECTOR"
            ? "#fa8c16"
            : record.role === "STAFF"
            ? "#52c41a"
            : record.role === "MEMBER"
            ? "#13c2c2"
            : "#d9d9d9",
      }}
    />
    <div className={s.userInfo}>
      <Text strong className={s.userName}>
        {record.profile?.fullName || record.phoneNumber}
      </Text>
      <div className={s.userDetails}>
        <Text type="secondary" className={s.userEmail}>
          <MailOutlined className={s.icon} />
          {record.email || "Chưa có email"}
        </Text>
        <Text type="secondary" className={s.userPhone}>
          <PhoneOutlined className={s.icon} />
          {record.phoneNumber}
        </Text>
      </div>
    </div>
  </div>
);

export default UserCell;

import React from "react";
import { Tag } from "antd";
import s from "../AccountTable.module.scss";

const RoleTag = ({ role }) => {
  const roleLabels = {
    ADMIN: "Quản trị viên",
    MANAGER: "Quản lý",
    INSPECTOR: "Kỹ thuật viên",
    STAFF: "Nhân viên",
    MEMBER: "Thành viên",
  };

  const roleColors = {
    ADMIN: "red",
    MANAGER: "blue",
    INSPECTOR: "orange",
    STAFF: "green",
    MEMBER: "cyan",
  };

  const label = roleLabels[role] || role;
  const color = roleColors[role] || "default";

  return (
    <Tag color={color} className={s.roleTag}>
      {label}
    </Tag>
  );
};

export default RoleTag;

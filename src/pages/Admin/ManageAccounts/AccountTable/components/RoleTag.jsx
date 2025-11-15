import React from "react";
import { Tag } from "antd";
import s from "../AccountTable.module.scss";

const RoleTag = ({ role }) => {
  const roleLabels = {
    ADMIN: "Quản trị viên",
    MANAGER: "Quản lý",
    INSPECTOR: "Kiểm định viên",
    STAFF: "Nhân viên",
    MODERATOR: "Kiểm duyệt viên",
    MEMBER: "Thành viên",
  };

  const roleColors = {
    ADMIN: "red",
    MANAGER: "blue",
    INSPECTOR: "orange",
    STAFF: "green",
    MODERATOR: "purple",
    MEMBER: "cyan",
  };

  // Normalize role về uppercase để match với keys
  const normalizedRole = role ? String(role).toUpperCase() : null;
  const label = normalizedRole ? (roleLabels[normalizedRole] || role) : role;
  const color = normalizedRole ? (roleColors[normalizedRole] || "default") : "default";

  return (
    <Tag color={color} className={s.roleTag}>
      {label}
    </Tag>
  );
};

export default RoleTag;

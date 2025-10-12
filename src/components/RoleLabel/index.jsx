import React from "react";
import { Tag } from "antd";
import { ROLES, ROLE_LABELS } from "@config/roles";

// Component hiển thị tên role bằng tiếng Việt
const RoleLabel = ({ role, color, size = "default", className }) => {
  const roleLabel = ROLE_LABELS[role] || role;

  // Màu mặc định theo role
  const getDefaultColor = (role) => {
    switch (role) {
      case ROLES.ADMIN:
        return "red";
      case ROLES.MANAGER:
        return "blue";
      case ROLES.INSPECTOR:
        return "orange";
      case ROLES.STAFF:
        return "green";
      case ROLES.MEMBER:
        return "cyan";
      case ROLES.GUEST:
        return "default";
      default:
        return "default";
    }
  };

  return (
    <Tag
      color={color || getDefaultColor(role)}
      size={size}
      className={className}
    >
      {roleLabel}
    </Tag>
  );
};

export default RoleLabel;

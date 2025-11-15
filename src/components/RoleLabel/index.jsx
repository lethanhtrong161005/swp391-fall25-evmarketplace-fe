import React from "react";
import { Tag } from "antd";
import { ROLES, ROLE_LABELS } from "@config/roles";

// Component hiển thị tên role bằng tiếng Việt
const RoleLabel = ({ role, color, size = "default", className }) => {
  // Normalize role về lowercase để match với ROLE_LABELS
  const normalizedRole = role ? String(role).toLowerCase() : null;
  const roleLabel = normalizedRole ? (ROLE_LABELS[normalizedRole] || role) : role;

  // Màu mặc định theo role
  const getDefaultColor = (role) => {
    if (!role) return "default";
    const normalized = String(role).toLowerCase();
    switch (normalized) {
      case ROLES.ADMIN:
        return "red";
      case ROLES.MANAGER:
        return "blue";
      case ROLES.INSPECTOR:
        return "orange";
      case ROLES.STAFF:
        return "green";
      case ROLES.MODERATOR:
        return "purple";
      case ROLES.MEMBER:
        return "cyan";
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

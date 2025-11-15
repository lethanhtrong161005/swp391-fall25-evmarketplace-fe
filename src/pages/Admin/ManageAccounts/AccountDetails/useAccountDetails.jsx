import { Tag } from "antd";

export function useAccountDetails() {
  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleString("vi-VN");
  };

  const getRoleTag = (role) => {
    const roleConfig = {
      ADMIN: { color: "red", text: "Quản trị viên" },
      MANAGER: { color: "blue", text: "Quản lý" },
      STAFF: { color: "green", text: "Nhân viên" },
      INSPECTOR: { color: "orange", text: "Kiểm định viên" },
      MODERATOR: { color: "purple", text: "Kiểm duyệt viên" },
      MEMBER: { color: "cyan", text: "Thành viên" },
    };
    
    // Normalize role về uppercase để match với keys
    const normalizedRole = role ? String(role).toUpperCase() : null;
    const config = normalizedRole ? (roleConfig[normalizedRole] || { color: "default", text: role }) : { color: "default", text: role };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const getStatusTag = (status) => {
    const statusConfig = {
      ACTIVE: { color: "success", text: "Hoạt động" },
      INACTIVE: { color: "default", text: "Không hoạt động" },
      BLOCKED: { color: "error", text: "Bị khóa" },
    };
    
    const config = statusConfig[status] || { color: "default", text: status };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  return {
    formatDate,
    getRoleTag,
    getStatusTag,
  };
}
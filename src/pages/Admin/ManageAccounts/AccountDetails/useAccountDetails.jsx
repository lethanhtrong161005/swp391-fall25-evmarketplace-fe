import { Tag } from "antd";

export function useAccountDetails() {
  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleString("vi-VN");
  };

  const getRoleTag = (role) => {
    const roleConfig = {
      ADMIN: { color: "red", text: "Quản trị viên" },
      STAFF: { color: "blue", text: "Nhân viên" },
      MEMBER: { color: "green", text: "Thành viên" },
    };
    
    const config = roleConfig[role] || { color: "default", text: role };
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
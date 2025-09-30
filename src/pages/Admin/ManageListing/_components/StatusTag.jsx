// src/pages/Admin/ManageListing/_components/StatusTag.jsx
import React from "react";
import { Tag } from "antd";

// value giữ nguyên theo DB, label hiển thị tiếng Việt
const MAP = {
  PENDING: { label: "Chờ duyệt", color: "gold" },
  APPROVED: { label: "Đã đăng", color: "green" },
  ACTIVE: { label: "Đang hoạt động", color: "green" },
  RESERVED: { label: "Giữ chỗ", color: "orange" },
  SOLD: { label: "Đã bán", color: "blue" },
  EXPIRED: { label: "Hết hạn", color: "default" },
  REJECTED: { label: "Từ chối", color: "red" },
  ARCHIVED: { label: "Lưu trữ", color: "default" },
};

export default function StatusTag({ status }) {
  const m = MAP[status] || { label: status, color: "default" };
  return (
    <Tag color={m.color} style={{ borderRadius: 999, paddingInline: 10 }}>
      {m.label}
    </Tag>
  );
}

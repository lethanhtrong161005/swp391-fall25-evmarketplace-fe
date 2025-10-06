// value giữ nguyên theo DB, label hiển thị tiếng Việt
const STATUS_MAP = {
  PENDING: { label: "Chờ duyệt", color: "gold" },
  APPROVED: { label: "Đã đăng", color: "green" },
  ACTIVE: { label: "Đang hoạt động", color: "green" },
  RESERVED: { label: "Giữ chỗ", color: "orange" },
  SOLD: { label: "Đã bán", color: "blue" },
  EXPIRED: { label: "Hết hạn", color: "default" },
  REJECTED: { label: "Từ chối", color: "red" },
  ARCHIVED: { label: "Lưu trữ", color: "default" },
};

export function useStatusTag(status) {
  const statusConfig = STATUS_MAP[status] || {
    label: status,
    color: "default",
  };

  return { statusConfig };
}

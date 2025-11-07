import { Modal, Descriptions, Tag } from "antd";
import { CATEGORIES } from "../../../../utils/constants";

export default function ChangeStatusModal({
  open,
  onCancel,
  onConfirm,
  record,
  newStatus,
  confirmLoading = false,
}) {
  if (!record) return null;

  const categoryLabel =
    CATEGORIES?.[record.categoryCode] ||
    record.categoryName ||
    "Không xác định";

  // Map màu và nhãn tiếng Việt (giống bảng)
  const colorMap = {
    PENDING: "gold",
    APPROVED: "blue",
    ACTIVE: "green",
    RESERVED: "geekblue",
    SOLD: "purple",
    EXPIRED: "volcano",
    REJECTED: "red",
    HIDDEN: "gray",
    SOFT_DELETED: "magenta",
  };

  const labelMap = {
    PENDING: "Chờ duyệt",
    APPROVED: "Đã duyệt",
    ACTIVE: "Đang hiển thị",
    RESERVED: "Đã đặt cọc",
    SOLD: "Đã bán",
    EXPIRED: "Hết hạn",
    REJECTED: "Từ chối",
    HIDDEN: "Ẩn",
    SOFT_DELETED: "Đã xóa tạm",
  };

  return (
    <Modal
      open={open}
      title="Xác nhận thay đổi trạng thái"
      onCancel={onCancel}
      onOk={() => onConfirm(record, newStatus)}
      okText="Xác nhận"
      cancelText="Hủy"
      confirmLoading={confirmLoading}
    >
      <Descriptions bordered size="small" column={1} style={{ marginTop: 12 }}>
        <Descriptions.Item label="ID">{record.id}</Descriptions.Item>
        <Descriptions.Item label="Danh mục">{categoryLabel}</Descriptions.Item>
        <Descriptions.Item label="Người bán">
          {record.sellerName}
        </Descriptions.Item>
        <Descriptions.Item label="SĐT người bán">
          {record.sellerPhone}
        </Descriptions.Item>

        <Descriptions.Item label="Trạng thái hiện tại">
          <Tag color={colorMap[record.status] || "default"}>
            {labelMap[record.status] || record.status}
          </Tag>
        </Descriptions.Item>

        <Descriptions.Item label="Trạng thái mới">
          <Tag color={colorMap[newStatus] || "default"}>
            {labelMap[newStatus] || newStatus}
          </Tag>
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
}

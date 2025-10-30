import React from "react";
import { Modal, Typography } from "antd";

const { Text } = Typography;

const InspectionInactiveModal = ({
  open,
  onConfirm,
  onCancel,
  loading = false,
  title = "Xác nhận hủy kết quả kiểm định",
  description = "Bạn có chắc chắn muốn hủy kết quả kiểm định này không? Hành động này sẽ không thể hoàn tác.",
}) => {
  return (
    <Modal
      open={open}
      title={title}
      onOk={onConfirm}
      onCancel={onCancel}
      okText="Xác nhận"
      cancelText="Hủy bỏ"
      confirmLoading={loading}
      centered
      okButtonProps={{ danger: true, type: "primary" }}
    >
      <Text>{description}</Text>
    </Modal>
  );
};

export default InspectionInactiveModal;

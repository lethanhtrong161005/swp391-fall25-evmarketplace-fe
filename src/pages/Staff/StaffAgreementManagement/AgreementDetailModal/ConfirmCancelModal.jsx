import React from "react";
import { Modal } from "antd";
const ConfirmCancelModal = ({
  open,
  title = "Xác nhận hành động",
  content = "Bạn có chắc chắn muốn thực hiện thao tác này?",
  loading = false,
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal
      title={title}
      open={open}
      onOk={onConfirm}
      onCancel={onCancel}
      confirmLoading={loading}
      okText="Có"
      cancelText="Không"
      centered
    >
      <p>{content}</p>
    </Modal>
  );
};

export default ConfirmCancelModal;

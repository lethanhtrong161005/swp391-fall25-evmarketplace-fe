import React from "react";
import { Modal } from "antd";


export default function CancelConsignmentModal({ visible, onCancel, onConfirm }) {
  return (
    <Modal
      className="hidden-modal"
      title="Xác nhận ẩn "
      open={visible}
      onCancel={onCancel}
      onOk={onConfirm}
      okType="danger"
      okText="Xác nhận"
      cancelText="Hủy"
    >
      <p>Bạn có chắc chắn muốn hủy yêu cầu này?</p>
    </Modal>
  );
}

import React from "react";
import { Modal } from "antd";
import "./HiddenModal.scss";

export default function HiddenModal({ visible, onCancel, onConfirm }) {
  return (
    <Modal
      className="hidden-modal"
      title="Xác nhận ẩn "
      open={visible}
      onCancel={onCancel}
      onOk={onConfirm}
      okType="danger"
      okText="Ẩn"
      cancelText="Hủy"
    >
      <p>Bạn có chắc chắn muốn ẩn sản phẩm này?</p>
    </Modal>
  );
}

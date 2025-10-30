import React, { useState, useEffect } from "react";
import { Modal, Input, message } from "antd";

const CancelInspectionModal = ({ open, onCancel, onConfirm, loading = false }) => {
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (!open) setReason("");
  }, [open]);

  const handleOk = () => {
    if (!reason.trim()) {
      message.warning("Vui lòng nhập lý do hủy lịch kiểm định!");
      return;
    }
    onConfirm(reason.trim());
  };

  return (
    <Modal
      open={open}
      title="Nhập lý do hủy lịch kiểm định"
      okText="Xác nhận"
      cancelText="Đóng"
      onOk={handleOk}
      onCancel={onCancel}
      confirmLoading={loading}
      okButtonProps={{ disabled: !reason.trim() }}
    >
      <Input.TextArea
        rows={4}
        placeholder="Nhập lý do hủy hoặc vắng mặt..."
        value={reason}
        onChange={(e) => setReason(e.target.value)}
      />
    </Modal>
  );
};

export default CancelInspectionModal;

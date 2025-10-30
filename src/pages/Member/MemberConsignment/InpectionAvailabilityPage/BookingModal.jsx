import React, { useState, useEffect } from "react";
import { Modal, Input, message } from "antd";

const BookingModal = ({ open, onCancel, onConfirm, loading = false }) => {
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!open) setNote("");
  }, [open]);

  const handleOk = () => {
    if (!note.trim()) {
      message.warning("Vui lòng nhập ghi chú trước khi xác nhận!");
      return;
    }
    onConfirm(note.trim());
  };

  return (
    <Modal
      open={open}
      title="Xác nhận đặt lịch kiểm định"
      okText="Đặt lịch"
      cancelText="Hủy"
      onOk={handleOk}
      onCancel={onCancel}
      confirmLoading={loading}
      okButtonProps={{ disabled: !note.trim() }}
    >
      <Input.TextArea
        rows={4}
        placeholder="Nhập ghi chú cho lịch kiểm định..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
    </Modal>
  );
};

export default BookingModal;

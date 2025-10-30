import React from "react";
import { Modal, Input } from "antd";

const StaffConsiderModal = ({
  rejectId,
  rejectReason,
  handleConfirmReject,
  setRejectId,
  setRejectReason,
}) => {
  return (
    <Modal
      open={!!rejectId} 
      title="Nhập lý do từ chối"
      onOk={handleConfirmReject}
      onCancel={() => {
        setRejectId(null);
        setRejectReason("");
      }}
      okText="Xác nhận"
      cancelText="Hủy"
      destroyOnClose 
    >
      <Input.TextArea
        rows={4}
        placeholder="Nhập lý do từ chối..."
        value={rejectReason}
        onChange={(e) => setRejectReason(e.target.value)}
      />
    </Modal>
  );
};

export default StaffConsiderModal;

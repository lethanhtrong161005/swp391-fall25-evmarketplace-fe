import React, { useState } from "react";
import { Modal } from "antd";

const AcceptModal = ({ record, handleAccept, onClose }) => {
  const [open, setOpen] = useState(true);

  const handleOk = async () => {
    try {
      await handleAccept?.(record.id);
    } finally {
      setOpen(false);
      onClose?.();
    }
  };

  const handleCancel = () => {
    setOpen(false);
    onClose?.();
  };

  return (
    <Modal
      open={open}
      title="Xác nhận chấp nhận yêu cầu này?"
      okText="Xác nhận"
      cancelText="Hủy"
      onOk={handleOk}
      onCancel={handleCancel}
      destroyOnHidden
    >
      <div>
        Model: <strong>{record.model}</strong>
      </div>
      <div>Loại: {record.itemType}</div>
    </Modal>
  );
};

export default AcceptModal;

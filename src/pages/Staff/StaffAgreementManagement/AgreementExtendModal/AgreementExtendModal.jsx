import React from "react";
import { Modal, Radio } from "antd";

const AgreementExtendModal = ({
  open,
  onCancel,
  onConfirm,
  loading,
  duration,
  setDuration,
}) => {
  return (
    <Modal
      title="Gia hạn hợp đồng ký gửi"
      open={open}
      onOk={onConfirm}
      onCancel={onCancel}
      confirmLoading={loading}
      okText="Xác nhận"
      cancelText="Hủy"
      centered
      width={420}
    >
      <div style={{ paddingTop: 8 }}>
        <p style={{ marginBottom: 12, fontWeight: 500 }}>
          Chọn thời gian gia hạn:
        </p>

        <Radio.Group
          onChange={(e) => setDuration(e.target.value)}
          value={duration}
          style={{ display: "flex", flexDirection: "column", gap: 10 }}
        >
          <Radio value="SIX_MONTHS">6 tháng</Radio>
          <Radio value="ONE_YEAR">1 năm</Radio>
        </Radio.Group>
      </div>
    </Modal>
  );
};

export default AgreementExtendModal;

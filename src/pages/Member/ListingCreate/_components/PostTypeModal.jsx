/**
 * PostTypeModal
 * - Chọn loại đăng tin (FREE/PAID). Tách riêng để có thể mở lại nhiều lần.
 */
import React from "react";
import { Modal, Radio, Typography } from "antd";

export default function PostTypeModal({
  open,
  onCancel,
  onOk,
  value,
  onChange,
}) {
  return (
    <Modal
      open={open}
      onCancel={onCancel}
      onOk={onOk}
      okText="Áp dụng"
      title="Chọn lượt đăng tin từ"
      destroyOnHidden
    >
      <Typography.Title level={5} style={{ marginTop: 8 }}>
        Ưu đãi
      </Typography.Title>
      <Radio.Group
        onChange={(e) => onChange?.(e.target.value)}
        value={value}
        style={{ width: "100%" }}
      >
        <div
          style={{
            padding: 12,
            border: "1px solid #f0f0f0",
            borderRadius: 8,
            marginBottom: 12,
          }}
        >
          <Radio value="FREE">
            Đăng tin thường (Miễn phí)
            <Typography.Text type="secondary" style={{ display: "block" }}>
              Loại tin: Tin thường – 60 ngày (áp dụng 1 lần cho thành viên mới)
            </Typography.Text>
          </Radio>
        </div>

        <Typography.Title level={5} style={{ marginTop: 8 }}>
          Trả phí
        </Typography.Title>
        <div
          style={{ padding: 12, border: "1px solid #f0f0f0", borderRadius: 8 }}
        >
          <Radio value="PAID">Đăng tin trả phí</Radio>
          <Typography.Text type="secondary" style={{ display: "block" }}>
            Trả phí để có thêm lượt đăng tin
          </Typography.Text>
        </div>
      </Radio.Group>
    </Modal>
  );
}

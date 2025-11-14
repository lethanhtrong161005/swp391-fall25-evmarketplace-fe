import React, { useState } from "react";
import { Modal, Typography, Input, Form } from "antd";

const { Text } = Typography;

export default function CreateOrderModal({
  open,
  onCancel,
  onConfirm,
  listing,
}) {
  const [phone, setPhone] = useState("");
  const [form] = Form.useForm();

  if (!listing) return null;

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onConfirm(listing.id, values.buyerPhoneNumber);
    } catch {
      // validation error — do nothing
    }
  };

  return (
    <Modal
      title="Xác nhận tạo đơn hàng"
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      okText="Xác nhận"
      cancelText="Hủy"
      destroyOnHidden
    >
      <div style={{ marginBottom: 8 }}>
        <Text strong>Xe: </Text> {listing?.title || "(Không có tiêu đề)"}
      </div>
      <div style={{ marginBottom: 8 }}>
        <Text strong>Giá: </Text>{" "}
        {listing?.price?.toLocaleString("vi-VN")} ₫
      </div>

      <Form form={form} layout="vertical">
        <Form.Item
          label="Số điện thoại khách hàng"
          name="buyerPhoneNumber"
          rules={[
            { required: true, message: "Vui lòng nhập số điện thoại!" },
            {
              pattern: /^(0|\+84)(\d{9})$/,
              message: "Số điện thoại không hợp lệ!",
            },
          ]}
        >
          <Input
            placeholder="Nhập số điện thoại khách hàng"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </Form.Item>
      </Form>

      <div style={{ marginTop: 12, color: "#888" }}>
        Xác nhận tạo đơn hàng cho xe này?
      </div>
    </Modal>
  );
}

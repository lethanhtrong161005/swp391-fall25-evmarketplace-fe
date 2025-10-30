import React from "react";
import { Modal, Form, Input, InputNumber, Select } from "antd";

const InspectionResultModal = ({
  open,
  loading,
  onCancel,
  onSubmit,
  request,
}) => {
  const [form] = Form.useForm();

  const handleFinish = (values) => {
    onSubmit(values);
  };

  return (
    <Modal
      open={open}
      title={`Kết quả kiểm định `}
      onCancel={onCancel}
      okText="Lưu"
      onOk={() => form.submit()}
      confirmLoading={loading}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          name="inspectionSummary"
          label="Tóm tắt kiểm định"
          rules={[{ required: true, message: "Nhập nội dung kiểm định" }]}
        >
          <Input.TextArea rows={3} placeholder="Nhập kết quả chi tiết..." />
        </Form.Item>

        <Form.Item
          name="suggestedPrice"
          label="Giá đề xuất (VNĐ)"
          rules={[{ required: true, message: "Nhập giá đề xuất" }]}
        >
          <InputNumber
            style={{ width: "100%" }}
            min={0}
            step={1000000}
            placeholder="Nhập giá đề xuất"
          />
        </Form.Item>

        <Form.Item
          name="result"
          label="Kết quả kiểm định"
          rules={[{ required: true, message: "Chọn kết quả kiểm định" }]}
        >
          <Select
            placeholder="Chọn kết quả"
            options={[
              { value: "PASS", label: "Đạt" },
              { value: "FAIL", label: "Không đạt" },
            ]}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default InspectionResultModal;

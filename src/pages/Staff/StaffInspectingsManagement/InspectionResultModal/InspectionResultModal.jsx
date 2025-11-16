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
      cancelText="Đóng"
      onOk={() => form.submit()}
      confirmLoading={loading}
      destroyOnHidden
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
          rules={[
            { required: true, message: "Nhập giá đề xuất" },
            {
              validator: (_, value) => {
                const n = Number(value);
                if (Number.isNaN(n)) return Promise.reject("Giá không hợp lệ");
                if (n < 1000000)
                  return Promise.reject("Giá phải lớn hơn hoặc bằng 1.000.000 VND");
                return Promise.resolve();
              },
            },
          ]}
        >
          <InputNumber
            style={{ width: "100%" }}
            placeholder="Nhập giá đề xuất"
            // show thousand separators while typing
            formatter={(val) =>
              typeof val === "number"
                ? val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                : String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(str) => String(str).replace(/\D/g, "")}
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

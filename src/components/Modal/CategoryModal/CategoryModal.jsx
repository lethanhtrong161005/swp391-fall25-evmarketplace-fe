import React from "react";
import { Modal, Form, Input, Select } from "antd";
import "./CategoryModal.scss";

const { Option } = Select;

export default function CategoryModal({
  form,
  visible,
  onCancel,
  onSubmit,
  editingCategory,
}) {
  return (
    <Modal
      className="category-form-modal"
      title={editingCategory ? "Chỉnh sửa Danh mục" : "Thêm mới Danh mục"}
      open={visible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      okText="Lưu"
      cancelText="Hủy"
    >
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <Form.Item
          label="Tên danh mục"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên danh mục" }]}
        >
          <Input placeholder="Nhập tên danh mục" />
        </Form.Item>

        <Form.Item label="Mô tả" name="description">
          <Input.TextArea rows={3} placeholder="Nhập mô tả (nếu có)" />
        </Form.Item>

        <Form.Item
          label="Trạng thái"
          name="status"
          rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
        >
          <Select placeholder="Chọn trạng thái">
            <Option value="ACTIVE">Hoạt động</Option>
            <Option value="HIDDEN">Đang ẩn</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}

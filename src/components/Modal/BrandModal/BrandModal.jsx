import React from "react";
import { Modal, Form, Input, Select } from "antd";
import "./BrandModal.scss";

const { Option } = Select;

export default function BrandModal({
  form,
  visible,
  onCancel,
  onSubmit,
  editingBrand,
  categories,
}) {
  return (
    <Modal
      className="brand-form-modal"
      title={editingBrand ? "Chỉnh sửa thương hiệu" : "Thêm mới thương hiệu"}
      open={visible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      okText="Lưu"
      cancelText="Hủy"
    >
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <Form.Item
          label="Tên thương hiệu"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên thương hiệu" }]}
        >
          <Input placeholder="Nhập tên thương hiệu" />
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

        <Form.Item
          label="Danh mục"
          name="categoryIds"
          rules={[
            { required: true, message: "Vui lòng chọn ít nhất một danh mục" },
          ]}
        >
          <Select
            mode="multiple"
            showSearch 
            placeholder="Chọn hoặc tìm danh mục"
            optionFilterProp="children" // So khớp với text hiển thị (ở đây là c.description)
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            } 
          >
            {categories.map((c) => (
              <Option key={c.id} value={c.id}>
                {c.description}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}

import React from "react";
import { useMemo } from "react";
import { Modal, Form, Input, Select, InputNumber } from "antd";
import "./ModelModal.scss";

const { Option } = Select;

export default function ModelModal({
  form,
  visible,
  onCancel,
  onSubmit,
  editingModel,
  categories,
  brands,
  setSelectedCategory,
  selectedCategory,
}) {
  const filteredBrands = useMemo(() => {
    if (!selectedCategory) return [];

    const result = brands.filter(
      (b) =>
        Array.isArray(b.categoryIds) &&
        b.categoryIds.includes(Number(selectedCategory))
    );
    return result;
  }, [brands, selectedCategory]);
  return (
    <Modal
      className="model-form-modal"
      title={editingModel ? "Chỉnh sửa Model" : "Thêm mới Model"}
      open={visible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      okText="Lưu"
      cancelText="Hủy"
    >
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <Form.Item
          label="Danh mục"
          name="categoryId"
          rules={[{ required: true, message: "Vui lòng chọn danh mục" }]}
        >
          <Select
            showSearch
            placeholder="Chọn hoặc tìm danh mục"
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
            onChange={(val) => {
              setSelectedCategory(val);
              form.setFieldsValue({ brandId: undefined });
            }}
          >
            {categories.map((cat) => (
              <Option key={cat.id} value={cat.id}>
                {cat.description}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Thương hiệu"
          name="brandId"
          rules={[{ required: true, message: "Vui lòng chọn thương hiệu" }]}
        >
          <Select
            showSearch
            placeholder={
              selectedCategory
                ? "Chọn hoặc tìm thương hiệu"
                : "Chọn danh mục trước để lọc thương hiệu"
            }
            disabled={!selectedCategory}
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
          >
            {filteredBrands.map((b) => (
              <Option key={b.id} value={b.id}>
                {b.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Tên Model"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên Model" }]}
        >
          <Input placeholder="Nhập tên Model" />
        </Form.Item>

        <Form.Item
          label="Năm sản xuất"
          name="year"
          rules={[{ required: true, message: "Vui lòng nhập năm sản xuất" }]}
        >
          <InputNumber style={{ width: "100%" }} placeholder="VD: 2024" />
        </Form.Item>

        {editingModel && (
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
        )}
      </Form>
    </Modal>
  );
}

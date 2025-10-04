import React from "react";
import { Table, Button, Modal, Form, Input, Select, Card, Tag } from "antd";
import "./CategoryManagement.scss";
import { useCategoryManagementLogic } from "./CategoryManagement.logic";

const { Option } = Select;

export default function CategoryManagement() {
  const {
    categories,
    loading,
    isModalVisible,
    setIsModalVisible,
    editingCategory,
    form,
    handleOpenModal,
    handleSubmit,
    deleteId,
    setDeleteId,
    handleDelete,
  } = useCategoryManagementLogic();

  // ✅ Map trạng thái sang nhãn màu + tiếng Việt
  const statusLabels = {
    ACTIVE: { label: "Hoạt động", color: "green" },
    HIDDEN: { label: "Đang ẩn", color: "red" },
  };

  const columns = [
    {
      title: "Tên danh mục",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      render: (desc) => desc || <i style={{ color: "#999" }}>Không có mô tả</i>,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const info = statusLabels[status] || { label: status, color: "default" };
        return (
          <Tag color={info.color} style={{ fontWeight: 500 }}>
            {info.label}
          </Tag>
        );
      },
    },
    {
      title: "Hành động",
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => handleOpenModal(record)}>
            Chỉnh sửa
          </Button>
          <Button
            danger
            type="link"
            onClick={() => setDeleteId(record.id)}
            disabled={record.status === "HIDDEN"} // ẩn thì không cần xóa lại
          >
            Ẩn
          </Button>
        </>
      ),
    },
  ];

  return (
    <div className="category-management">
      <h2>Quản lý Danh mục</h2>

      {/* Danh sách danh mục */}
      <Card title="Danh sách Danh mục">
        <Table
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={categories}
          pagination={false}
        />
      </Card>

      {/* Modal chỉnh sửa */}
      <Modal
        title={editingCategory ? "Chỉnh sửa Danh mục" : "Thêm mới Danh mục"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
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

      {/* Modal xác nhận ẩn danh mục */}
      <Modal
        title="Xác nhận ẩn Danh mục"
        open={!!deleteId}
        onCancel={() => setDeleteId(null)}
        onOk={handleDelete}
        okText="Ẩn"
        okType="danger"
        cancelText="Hủy"
      >
        <p>Bạn có chắc chắn muốn ẩn danh mục này?</p>
      </Modal>
    </div>
  );
}

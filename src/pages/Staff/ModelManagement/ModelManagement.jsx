import React from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  Row,
  Col,
  Card,
  Tag,
} from "antd";
import { useModelManagementLogic } from "./ModelManagement.logic";
import "./ModelManagement.scss";

const { Option } = Select;

const ModelManagement = () => {
  const {
    categories,
    brands,
    models,
    loading,
    selectedCategory,
    setSelectedCategory,
    isModalVisible,
    setIsModalVisible,
    editingModel,
    form,
    handleOpenModal,
    handleSubmit,
    deleteId,
    setDeleteId,
    handleDelete,
  } = useModelManagementLogic();

  // ✅ Map trạng thái -> nhãn tiếng Việt + màu
  const statusLabels = {
    ACTIVE: { label: "Hoạt động", color: "green" },
    HIDDEN: { label: "Đang ẩn", color: "red" },
  };

  const columns = [
    { title: "Tên Model", dataIndex: "name" },
    { title: "Năm sản xuất", dataIndex: "year" },
    { title: "Thương hiệu", dataIndex: "brandName" },
    {
      title: "Danh mục",
      render: (_, record) => {
        const cat = categories.find((c) => c.id === record.categoryId);
        return (
          <Tag color="blue" style={{ fontWeight: 500 }}>
            {cat ? cat.description : "Không xác định"}
          </Tag>
        );
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status) => {
        const info = statusLabels[status] || {
          label: status,
          color: "default",
        };
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
          <Button danger type="link" onClick={() => setDeleteId(record.id)}>
            Ẩn
          </Button>
        </>
      ),
    },
  ];

  return (
    <div className="model-management">
      <h2>Quản lý mẫu mã</h2>

      {/* Bộ lọc danh mục */}
      <Card title="Lọc theo danh mục" style={{ marginBottom: 20 }}>
        <Row gutter={[16, 16]} className="category-statistics">
          {categories.map((cat) => (
            <Col key={cat.id} span={24 / categories.length}>
              <Card
                hoverable
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  textAlign: "center",
                  cursor: "pointer",
                  border:
                    selectedCategory === cat.id
                      ? "2px solid #1890ff"
                      : "1px solid #f0f0f0",
                }}
              >
                <p
                  style={{
                    fontSize: 14,
                    color: "#333",
                    margin: 0,
                    fontWeight: 500,
                    lineHeight: 1.4,
                  }}
                >
                  {cat.description}
                </p>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

      {/* Danh sách model */}
      <Card
        title="Danh sách mẫu mã"
        extra={
          <Button type="primary" onClick={() => handleOpenModal()}>
            Thêm mẫu mới
          </Button>
        }
      >
        <Table
          rowKey="id"
          loading={loading}
          dataSource={models}
          columns={columns}
        />
      </Card>

      {/* Modal thêm/sửa model */}
      <Modal
        title={editingModel ? "Chỉnh sửa Model" : "Thêm mới Model"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Danh mục"
            name="categoryId"
            rules={[{ required: true, message: "Vui lòng chọn danh mục" }]}
          >
            <Select
              placeholder="Chọn danh mục"
              onChange={(val) => setSelectedCategory(val)}
            >
              {categories.map((cat) => (
                <Option key={cat.id} value={cat.id}>
                  {cat.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Thương hiệu"
            name="brandId"
            rules={[{ required: true, message: "Vui lòng chọn thương hiệu" }]}
          >
            <Select placeholder="Chọn thương hiệu">
              {brands.map((b) => (
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

      {/* Modal xác nhận xóa */}
      <Modal
        title="Xác nhận xóa Model"
        open={!!deleteId}
        onCancel={() => setDeleteId(null)}
        onOk={handleDelete}
        okText="Xóa"
        okType="danger"
        cancelText="Hủy"
      >
        <p>Bạn có chắc chắn muốn xóa mẫu này?</p>
      </Modal>
    </div>
  );
};

export default ModelManagement;

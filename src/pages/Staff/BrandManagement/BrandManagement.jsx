import React from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Row,
  Col,
  Card,
  Tag,
} from "antd";
import { useBrandManagementLogic } from "./BrandManagement.logic";
import "./BrandManagement.scss";

const { Option } = Select;

const BrandManagement = () => {
  const {
    brands,
    categories,
    loading,
    selectedCategory,
    setSelectedCategory,
    isModalVisible,
    setIsModalVisible,
    editingBrand,
    form,
    handleOpenModal,
    handleSubmit,
    deleteId,
    setDeleteId,
    handleDelete,
  } = useBrandManagementLogic();

  // ✅ Map trạng thái sang nhãn tiếng Việt + màu
  const statusLabels = {
    ACTIVE: { label: "Hoạt động", color: "green" },
    HIDDEN: { label: "Đang ẩn", color: "red" },
  };

  const columns = [
    { title: "Tên thương hiệu", dataIndex: "name" },
    {
      title: "Danh mục",
      render: (_, record) =>
        record.categoryIds?.map((id) => {
          const cat = categories.find((c) => c.id === id);
          return (
            <Tag
              key={id}
              color="blue"
              style={{ marginBottom: 4, fontWeight: 500 }}
            >
              {cat ? cat.description : "Không xác định"}
            </Tag>
          );
        }),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status) => {
        const s = statusLabels[status] || { label: status, color: "default" };
        return <Tag color={s.color}>{s.label}</Tag>;
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
    <div className="brand-management">
      <h2>Quản lý thương hiệu</h2>

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

      {/* Danh sách thương hiệu */}
      <Card
        title="Danh sách thương hiệu"
        extra={
          <Button type="primary" onClick={() => handleOpenModal()}>
            Thêm thương hiệu mới
          </Button>
        }
      >
        <Table
          rowKey="id"
          loading={loading}
          dataSource={brands}
          columns={columns}
        />
      </Card>

      {/* Modal thêm/sửa thương hiệu */}
      <Modal
        title={editingBrand ? "Chỉnh sửa thương hiệu" : "Thêm mới thương hiệu"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Tên thương hiệu"
            name="name"
            rules={[
              { required: true, message: "Vui lòng nhập tên thương hiệu" },
            ]}
          >
            <Input />
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
            <Select mode="multiple" placeholder="Chọn danh mục">
              {categories.map((c) => (
                <Option key={c.id} value={c.id}>
                  {c.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal xác nhận xóa */}
      <Modal
        title="Xác nhận xóa"
        open={!!deleteId}
        onCancel={() => setDeleteId(null)}
        onOk={handleDelete}
        okText="Xóa"
        okType="danger"
        cancelText="Hủy"
      >
        <p>Bạn có chắc chắn muốn xóa thương hiệu này?</p>
      </Modal>
    </div>
  );
};

export default BrandManagement;

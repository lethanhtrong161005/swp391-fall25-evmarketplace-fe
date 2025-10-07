import React from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Card,
  Tag,
  Row,
  Col,
} from "antd";
import { useProductBatteryManagementLogic } from "./ProductBatteryManagement.logic";
import "./ProductBatteryManagement.scss"; // ✅ import SCSS

const { Option } = Select;

const ProductBatteryManagement = () => {
  const {
    brands,
    models,
    batteries,
    loading,
    isModalVisible,
    setIsModalVisible,
    editingBattery,
    form,
    handleOpenModal,
    handleSubmit,
  } = useProductBatteryManagementLogic();

  const columns = [
    {
      title: "Hãng",
      dataIndex: "brand",
      key: "brand",
      width: 140,
    },
    {
      title: "Model",
      dataIndex: "model",
      key: "model",
      width: 160,
    },
    {
      title: "Dung lượng (kWh)",
      dataIndex: "capacityKwh",
      key: "capacityKwh",
      align: "center",
      width: 150,
    },
    {
      title: "Điện áp (V)",
      dataIndex: "voltage",
      key: "voltage",
      align: "center",
      width: 130,
    },
    {
      title: "Khối lượng (kg)",
      dataIndex: "weightKg",
      key: "weightKg",
      align: "center",
      width: 130,
    },
    {
      title: "Kích thước (D×R×C)",
      dataIndex: "dimension",
      key: "dimension",
      align: "center",
      width: 200,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      align: "center",
      width: 130,
      render: (status) => {
        const color =
          status === "ACTIVE" ? "green" : status === "HIDDEN" ? "red" : "gray";
        const label =
          status === "ACTIVE"
            ? "Hoạt động"
            : status === "HIDDEN"
            ? "Đang ẩn"
            : "Ngưng";
        return <Tag color={color}>{label}</Tag>;
      },
    },
    {
      title: "Hành động",
      key: "actions",
      align: "center",
      width: 120,
      render: (_, record) => (
        <Button type="link" onClick={() => handleOpenModal(record)}>
          Chỉnh sửa
        </Button>
      ),
    },
  ];

  return (
    <div className="product-battery-management">
      <h2>Quản lý pin</h2>

      <Card
        title="Danh sách pin"
        extra={
          <Button type="primary" onClick={() => handleOpenModal()}>
            + Thêm pin mới
          </Button>
        }
      >
        <Table
          rowKey="id"
          dataSource={batteries}
          columns={columns}
          loading={loading}
          pagination={{ pageSize: 8 }}
        />
      </Card>

      <Modal
        title={editingBattery ? "Cập nhật pin" : "Thêm pin mới"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
        okText="Lưu"
        cancelText="Hủy"
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ status: "ACTIVE" }}
        >
          {/* Ẩn chọn Hãng + Model khi chỉnh sửa */}
          {!editingBattery && (
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  label="Model"
                  name="modelId"
                  rules={[{ required: true, message: "Chọn model" }]}
                >
                  <Select placeholder="Chọn model">
                    {models.map((m) => (
                      <Option key={m.id} value={m.id}>
                        {m.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          )}

          <Form.Item
            label="Loại hóa học (Chemistry)"
            name="chemistry"
            rules={[{ required: true, message: "Nhập loại hóa học pin" }]}
          >
            <Input placeholder="VD: Li-ion, LFP, NMC..." />
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="Dung lượng (kWh)"
                name="capacityKwh"
                rules={[{ required: true, message: "Nhập dung lượng" }]}
              >
                <InputNumber style={{ width: "100%" }} step={0.1} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Điện áp (V)"
                name="voltage"
                rules={[{ required: true, message: "Nhập điện áp" }]}
              >
                <InputNumber style={{ width: "100%" }} step={0.1} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Khối lượng (kg)"
                name="weightKg"
                rules={[{ required: true, message: "Nhập khối lượng" }]}
              >
                <InputNumber style={{ width: "100%" }} step={0.1} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Kích thước (D×R×C)" name="dimension">
            <Input placeholder="VD: 60×40×20cm" />
          </Form.Item>

          {editingBattery && (
            <Form.Item label="Trạng thái" name="status">
              <Select>
                <Option value="ACTIVE">Hoạt động</Option>
                <Option value="HIDDEN">Ẩn</Option>
              </Select>
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default ProductBatteryManagement;

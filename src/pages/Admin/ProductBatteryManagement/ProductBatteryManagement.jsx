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
import ProductBatteryModal from "../../../components/Modal/ProductBatteryModal/ProductBatteryModal";

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

      <ProductBatteryModal
        form={form}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onSubmit={handleSubmit}
        editingBattery={editingBattery}
        models={models}
      />
    </div>
  );
};

export default ProductBatteryManagement;

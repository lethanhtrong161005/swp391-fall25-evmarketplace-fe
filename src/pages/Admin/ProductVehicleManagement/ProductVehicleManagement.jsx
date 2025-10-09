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
import { useProductVehicleManagementLogic } from "./ProductVehicleManagement.logic";
import "./ProductVehicleManagement.scss";
import ProductVehicleModal from "../../../components/Modal/ProductVehicleModal/ProductVehicleModal";

const { Option } = Select;

const ProductVehicleManagement = () => {
  const {
    categories,
    brands,
    models,
    vehicles,
    loading,
    selectedCategory,
    setSelectedCategory,
    selectedBrand,
    setSelectedBrand,
    isModalVisible,
    setIsModalVisible,
    editingVehicle,
    form,
    handleOpenModal,
    handleSubmit,
  } = useProductVehicleManagementLogic();

  const categoryLabels = {
    EV_CAR: "Ô tô điện",
    E_MOTORBIKE: "Xe máy điện",
    E_BIKE: "Xe đạp điện",
  };

  const columns = [
    { title: "Tên sản phẩm", dataIndex: "name" },
    { title: "Model", dataIndex: "model" },
    { title: "Hãng", dataIndex: "brand" },
    {
      title: "Danh mục",
      dataIndex: "category",
      render: (cat) => <Tag color="blue">{categoryLabels[cat] || cat}</Tag>,
    },
    { title: "Năm SX", dataIndex: "releaseYear", align: "center" },
    {
      title: "Dung lượng pin (kWh)",
      dataIndex: "batteryCapacityKwh",
      align: "center",
    },
    { title: "Tầm hoạt động (km)", dataIndex: "rangeKm", align: "center" },
    {
      title: "Công suất (kW)",
      dataIndex: "motorPowerKw",
      align: "center",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      align: "center",
      render: (status) => {
        const colors = {
          ACTIVE: "green",
          HIDDEN: "red",
        };
        const labels = {
          ACTIVE: "Hoạt động",
          HIDDEN: "Đang ẩn",
        };
        return (
          <Tag color={colors[status] || "default"}>
            {labels[status] || status}
          </Tag>
        );
      },
    },
    {
      title: "Hành động",
      align: "center",
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => handleOpenModal(record)}>
            Chỉnh sửa
          </Button>
        </>
      ),
    },
  ];

  return (
    <div className="product-vehicle-management">
      <h2>Quản lý sản phẩm</h2>

      <Card title="Lọc theo danh mục" style={{ marginBottom: 20 }}>
        <Row gutter={[16, 16]}>
          {["EV_CAR", "E_MOTORBIKE", "E_BIKE"].map((cat) => (
            <Col key={cat} span={8}>
              <Card
                hoverable
                onClick={() => setSelectedCategory(cat)}
                style={{
                  textAlign: "center",
                  border:
                    selectedCategory === cat
                      ? "2px solid #1890ff"
                      : "1px solid #f0f0f0",
                }}
              >
                {categoryLabels[cat]}
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

      <Card
        title="Danh sách sản phẩm"
        extra={
          <Button type="primary" onClick={() => handleOpenModal()}>
            Thêm phương tiện mới
          </Button>
        }
      >
        <Table
          rowKey="id"
          loading={loading}
          dataSource={vehicles}
          columns={columns}
          pagination={{ pageSize: 6 }}
        />
      </Card>

      <ProductVehicleModal
        form={form}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onSubmit={handleSubmit}
        editingVehicle={editingVehicle}
        categories={categories}
        brands={brands}
        models={models}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedBrand={selectedBrand}
        setSelectedBrand={setSelectedBrand}
      />
    </div>
  );
};

export default ProductVehicleManagement;

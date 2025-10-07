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

const { Option } = Select;

const ProductVehicleManagement = () => {
  const {
    // categories,
    brands,
    models,
    vehicles,
    loading,
    selectedCategory,
    setSelectedCategory,
    isModalVisible,
    setIsModalVisible,
    editingVehicle,
    form,
    handleOpenModal,
    handleSubmit,
    deleteId,
    setDeleteId,
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

      {/* ===== Bộ lọc danh mục ===== */}
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

      {/* ===== Danh sách sản phẩm ===== */}
      <Card
        title="Danh sách sản phẩm"
        extra={
          <Button type="primary" onClick={() => handleOpenModal()}>
            Thêm sản phẩm
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

      {/* ===== Modal thêm/sửa sản phẩm ===== */}
      <Modal
        title={editingVehicle ? "Cập nhật sản phẩm" : "Thêm sản phẩm mới"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
        okText="Lưu"
        cancelText="Hủy"
        width={850}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ category: "EV_CAR" }}
        >
          {/* Ẩn 3 field khi update */}
          {!editingVehicle && (
            <>
              <Form.Item
                label="Danh mục"
                name="category"
                rules={[{ required: true, message: "Vui lòng chọn danh mục" }]}
              >
                <Select placeholder="Chọn danh mục">
                  <Option value="EV_CAR">Ô tô điện</Option>
                  <Option value="E_MOTORBIKE">Xe máy điện</Option>
                  <Option value="E_BIKE">Xe đạp điện</Option>
                </Select>
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Thương hiệu"
                    name="brandId"
                    rules={[
                      { required: true, message: "Vui lòng chọn thương hiệu" },
                    ]}
                  >
                    <Select placeholder="Chọn thương hiệu">
                      {brands.map((b) => (
                        <Option key={b.id} value={b.id}>
                          {b.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    label="Model"
                    name="modelId"
                    rules={[{ required: true, message: "Vui lòng chọn model" }]}
                  >
                    <Select placeholder="Chọn model">
                      {models.map((m) => (
                        <Option key={m.id} value={m.id}>
                          {m.name} ({m.year})
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </>
          )}

          {/* ===== Thông tin chung ===== */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Tên sản phẩm"
                name="name"
                rules={[{ required: true, message: "Nhập tên sản phẩm" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Mô tả" name="description">
                <Input.TextArea rows={1} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="Năm SX" name="releaseYear">
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Dung lượng pin (kWh)" name="batteryCapacityKwh">
                <InputNumber style={{ width: "100%" }} step={0.1} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Tầm hoạt động (km)" name="rangeKm">
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="Công suất (kW)" name="motorPowerKw">
                <InputNumber style={{ width: "100%" }} step={0.1} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Sạc AC (kW)" name="acChargingKw">
                <InputNumber style={{ width: "100%" }} step={0.1} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Sạc DC (kW)" name="dcChargingKw">
                <InputNumber style={{ width: "100%" }} step={0.1} />
              </Form.Item>
            </Col>
          </Row>
          {editingVehicle && (
            <Form.Item label="Trạng thái" name="status" initialValue="ACTIVE">
              <Select>
                <Option value="ACTIVE">Hoạt động</Option>
                <Option value="HIDDEN">Ẩn</Option>
              </Select>
            </Form.Item>
          )}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Đầu nối AC" name="acConnector">
                <Select>
                  <Option value="TYPE1">TYPE1</Option>
                  <Option value="TYPE2">TYPE2</Option>
                  <Option value="OTHER">OTHER</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Đầu nối DC" name="dcConnector">
                <Select>
                  <Option value="CCS1">CCS1</Option>
                  <Option value="CCS2">CCS2</Option>
                  <Option value="NONE">NONE</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {/* ===== Nhóm detail theo loại category ===== */}
          {(() => {
            const cat =
              form.getFieldValue("category") || editingVehicle?.category;
            if (cat === "EV_CAR")
              return (
                <Card
                  title="Thông tin ô tô điện"
                  size="small"
                  style={{ marginTop: 16 }}
                >
                  <Row gutter={16}>
                    <Col span={8}>
                      <Form.Item label="Số chỗ ngồi" name="seatingCapacity">
                        <InputNumber style={{ width: "100%" }} />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="Loại thân xe" name="bodyType">
                        <Select>
                          <Option value="SEDAN">SEDAN</Option>
                          <Option value="SUV">SUV</Option>
                          <Option value="HATCHBACK">HATCHBACK</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="Dẫn động" name="drivetrain">
                        <Select>
                          <Option value="FWD">FWD</Option>
                          <Option value="RWD">RWD</Option>
                          <Option value="AWD">AWD</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                  <Form.Item label="Dung tích cốp (L)" name="trunkRearL">
                    <InputNumber style={{ width: "100%" }} />
                  </Form.Item>
                </Card>
              );

            if (cat === "E_MOTORBIKE")
              return (
                <Card
                  title="Thông tin xe máy điện"
                  size="small"
                  style={{ marginTop: 16 }}
                >
                  <Row gutter={16}>
                    <Col span={8}>
                      <Form.Item label="Vị trí động cơ" name="motorLocation">
                        <Select>
                          <Option value="HUB">HUB</Option>
                          <Option value="MID">MID</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        label="Kích thước bánh (inch)"
                        name="wheelSize"
                      >
                        <Input placeholder='VD: 14"' />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="Loại phanh" name="brakeType">
                        <Select>
                          <Option value="DISC">DISC</Option>
                          <Option value="DRUM">DRUM</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                  <Form.Item label="Khối lượng (kg)" name="weightKg">
                    <InputNumber style={{ width: "100%" }} />
                  </Form.Item>
                </Card>
              );

            if (cat === "E_BIKE")
              return (
                <Card
                  title="Thông tin xe đạp điện"
                  size="small"
                  style={{ marginTop: 16 }}
                >
                  <Row gutter={16}>
                    <Col span={8}>
                      <Form.Item label="Kích thước khung" name="frameSize">
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        label="Kích thước bánh (inch)"
                        name="wheelSize"
                      >
                        <Input placeholder='VD: 27.5"' />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="Trọng lượng (kg)" name="weightKg">
                        <InputNumber style={{ width: "100%" }} />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col span={8}>
                      <Form.Item label="Tải trọng tối đa (kg)" name="maxLoad">
                        <InputNumber style={{ width: "100%" }} />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="Số cấp số" name="gears">
                        <InputNumber style={{ width: "100%" }} />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        label="Pin tháo rời"
                        name="removableBattery"
                        initialValue={false}
                      >
                        <Select>
                          <Option value={true}>Có</Option>
                          <Option value={false}>Không</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item
                    label="Có tay ga (throttle)"
                    name="throttle"
                    initialValue={false}
                  >
                    <Select>
                      <Option value={true}>Có</Option>
                      <Option value={false}>Không</Option>
                    </Select>
                  </Form.Item>
                </Card>
              );
          })()}
        </Form>
      </Modal>

      {/* ===== Modal xác nhận xoá ===== */}
      <Modal
        title="Xác nhận xoá sản phẩm"
        open={!!deleteId}
        onCancel={() => setDeleteId(null)}
        onOk={() => setDeleteId(null)}
        okType="danger"
        okText="Xóa"
        cancelText="Hủy"
      >
        <p>Bạn có chắc chắn muốn xoá sản phẩm này?</p>
      </Modal>
    </div>
  );
};

export default ProductVehicleManagement;

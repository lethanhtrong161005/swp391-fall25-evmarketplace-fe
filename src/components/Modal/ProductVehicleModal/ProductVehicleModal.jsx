import React, { useMemo } from "react";
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Card,
  Row,
  Col,
  Switch,
} from "antd";
import "./ProductVehicleModal.scss";

const { Option } = Select;

export default function ProductVehicleModal({
  form,
  visible,
  onCancel,
  onSubmit,
  editingVehicle,
  brands,
  models,
  categories,
  selectedBrand,
  setSelectedBrand,
}) {
  const category = form.getFieldValue("category") || editingVehicle?.category;
  const selectedCatName = Form.useWatch("category", form);
  // Lọc brand theo category
  const filteredBrands = useMemo(() => {
    if (!selectedCatName) return [];
    const matchedCat = categories.find((c) => c.name === selectedCatName);
    if (!matchedCat) return [];
    return brands.filter(
      (b) =>
        Array.isArray(b.categoryIds) &&
        b.categoryIds.includes(Number(matchedCat.id))
    );
  }, [brands, categories, selectedCatName]);

  // Lọc model theo brand được chọn
  const filteredModels = useMemo(() => {
    if (!selectedBrand) return [];
    return models.filter((m) => Number(m.brandId) === Number(selectedBrand));
  }, [models, selectedBrand]);

  return (
    <Modal
      className="vehicle-form-modal"
      title={editingVehicle ? "Cập nhật sản phẩm" : "Thêm sản phẩm mới"}
      open={visible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      okText="Lưu"
      cancelText="Hủy"
      width={850}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
        initialValues={{ category: "EV_CAR" }}
      >
        {/* ===== CATEGORY + BRAND + MODEL ===== */}
        {!editingVehicle && (
          <>
            <Form.Item
              label="Danh mục"
              name="category"
              rules={[{ required: true, message: "Vui lòng chọn danh mục" }]}
            >
              <Select
                showSearch
                placeholder="Chọn hoặc tìm danh mục"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
                onChange={() => {
                  form.setFieldsValue({
                    brandId: undefined,
                    modelId: undefined,
                  });
                  setSelectedBrand(null); // reset brand
                }}
              >
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
                  <Select
                    showSearch
                    placeholder={
                      form.getFieldValue("category")
                        ? "Chọn hoặc tìm thương hiệu"
                        : "Chọn danh mục trước"
                    }
                    disabled={!form.getFieldValue("category")}
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    onChange={(val) => {
                      setSelectedBrand(Number(val));
                      form.setFieldsValue({ modelId: undefined });
                    }}
                  >
                    {filteredBrands.map((b) => (
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
                  <Select
                    showSearch
                    placeholder={
                      selectedBrand
                        ? "Chọn hoặc tìm model"
                        : "Chọn thương hiệu trước"
                    }
                    disabled={!selectedBrand}
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                  >
                    {filteredModels.map((m) => (
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
              <InputNumber
                style={{ width: "100%" }}
                step={0.1}
                formatter={(v) => {
                  if (!v) return "";
                  return String(v).replace(".", ",");
                }}
                parser={(v) => {
                  if (!v) return "";
                  return v.replace(",", ".");
                }}
              />
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
              <InputNumber
                style={{ width: "100%" }}
                step={0.1}
                formatter={(v) => {
                  if (!v) return "";
                  return String(v).replace(".", ",");
                }}
                parser={(v) => {
                  if (!v) return "";
                  return v.replace(",", ".");
                }}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Sạc AC (kW)" name="acChargingKw">
              <InputNumber
                style={{ width: "100%" }}
                step={0.1}
                formatter={(v) => {
                  if (!v) return "";
                  return String(v).replace(".", ",");
                }}
                parser={(v) => {
                  if (!v) return "";
                  return v.replace(",", ".");
                }}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Sạc DC (kW)" name="dcChargingKw">
              <InputNumber
                style={{ width: "100%" }}
                step={0.1}
                formatter={(v) => {
                  if (!v) return "";
                  return String(v).replace(".", ",");
                }}
                parser={(v) => {
                  if (!v) return "";
                  return v.replace(",", ".");
                }}
              />
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

        {/* ===== Đầu nối ===== */}
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

        {/* ===== Detail theo loại ===== */}
        {category === "EV_CAR" && (
          <Card
            className="detail-section"
            title="Thông tin ô tô điện"
            size="small"
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
        )}

        {category === "E_MOTORBIKE" && (
          <Card
            className="detail-section"
            title="Thông tin xe máy điện"
            size="small"
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Vị trí động cơ" name="motorLocation">
                  <Select>
                    <Option value="HUB">HUB (trục bánh)</Option>
                    <Option value="MID">MID (giữa khung)</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Loại phanh" name="brakeType">
                  <Select>
                    <Option value="DISC">Phanh đĩa</Option>
                    <Option value="DRUM">Phanh tang trống</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Kích thước bánh xe" name="wheelSize">
                  <Input placeholder="VD: 14 inch" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Khối lượng (kg)" name="weightKg">
                  <InputNumber
                    style={{ width: "100%" }}
                    step={0.1}
                    formatter={(v) => {
                      if (!v) return "";
                      return String(v).replace(".", ",");
                    }}
                    parser={(v) => {
                      if (!v) return "";
                      return v.replace(",", ".");
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        )}

        {category === "E_BIKE" && (
          <Card
            className="detail-section"
            title="Thông tin xe đạp điện"
            size="small"
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Kích thước khung" name="frameSize">
                  <Input placeholder="VD: M, L, 18 inch..." />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Kích thước bánh xe" name="wheelSize">
                  <Input placeholder="VD: 26 inch" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Khối lượng (kg)" name="weightKg">
                  <InputNumber
                    style={{ width: "100%" }}
                    step={0.1}
                    formatter={(v) => {
                      if (!v) return "";
                      return String(v).replace(".", ",");
                    }}
                    parser={(v) => {
                      if (!v) return "";
                      return v.replace(",", ".");
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Tải trọng tối đa (kg)" name="maxLoad">
                  <InputNumber style={{ width: "100%" }} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Số cấp số (gears)" name="gears">
                  <InputNumber style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  label="Pin tháo rời"
                  name="removableBattery"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  label="Tay ga (throttle)"
                  name="throttle"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        )}
      </Form>
    </Modal>
  );
}

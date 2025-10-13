import React from "react";
import { Modal, Form, Input, InputNumber, Select, Row, Col } from "antd";
import "./ProductBatteryModal.scss";

const { Option } = Select;

export default function ProductBatteryModal({
  form,
  visible,
  onCancel,
  onSubmit,
  editingBattery,
  models,
}) {
  return (
    <Modal
      className="battery-form-modal"
      title={editingBattery ? "Cập nhật pin" : "Thêm pin mới"}
      open={visible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      okText="Lưu"
      cancelText="Hủy"
      width={700}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
        initialValues={{ status: "ACTIVE" }}
      >
        {!editingBattery && (
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Model"
                name="modelId"
                rules={[{ required: true, message: "Vui lòng chọn model" }]}
              >
                <Select
                  showSearch
                  placeholder="Chọn hoặc tìm model có pin"
                  optionFilterProp="label" 
                  filterOption={(input, option) =>
                    option.label.toLowerCase().includes(input.toLowerCase())
                  }
                  options={models.map((m) => ({
                    label: `${m.name} (${m.year})`, 
                    value: m.id,
                  }))}
                >
                  {models.map((m) => (
                    <Option key={m.id} value={m.id}>
                      {m.name} ({m.year})
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
  );
}

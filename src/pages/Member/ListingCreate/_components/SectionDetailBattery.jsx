import React from "react";
import { Form, Row, Col, InputNumber, Input } from "antd";
export default function SectionDetailBattery() {
  // validate SOH: (0, 100]
  const sohRule = {
    validator: (_, v) => {
      if (v === undefined || v === null || v === "")
        return Promise.reject(new Error("Nhập SOH (%)"));
      const n = Number(v);
      if (Number.isNaN(n) || n <= 0 || n > 100)
        return Promise.reject(new Error("SOH phải trong khoảng (0; 100]"));
      return Promise.resolve();
    },
  };

  return (
    <>
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item
            label="Dung lượng (kWh)"
            name="battery_capacity_kwh"
            rules={[{ required: true, message: "Nhập dung lượng kWh" }]}
          >
            <InputNumber
              min={0}
              step={0.1}
              style={{ width: "100%" }}
              placeholder="VD: 52"
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            label="Tình trạng pin (%SOH)"
            name="soh_percent"
            rules={[{ required: true }, sohRule]}
          >
            <InputNumber
              min={0}
              max={100}
              step={0.1}
              style={{ width: "100%" }}
              placeholder="VD: 95"
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item
            label="Điện áp (V)"
            name="voltage"
            rules={[{ required: true, message: "Nhập điện áp (V)" }]}
          >
            <InputNumber
              min={0}
              step={1}
              style={{ width: "100%" }}
              placeholder="VD: 355"
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            label="Hoá học pin (tuỳ chọn)"
            name="chemistry"
            rules={[
              { required: true, message: "Nhập hoá học pin (LFP, NMC,…)" },
            ]}
          >
            <Input placeholder="VD: LFP, NMC…" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item
            label="Khối lượng (kg) (tuỳ chọn)"
            name="weight_kg"
            rules={[{ required: true, message: "Nhập khối lượng (kg)" }]}
          >
            <InputNumber
              min={0}
              step={0.1}
              style={{ width: "100%" }}
              placeholder="VD: 220"
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            label="Kích thước (mm) (tuỳ chọn)"
            name="dimension"
            rules={[{ required: true, message: "Nhập kích thước (mm)" }]}
          >
            <Input placeholder="VD: 1700x1200x180" />
          </Form.Item>
        </Col>
      </Row>
    </>
  );
}

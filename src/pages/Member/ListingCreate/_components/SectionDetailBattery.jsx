import React from "react";
import { Form, Row, Col, InputNumber, Input } from "antd";
import {
  batteryCapacityRule,
  batterySOHRule,
  voltageRule,
  chemistryOptionalRule,
  weightOptionalRule,
  dimensionOptionalRule,
} from "@/validators/battery.rules";
import { priceRule } from "@/validators/common.rules";

export default function SectionDetailBattery() {
  return (
    <>
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item
            label="Dung lượng (kWh)"
            name="battery_capacity_kwh"
            rules={batteryCapacityRule}
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
            rules={batterySOHRule}
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
          <Form.Item label="Điện áp (V)" name="voltage" rules={voltageRule}>
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
            label="Hoá học pin (tùy chọn)"
            name="chemistry"
            rules={chemistryOptionalRule}
          >
            <Input placeholder="VD: LFP, NMC…" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item
            label="Khối lượng (kg) (tùy chọn)"
            name="weight_kg"
            rules={weightOptionalRule}
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
            label="Kích thước (mm) (tùy chọn)"
            name="dimension"
            rules={dimensionOptionalRule}
          >
            <Input placeholder="VD: 1700x1200x180" />
          </Form.Item>
        </Col>
      </Row>

      {/* 🔹 Giá bán thêm riêng một row */}
      
    </>
  );
}

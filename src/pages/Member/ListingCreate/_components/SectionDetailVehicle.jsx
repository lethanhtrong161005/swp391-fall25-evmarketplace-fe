import React from "react";
import { Form, Row, Col, InputNumber } from "antd";
import {
  vehicleBatteryCapacityRule,
  vehicleSOHRule,
  mileageRule,
  vehiclePriceRule,
} from "@/validators/vehicle.rules";

export default function SectionDetailVehicle() {
  return (
    <>
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item
            label="Dung lượng pin (kWh)"
            name="battery_capacity_kwh"
            rules={vehicleBatteryCapacityRule}
          >
            <InputNumber
              style={{ width: "100%" }}
              min={0}
              step={0.1}
              placeholder="VD: 42"
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            label="Tình trạng pin (%SOH)"
            name="soh_percent"
            rules={vehicleSOHRule}
          >
            <InputNumber
              style={{ width: "100%" }}
              min={0}
              max={100}
              step={0.1}
              placeholder="VD: 95.5"
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item
            label="Số Km đã đi"
            name="mileage_km"
            rules={mileageRule}
          >
            <InputNumber
              style={{ width: "100%" }}
              min={0}
              placeholder="VD: 15000"
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            label="Giá bán (VND)"
            name="price"
            rules={vehiclePriceRule}
          >
            <InputNumber
              style={{ width: "100%" }}
              min={0}
              step={100000}
              placeholder="VD: 460000000"
              formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(v) => v.replace(/\$\s?|(,*)/g, "")}
            />
          </Form.Item>
        </Col>
      </Row>
    </>
  );
}

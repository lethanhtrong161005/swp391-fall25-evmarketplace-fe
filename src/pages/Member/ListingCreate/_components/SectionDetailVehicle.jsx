import React from "react";
import { Form, Row, Col, InputNumber } from "antd";

export default function SectionDetailVehicle() {
  return (
    <>
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item
            label="Dung lượng pin (kWh)"
            name="battery_capacity_kwh"
            rules={[{ required: true, message: "Nhập dung lượng pin" }]}
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
            rules={[
              {
                required: true,
                message: "Nhập SOH (%)",
              },
              {
                validator: (_, v) => {
                  const n = Number(v);
                  return !Number.isNaN(n) && n > 0 && n <= 100
                    ? Promise.resolve()
                    : Promise.reject(
                        new Error("SOH phải trong khoảng (0; 100]")
                      );
                },
              },
            ]}
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
            rules={[{ required: true, message: "Nhập số Km" }]}
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
            rules={[{ required: true, message: "Nhập giá" }]}
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

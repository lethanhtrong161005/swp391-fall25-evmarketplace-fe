// src/pages/Listing/_components/YearColorFields.jsx
import React from "react";
import { Row, Col, Form, Select, AutoComplete, InputNumber } from "antd";
import { YEARS_EXTENDED } from "../_shared/constants";
import { priceRule } from "@/validators/common.rules";

export default function YearColorFields({ isBattery }) {
    return (
        <Row gutter={[16, 0]}>
            {/* Năm sản xuất (trái) */}
            <Col xs={24} md={12}>
                <Form.Item
                    label="Năm sản xuất"
                    name="year"
                    rules={[{ required: true, message: "Chọn năm" }]}
                >
                    <Select
                        showSearch
                        placeholder="Chọn năm"
                        options={YEARS_EXTENDED}
                        style={{ width: "100%" }}
                        filterOption={(input, option) =>
                            String(option?.label || "").toLowerCase().includes(input.toLowerCase())
                        }
                    />
                </Form.Item>
            </Col>

            {/* Cột phải: nếu là Battery -> Giá bán, ngược lại -> Màu sắc */}
            <Col xs={24} md={12}>
                {isBattery ? (
                    <Form.Item label="Giá bán (VND)" name="price" rules={priceRule}>
                        <InputNumber
                            min={0}
                            step={100000}
                            style={{ width: "100%" }}
                            placeholder="VD: 15.000.000"
                            formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                            parser={(v) => v.replace(/\$\s?|(,*)/g, "")}
                        />
                    </Form.Item>
                ) : (
                    <Form.Item label="Màu sắc (tùy chọn)" name="color">
                        <AutoComplete
                            allowClear
                            style={{ width: "100%" }}
                            options={[
                                { value: "Trắng", label: "Trắng" },
                                { value: "Đen", label: "Đen" },
                                { value: "Đỏ", label: "Đỏ" },
                                { value: "Xanh", label: "Xanh" },
                            ]}
                        />
                    </Form.Item>
                )}
            </Col>
        </Row>
    );
}

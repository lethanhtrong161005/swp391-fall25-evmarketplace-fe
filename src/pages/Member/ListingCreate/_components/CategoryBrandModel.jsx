// pages/listing/_components/CategoryBrandModel.jsx
import React, { useMemo } from "react";
import { Row, Col, Form, Select, AutoComplete, Input } from "antd";

export default function CategoryBrandModel({ form, tax }) {
    const categoryId = Form.useWatch("category", form);
    const brandId = Form.useWatch("brand_id", form); // lưu id thật

    const brandOptions = useMemo(
        () => (categoryId && tax ? tax.brandsByCategory[categoryId] || [] : []),
        [categoryId, tax]
    );

    const modelOptions = useMemo(() => {
        if (!categoryId || !brandId || !tax) return [];
        const key = `${categoryId}#${brandId}`;
        return tax.modelsByCatBrand[key] || [];
    }, [categoryId, brandId, tax]);

    return (
        <>
            <Form.Item
                name="category"
                label="Danh mục"
                rules={[{ required: true, message: "Chọn danh mục" }]}
            >
                <Select
                    options={tax?.categoryOptions}
                    placeholder="Chọn danh mục"
                    showSearch
                    filterOption={(i, opt) =>
                        String(opt?.label || "").toLowerCase().includes(i.toLowerCase())
                    }
                    onChange={() => {
                        // Reset khi đổi category
                        form.setFieldsValue({
                            brand: undefined,
                            brand_id: null,
                            model: undefined,
                            model_id: null,
                        });
                    }}
                />
            </Form.Item>

            <Row gutter={16}>
                <Col xs={24} md={12}>
                    <Form.Item
                        name="brand"
                        label="Hãng"
                        rules={[{ required: true, message: "Nhập hoặc chọn Hãng" }]}
                    >
                        <AutoComplete
                            options={brandOptions}
                            placeholder="Nhập hoặc chọn Hãng"
                            allowClear
                            onSelect={(_, option) => {
                                // chọn từ hệ thống → set id & tên
                                form.setFieldsValue({
                                    brand: option.label,
                                    brand_id: option.id,
                                    model: undefined,
                                    model_id: null,
                                });
                            }}
                            onChange={() => {
                                // đang gõ tự do → clear id
                                form.setFieldsValue({
                                    brand_id: null,
                                    model: undefined,
                                    model_id: null,
                                });
                            }}
                            filterOption={(i, opt) =>
                                String(opt?.label || "").toLowerCase().includes(i.toLowerCase())
                            }
                        />
                    </Form.Item>
                    {/* hidden: giữ id để submit */}
                    <Form.Item name="brand_id" hidden>
                        <Input />
                    </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                    <Form.Item
                        name="model"
                        label="Model"
                        rules={[{ required: true, message: "Nhập hoặc chọn Model" }]}
                    >
                        <AutoComplete
                            options={modelOptions}
                            placeholder="Nhập hoặc chọn Model"
                            allowClear
                            //disabled={!brandId && !form.getFieldValue("brand")}
                            onSelect={(_, option) =>
                                form.setFieldsValue({ model: option.label, model_id: option.id })
                            }
                            onChange={() => form.setFieldsValue({ model_id: null })}
                            filterOption={(i, opt) =>
                                String(opt?.label || "").toLowerCase().includes(i.toLowerCase())
                            }
                        />
                    </Form.Item>
                    {/* hidden: giữ id để submit */}
                    <Form.Item name="model_id" hidden>
                        <Input />
                    </Form.Item>
                </Col>
            </Row>
        </>
    );
}

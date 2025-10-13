import React, { useMemo, useState } from "react";
import { Row, Col, Form, Select, AutoComplete, Input } from "antd";
import styles from "./index.module.scss";

export default function CategoryBrandModel({ form, tax, disableCategory = false }) {
    const categoryId = Form.useWatch("category", form);
    const brandId = Form.useWatch("brand_id", form);

    // --- state để điều khiển tìm kiếm ---
    const [brandSearch, setBrandSearch] = useState("");
    const [modelSearch, setModelSearch] = useState("");

    const brandOptionsRaw = useMemo(
        () => (categoryId && tax ? (tax.brandsByCategory[categoryId] || []) : []),
        [categoryId, tax]
    );
    const modelOptionsRaw = useMemo(() => {
        if (!categoryId || !brandId || !tax) return [];
        const key = `${categoryId}#${brandId}`;
        return tax.modelsByCatBrand[key] || [];
    }, [categoryId, brandId, tax]);

    // Lọc theo text tự quản. Rỗng => trả full list
    const brandOptions = useMemo(() => {
        const q = brandSearch.trim().toLowerCase();
        if (!q) return brandOptionsRaw;
        return brandOptionsRaw.filter(o => String(o.label).toLowerCase().includes(q));
    }, [brandSearch, brandOptionsRaw]);

    const modelOptions = useMemo(() => {
        const q = modelSearch.trim().toLowerCase();
        if (!q) return modelOptionsRaw;
        return modelOptionsRaw.filter(o => String(o.label).toLowerCase().includes(q));
    }, [modelSearch, modelOptionsRaw]);

    return (
        <>
            <Form.Item
                className={styles.formItem}
                name="category"
                label="Danh mục"
                rules={[{ required: true, message: "Chọn danh mục" }]}
            >
                <Select
                    className={styles.select}
                    popupClassName={styles.dropdown}
                    options={tax?.categoryOptions}
                    placeholder="Chọn danh mục"
                    showSearch
                    disabled={disableCategory}
                    filterOption={(i, opt) =>
                        String(opt?.label || "").toLowerCase().includes(i.toLowerCase())
                    }
                    onChange={
                        disableCategory
                            ? undefined
                            : () => {
                                form.setFieldsValue({
                                    brand: undefined,
                                    brand_id: undefined,
                                    model: undefined,
                                    model_id: undefined,
                                });
                                setBrandSearch("");
                                setModelSearch("");
                            }
                    }
                />
            </Form.Item>

            <Row gutter={16} className={styles.rowSpacing}>
                <Col xs={24} md={12}>
                    <Form.Item
                        className={styles.formItem}
                        name="brand"
                        label="Hãng"
                        rules={[{ required: true, message: "Nhập hoặc chọn Hãng" }]}
                    >
                        <AutoComplete
                            className={styles.autoComplete}
                            popupClassName={styles.dropdown}
                            // QUAN TRỌNG: tắt filterOption để không bị AntD tự lọc theo giá trị đang hiển thị
                            filterOption={false}
                            options={brandOptions}
                            placeholder="Nhập hoặc chọn Hãng"
                            allowClear
                            onSearch={(val) => setBrandSearch(val)}      // user đang gõ
                            onDropdownVisibleChange={(open) => {
                                if (open) setBrandSearch("");               // mở dropdown -> show full
                            }}
                            onSelect={(_, option) => {
                                form.setFieldsValue({
                                    brand: option.label,
                                    brand_id: option.id,
                                    model: undefined,
                                    model_id: null,
                                });
                                setModelSearch("");                         // reset model search khi đổi brand
                            }}
                            onChange={() => {
                                form.setFieldsValue({
                                    brand_id: undefined,
                                    model: undefined,
                                    model_id: undefined,
                                });
                            }}
                        />
                    </Form.Item>
                    <Form.Item name="brand_id" hidden><Input /></Form.Item>
                </Col>

                <Col xs={24} md={12}>
                    <Form.Item
                        className={styles.formItem}
                        name="model"
                        label="Model"
                        rules={[{ required: true, message: "Nhập hoặc chọn Model" }]}
                    >
                        <AutoComplete
                            className={styles.autoComplete}
                            popupClassName={styles.dropdown}
                            filterOption={false}
                            options={modelOptions}
                            placeholder="Nhập hoặc chọn Model"
                            allowClear
                            onSearch={(val) => setModelSearch(val)}
                            onDropdownVisibleChange={(open) => {
                                if (open) setModelSearch("");
                            }}
                            onSelect={(_, option) =>
                                form.setFieldsValue({ model: option.label, model_id: option.id })
                            }
                            onChange={() => form.setFieldsValue({ model_id: undefined })}
                        />
                    </Form.Item>
                    <Form.Item name="model_id" hidden><Input /></Form.Item>
                </Col>
            </Row>
        </>
    );
}

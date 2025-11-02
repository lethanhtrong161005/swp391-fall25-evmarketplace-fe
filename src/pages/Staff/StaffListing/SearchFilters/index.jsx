import React from "react";
import { Button, Col, DatePicker, Input, Row, Select, Space } from "antd";
import s from "./styles.module.scss";

const ITEM_TYPES = [
    { label: "Phương tiện", value: "VEHICLE" },
    { label: "Pin", value: "BATTERY" },
];

const STATUS_OPTIONS = [
    { label: "Đang hoạt động", value: "ACTIVE" },
    { label: "Đã bán", value: "SOLD" },
    { label: "Hết hạn", value: "EXPIRED" },
    { label: "Ẩn", value: "HIDDEN" },
    { label: "Đã xoá", value: "DELETED" },
];

// Tối giản: chỉ còn text search + chọn loại (Xe/Pin)

export default function SearchFilters({ value = {}, onChange, onSubmit }) {
    const v = value || {};
    const set = (patch) => onChange && onChange(patch);

    return (
        <div className={s.root}>
            <Space direction="vertical" style={{ width: "100%" }} size={12}>
                <Row gutter={[12, 12]} align="middle">
                    <Col xs={24} md={12}>
                        <Input
                            allowClear
                            placeholder="Tìm kiếm tiêu đề, mô tả, địa chỉ..."
                            value={v.q}
                            onChange={(e) => set({ q: e.target.value })}
                        />
                    </Col>
                    <Col xs={12} md={6}>
                        <Select
                            allowClear
                            placeholder="Loại (Xe/Pin)"
                            options={ITEM_TYPES}
                            value={v.itemType}
                            onChange={(val) => set({ itemType: val })}
                            style={{ width: "100%" }}
                        />
                    </Col>
                    <Col xs={24} md={12}>
                        <Space direction="vertical" size={4} style={{ width: "100%" }}>
                            <div>Ngày tạo</div>
                            <DatePicker.RangePicker
                                allowEmpty={[true, true]}
                                style={{ width: "100%" }}
                                placeholder={["Từ ngày", "Đến ngày"]}
                                onChange={(_, dateStrings) => set({ createdAtFrom: dateStrings?.[0] || undefined, createdAtTo: dateStrings?.[1] || undefined })}
                            />
                        </Space>
                    </Col>
                    <Col xs={12} md={6}>
                        <Select
                            allowClear
                            placeholder="Trạng thái"
                            options={STATUS_OPTIONS}
                            value={v.status}
                            onChange={(val) => set({ status: val })}
                            style={{ width: "100%" }}
                        />
                    </Col>
                    <Col xs={12} md={6}>
                        <Space>
                            <Button type="primary" onClick={onSubmit}>Tìm kiếm</Button>
                            <Button onClick={() => onChange && onChange({ q: "", itemType: undefined, status: undefined })}>Làm mới</Button>
                        </Space>
                    </Col>
                </Row>
            </Space>
        </div>
    );
}


import React from "react";
import s from "./SearchActions.module.scss";
import dayjs from "dayjs";
import { Card, Form, Row, Col, Input, DatePicker, Button, Space } from "antd";
import { SearchOutlined, CloseCircleOutlined, ReloadOutlined, FilterOutlined } from "@ant-design/icons";

const { RangePicker } = DatePicker;

export default function SearchActions({
    orderNo,
    createdRange,
    effectiveRange,
    setOrderNo,
    setCreatedRange,
    setEffectiveRange,
    onSearchSubmit,
    onResetFilters,
    onRefresh, // optional
}) {
    const presets = [
        { label: "Hôm nay", value: [dayjs().startOf("day"), dayjs().endOf("day")] },
        { label: "Hôm qua", value: [dayjs().subtract(1, "day").startOf("day"), dayjs().subtract(1, "day").endOf("day")] },
        { label: "7 ngày", value: [dayjs().subtract(6, "day").startOf("day"), dayjs().endOf("day")] },
        { label: "30 ngày", value: [dayjs().subtract(29, "day").startOf("day"), dayjs().endOf("day")] },
    ];

    return (
        <Card className={s.root} size="small" bordered={false}>
            <div className={s.header}>
                <div className={s.heading}>
                    <FilterOutlined /> <span>Bộ lọc</span>
                </div>

                {/* iPad & Desktop: nút hành động ở header phải */}
                <div className={s.headerActions}>
                    <Space wrap>
                        <Button onClick={onResetFilters} icon={<CloseCircleOutlined />}>Xóa lọc</Button>
                        {onRefresh && <Button onClick={onRefresh} icon={<ReloadOutlined />} />}
                        <Button type="primary" icon={<SearchOutlined />} onClick={onSearchSubmit}>
                            Tìm kiếm
                        </Button>
                    </Space>
                </div>
            </div>

            <Form layout="vertical" onFinish={onSearchSubmit} className={s.form}>
                <Row gutter={{ xs: 8, sm: 12, md: 12, lg: 16, xl: 16 }} align="bottom">
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <Form.Item label="Mã đơn (orderNo)">
                            <Input
                                allowClear
                                placeholder="Nhập mã đơn..."
                                value={orderNo}
                                onChange={(e) => setOrderNo(e.target.value)}
                                onPressEnter={(e) => { e.preventDefault(); onSearchSubmit(); }}
                                prefix={<SearchOutlined />}
                                inputMode="search"
                            />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={12} md={8} lg={8}>
                        <Form.Item label="Thời gian tạo (CreatedAt)">
                            <RangePicker
                                value={createdRange}
                                onChange={(v) => setCreatedRange(v || [])}
                                showTime={{ format: "HH:mm:ss" }}
                                presets={presets}
                                className={s.fullWidth}
                            />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={12} md={8} lg={8}>
                        <Form.Item label="Hiệu lực (Effective)">
                            <RangePicker
                                value={effectiveRange}
                                onChange={(v) => setEffectiveRange(v || [])}
                                showTime={{ format: "HH:mm:ss" }}
                                presets={presets}
                                className={s.fullWidth}
                            />
                        </Form.Item>
                    </Col>

                    {/* Mobile-only: nhóm nút dưới form */}
                    <Col xs={24} md={24} lg={2} className={s.buttonsCol}>
                        <Space wrap className={s.buttons}>
                            <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>Tìm kiếm</Button>
                            <Button onClick={onResetFilters} icon={<CloseCircleOutlined />}>Xóa lọc</Button>
                            {onRefresh && <Button onClick={onRefresh} icon={<ReloadOutlined />}>Tải lại</Button>}
                        </Space>
                    </Col>
                </Row>
            </Form>
        </Card>
    );
}



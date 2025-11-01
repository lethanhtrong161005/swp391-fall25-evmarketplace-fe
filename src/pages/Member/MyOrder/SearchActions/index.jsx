import React from "react";
import s from "./SearchActions.module.scss";
import dayjs from "dayjs";
import { Card, Form, Row, Col, Input, Select, DatePicker, Button, Space } from "antd";
import { SearchOutlined, CloseCircleOutlined, ReloadOutlined, FilterOutlined } from "@ant-design/icons";
import { STATUS_OPTIONS } from "../constants";

const { RangePicker } = DatePicker;

export default function SearchActions({
    orderNo, status, dateRange,
    onChangeOrderNo, onChangeStatus, onChangeDateRange,
    onSearchSubmit, onResetFilters, onRefresh,
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
                {/* Hiện trên iPad trở lên */}
                <div className={s.headerActions}>
                    <Space wrap>
                        <Button size="middle" onClick={onResetFilters} icon={<CloseCircleOutlined />}>Xóa lọc</Button>
                        <Button size="middle" onClick={onRefresh} icon={<ReloadOutlined />} />
                        <Button size="middle" type="primary" icon={<SearchOutlined />} onClick={onSearchSubmit}>
                            Tìm kiếm
                        </Button>
                    </Space>
                </div>
            </div>

            <Form layout="vertical" onFinish={onSearchSubmit} className={s.form}>
                <Row gutter={{ xs: 8, sm: 12, md: 12, lg: 16, xl: 16 }} align="bottom">
                    {/* iPhone: full width; iPad: 1/2; Desktop: 1/4 */}
                    <Col xs={24} sm={24} md={12} lg={6}>
                        <Form.Item label="Mã đơn (orderNo)">
                            <Input
                                allowClear
                                placeholder="VD: ORDER-20251025-XXXX"
                                value={orderNo}
                                onChange={(e) => onChangeOrderNo(e.target.value)}
                                onPressEnter={(e) => { e.preventDefault(); onSearchSubmit(); }}
                                prefix={<SearchOutlined />}
                                inputMode="search"
                            />
                        </Form.Item>
                    </Col>

                    {/* iPhone: full width; iPad: 1/2; Desktop: 1/4 */}
                    <Col xs={24} sm={24} md={12} lg={6}>
                        <Form.Item label="Trạng thái">
                            <Select
                                allowClear
                                placeholder="Chọn trạng thái"
                                value={status}
                                options={STATUS_OPTIONS}
                                onChange={onChangeStatus}
                                className={s.select}
                            />
                        </Form.Item>
                    </Col>

                    {/* iPhone: full; iPad: full; Desktop: 1/3 */}
                    <Col xs={24} sm={24} md={24} lg={8}>
                        <Form.Item label="Khoảng thời gian (CreatedAt)">
                            <RangePicker
                                className={s.fullWidth}
                                allowClear
                                value={dateRange}
                                onChange={onChangeDateRange}
                                showTime={{
                                    format: "HH:mm:ss",
                                    defaultValue: [dayjs().startOf("day"), dayjs().endOf("day")],
                                }}
                                presets={presets}
                                placement="bottomLeft"
                            />
                        </Form.Item>
                    </Col>

                    {/* Nút cho iPhone (ẩn trên iPad/desktop) */}
                    <Col xs={24} md={24} lg={4} className={s.buttonsCol}>
                        <Space wrap className={s.buttons}>
                            <Button size="middle" type="primary" htmlType="submit" icon={<SearchOutlined />}>
                                Tìm kiếm
                            </Button>
                            <Button size="middle" onClick={onResetFilters} icon={<CloseCircleOutlined />}>
                                Xóa lọc
                            </Button>
                            <Button size="middle" onClick={onRefresh} icon={<ReloadOutlined />}>
                                Tải lại
                            </Button>
                        </Space>
                    </Col>
                </Row>
            </Form>
        </Card>
    );
}

export function useOrderFilters() {
    const ReactRef = React;
    const { useState } = ReactRef;
    const [orderNo, setOrderNo] = useState("");
    const [status, setStatus] = useState();
    const [dateRange, setDateRange] = useState([]);
    const resetFilters = () => { setOrderNo(""); setStatus(undefined); setDateRange([]); };
    return { orderNo, status, dateRange, setOrderNo, setStatus, setDateRange, resetFilters };
}

